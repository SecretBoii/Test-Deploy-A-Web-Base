import React, { useState, useEffect, useMemo } from 'react';
import { Box, Card, Pagination } from '@mui/material';
import axios from 'axios';
import { apiClient } from '../../../api/client';
import { SessionToolbar } from './teacher/SessionToolbar';
import { SessionTable } from './teacher/SessionTable';
import { SessionDialog } from './teacher/SessionDialog';
import { SessionPreviewDialog } from './teacher/SessionPreviewDialog';
import { ConfirmDialog } from './teacher/ConfirmDialog';
import type {
  TeacherSessionItem,
  SessionSortField,
  SessionSortOrder,
  SessionFormData,
} from '../types';

export const TeacherSession: React.FC = () => {
  const [sessions, setSessions] = useState<TeacherSessionItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Sorting
  const [sortField, setSortField] = useState<SessionSortField>('id');
  const [sortOrder, setSortOrder] = useState<SessionSortOrder>('asc');

  // Pagination
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  // Modals state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<TeacherSessionItem | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewSession, setPreviewSession] = useState<TeacherSessionItem | null>(null);

  // Delete confirm state
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/sessions/all');
      setSessions(res.data);
    } catch (err) {
      console.error('Failed to fetch sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter & Sort Pipeline
  const filteredAndSortedSessions = useMemo(() => {
    let result = [...sessions];

    // 1. กรองคำค้นหา
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.sessionName.toLowerCase().includes(q) ||
          s.sessionObjective.toLowerCase().includes(q) ||
          String(s.sessionId).includes(q)
      );
    }

    // 2. กรองตาม Target Level
    if (selectedLevel !== 'all') {
      const lvl = Number(selectedLevel);
      result = result.filter((s) => s.targetLevel === lvl);
    }

    // 3. กรองตามสถานะ
    if (selectedStatus !== 'all') {
      result = result.filter((s) => s.status === selectedStatus);
    }

    // 4. จัดเรียง (Sort)
    return result.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'id') comparison = a.sessionId - b.sessionId;
      else if (sortField === 'level') comparison = a.targetLevel - b.targetLevel;
      else if (sortField === 'duration') comparison = a.duration - b.duration;
      else if (sortField === 'name') comparison = a.sessionName.localeCompare(b.sessionName);

      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [sessions, searchQuery, selectedLevel, selectedStatus, sortField, sortOrder]);

  // จัดการ Pagination
  const totalPages = Math.ceil(filteredAndSortedSessions.length / rowsPerPage) || 1;
  const paginatedSessions = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredAndSortedSessions.slice(start, start + rowsPerPage);
  }, [filteredAndSortedSessions, page, rowsPerPage]);

  const handleSort = (field: SessionSortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedLevel('all');
    setSelectedStatus('all');
    setPage(1);
  };

  // Actions
  const handleOpenCreate = () => {
    setSelectedSession(null);
    setDialogOpen(true);
  };

  const handleEdit = (session: TeacherSessionItem) => {
    setSelectedSession(session);
    setDialogOpen(true);
  };

  const handlePreview = (session: TeacherSessionItem) => {
    setPreviewSession(session);
    setPreviewOpen(true);
  };

  const handleDeleteClick = (sessionId: number) => {
    setDeleteId(sessionId);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    try {
      setDeleting(true);
      await apiClient.delete(`/sessions/${deleteId}`);
      setDeleteId(null);
      fetchSessions();
    } catch (err) {
      console.error('Delete session error:', err);
      const message = axios.isAxiosError(err)
        ? (err.response?.data as { message?: string })?.message
        : undefined;
      alert(message || 'เกิดข้อผิดพลาดในการลบชุดบทเรียน');
    } finally {
      setDeleting(false);
    }
  };

  const handleSaveSession = async (formData: SessionFormData) => {
    try {
      if (selectedSession) {
        await apiClient.put(`/sessions/${selectedSession.sessionId}`, formData);
      } else {
        await apiClient.post('/sessions', formData);
      }
      fetchSessions();
    } catch (err) {
      console.error('Save session error:', err);
      const message = axios.isAxiosError(err)
        ? (err.response?.data as { message?: string })?.message
        : undefined;
      alert(message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
      throw err;
    }
  };

  const isFiltered = searchQuery !== '' || selectedLevel !== 'all' || selectedStatus !== 'all';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%', maxWidth: '1440px', margin: '0 auto' }}>
      {/* Table Container wrapped in Card to match ExercisesPage style */}
      <Card sx={{ p: 3, borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: 'none', overflow: 'hidden', bgcolor: '#ffffff' }}>
        {/* Toolbar & Filters */}
        <SessionToolbar
          totalCount={filteredAndSortedSessions.length}
          searchQuery={searchQuery}
          onSearchChange={(q) => {
            setSearchQuery(q);
            setPage(1);
          }}
          selectedLevel={selectedLevel}
          onLevelChange={(lvl) => {
            setSelectedLevel(lvl);
            setPage(1);
          }}
          selectedStatus={selectedStatus}
          onStatusChange={(status) => {
            setSelectedStatus(status);
            setPage(1);
          }}
          isFiltered={isFiltered}
          onResetFilters={handleResetFilters}
          onOpenCreate={handleOpenCreate}
          onRefresh={fetchSessions}
          loading={loading}
        />

        {/* Sessions Table */}
        <SessionTable
          sessions={paginatedSessions}
          sortField={sortField}
          sortOrder={sortOrder}
          onSort={handleSort}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          onPreview={handlePreview}
          loading={loading}
        />

        {/* Pagination & Summary Controls (Matching Exercises style) */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
            pt: 2.5,
            borderTop: '1px solid #e2e8f0',
            mt: 2,
          }}
        >
          <Box sx={{ color: '#64748b', fontSize: '13px', fontWeight: 500 }}>
            แสดง{' '}
            {filteredAndSortedSessions.length === 0 ? 0 : (page - 1) * rowsPerPage + 1} –{' '}
            {Math.min(page * rowsPerPage, filteredAndSortedSessions.length)} จากทั้งหมด{' '}
            <Box component="span" sx={{ fontWeight: 700, color: '#0f172a' }}>
              {filteredAndSortedSessions.length}
            </Box>{' '}
            รายการ
          </Box>

          {totalPages > 1 && (
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, value) => setPage(value)}
              shape="rounded"
              size="medium"
              sx={{
                '& .MuiPaginationItem-root': {
                  fontWeight: 600,
                  fontSize: '13px',
                  borderRadius: '8px',
                  color: '#475569',
                },
                '& .Mui-selected': {
                  bgcolor: '#4f46e5 !important',
                  color: '#ffffff !important',
                },
              }}
            />
          )}
        </Box>
      </Card>

      {/* Dialog สร้าง/แก้ไข */}
      <SessionDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSaveSession}
        sessionData={selectedSession}
      />

      {/* Dialog พรีวิวโจทย์ */}
      <SessionPreviewDialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        session={previewSession}
        onEdit={(s) => {
          setPreviewOpen(false);
          handleEdit(s);
        }}
      />

      {/* Dialog ยืนยันการลบชุดบทเรียน */}
      <ConfirmDialog
        open={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="ยืนยันการลบชุดบทเรียน"
        message="คุณแน่ใจหรือไม่ว่าต้องการลบชุดบทเรียนนี้? หากมีแบบฝึกหัดผูกอยู่ ความสัมพันธ์จะถูกยกเลิก และไม่สามารถกู้คืนได้"
        confirmText="ยืนยันการลบ"
        confirmColor="error"
        loading={deleting}
      />

    </Box>
  );
};

export default TeacherSession;
