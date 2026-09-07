import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { fetchAuditLogs, type AuditLogItem } from '../../api/auditlogApi';
import { MainLayout } from '../../components/Layout/MainLayout';
import { AuditLogStatsHeader } from './components/AuditLogStatsHeader';
import { AuditLogFilter } from './components/AuditLogFilter';
import { AuditLogTimelineFeed } from './components/AuditLogTimelineFeed';
import { AuditLogTable } from './components/AuditLogTable';
import { AuditLogDetailDialog } from './components/AuditLogDetailDialog';

export const AdminAuditLogPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  const [search, setSearch] = useState<string>('');
  const [actionFilter, setActionFilter] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const [viewMode, setViewMode] = useState<'timeline' | 'table'>('timeline');
  const [selectedLog, setSelectedLog] = useState<AuditLogItem | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchAuditLogs({
        page: page + 1,
        limit: rowsPerPage,
        search: search.trim() || undefined,
        action: actionFilter || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });
      setLogs(res.data);
      setTotal(res.total);
    } catch (err) {
      console.error('ไม่สามารถดึงข้อมูล Audit Logs ได้:', err);
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันจัดการการอัปเดตตัวกรองพร้อมรีเซ็ตหน้ากลับเป็นหน้าแรก (Page 0)
  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(0);
  };

  const handleActionChange = (val: string) => {
    setActionFilter(val);
    setPage(0);
  };

  const handleStartDateChange = (val: string) => {
    setStartDate(val);
    setPage(0);
  };

  const handleEndDateChange = (val: string) => {
    setEndDate(val);
    setPage(0);
  };

  const handleResetFilters = () => {
    setSearch('');
    setActionFilter('');
    setStartDate('');
    setEndDate('');
    setPage(0);
  };

  // โหลดข้อมูลอัตโนมัติเมื่อมีการเปลี่ยนแปลงเงื่อนไข (พร้อม Debounce 400ms ป้องกันการยิง API ซ้ำ)
  useEffect(() => {
    const timer = setTimeout(() => {
      loadData();
    }, 400);

    return () => clearTimeout(timer);
  }, [page, rowsPerPage, search, actionFilter, startDate, endDate]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  return (
    <MainLayout activeItem="Audit Logs">
      <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400, margin: '0 auto' }}>
        {/* 1. สรุปภาพรวมสถิติ KPI Metrics Header */}
        <AuditLogStatsHeader logs={logs} total={total} />

        {/* 2. ตัวกรองข้อมูล Search/Filter & View Mode Switcher */}
        <AuditLogFilter
          search={search}
          setSearch={handleSearchChange}
          actionFilter={actionFilter}
          setActionFilter={handleActionChange}
          startDate={startDate}
          setStartDate={handleStartDateChange}
          endDate={endDate}
          setEndDate={handleEndDateChange}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onSearch={handleSearchSubmit}
          onRefresh={loadData}
          onReset={handleResetFilters}
        />

        {/* 3. Main Content Display (Timeline Stream View vs Classic Table View) */}
        {viewMode === 'timeline' ? (
          <AuditLogTimelineFeed
            logs={logs}
            loading={loading}
            total={total}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={(newPage) => setPage(newPage)}
            onRowsPerPageChange={(newLimit) => {
              setRowsPerPage(newLimit);
              setPage(0);
            }}
            onSelectLog={(log) => setSelectedLog(log)}
          />
        ) : (
          <AuditLogTable
            logs={logs}
            loading={loading}
            total={total}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={(newPage) => setPage(newPage)}
            onRowsPerPageChange={(newLimit) => {
              setRowsPerPage(newLimit);
              setPage(0);
            }}
            onSelectLog={(log) => setSelectedLog(log)}
          />
        )}

        {/* 4. JSON Payload Detail Inspection Dialog */}
        <AuditLogDetailDialog selectedLog={selectedLog} onClose={() => setSelectedLog(null)} />
      </Box>
    </MainLayout>
  );
};

export default AdminAuditLogPage;