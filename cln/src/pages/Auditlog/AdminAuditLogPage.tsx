import React, { useState, useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { fetchAuditLogs, type AuditLogItem, type AuditLogStats } from '../../api/auditlogApi';
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
  const [stats, setStats] = useState<AuditLogStats | undefined>(undefined);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  const [search, setSearch] = useState<string>('');
  const [actionFilter, setActionFilter] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const [viewMode, setViewMode] = useState<'timeline' | 'table'>('timeline');
  const [selectedLog, setSelectedLog] = useState<AuditLogItem | null>(null);

  /**
   * useRef สำหรับเก็บอ้างอิงของ Debounce Timer ป้องกันการยิง API ซ้ำซ้อนเมื่อผู้ใช้กด Enter หรือกดปุ่มค้นหาในฟอร์ม
   */
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
      if (res.stats) {
        setStats(res.stats);
      }
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

  /**
   * โหลดข้อมูลอัตโนมัติเมื่อมีการเปลี่ยนแปลงเงื่อนไข (พร้อม Debounce 400ms)
   * โดยจะล้าง timerRef ก่อนทุกครั้งเพื่อป้องกันการยิง API ซ้ำซ้อน
   */
  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      loadData();
    }, 400);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [page, rowsPerPage, search, actionFilter, startDate, endDate]);

  /**
   * จัดการการค้นหาเมื่อผู้ใช้กด Enter หรือ submit ฟอร์ม
   * จะทำการยกเลิก Debounce Timer ที่ค้างอยู่ทันที และดึงข้อมูลใหม่เพียงครั้งเดียว
   */
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (timerRef.current) {
      clearTimeout(timerRef.current); // ยกเลิก Timer ที่ค้างอยู่ออกทันที
    }
    loadData();
  };

  return (
    <MainLayout activeItem="Audit Logs">
      {/* จัดระเบียบ Layout มาตรฐานเดียวกับหน้า Users, Exercises และ Reports พร้อมปรับระยะห่าง gap ให้กระชับพอดี (20px) */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, width: '100%', maxWidth: '1440px', margin: '0 auto' }}>
        {/* 1. สรุปภาพรวมสถิติ KPI Metrics Header */}
        <AuditLogStatsHeader stats={stats} total={total} />

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