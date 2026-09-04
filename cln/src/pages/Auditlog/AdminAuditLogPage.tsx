import React, { useState, useEffect } from 'react';
import { Box, Typography, Stack } from '@mui/material';
import { ShieldAlert } from 'lucide-react';
import { fetchAuditLogs, type AuditLogItem } from '../../api/auditlogApi';
import { MainLayout } from '../../components/Layout/MainLayout';
import { AuditLogFilter } from './components/AuditLogFilter';
import { AuditLogTable } from './components/AuditLogTable';
import { AuditLogDetailDialog } from './components/AuditLogDetailDialog';

/**
 * Main Container Page ทำหน้าที่ถือ State หลักและประสานงาน Subcomponents
 */
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

  const [selectedLog, setSelectedLog] = useState<AuditLogItem | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchAuditLogs({
        page: page + 1,
        limit: rowsPerPage,
        search,
        action: actionFilter,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });
      setLogs(res.data);
      setTotal(res.total);
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  // รีเซ็ตกลับไปหน้าแรกเมื่อเปลี่ยนเงื่อนไขค้นหากรองข้อมูล
  useEffect(() => {
    setPage(0);
  }, [search, actionFilter, startDate, endDate]);

  // โหลดข้อมูลอัตโนมัติเมื่อมีการเปลี่ยนแปลงเงื่อนไข (พร้อม Debounce 400ms สำหรับการพิมพ์ข้อความ)
  useEffect(() => {
    const timer = setTimeout(() => {
      loadData();
    }, 400);

    return () => clearTimeout(timer);
  }, [page, rowsPerPage, search, actionFilter, startDate, endDate]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    loadData();
  };

  return (
    <MainLayout activeItem="Audit Logs">
      <Box sx={{ p: 1, maxWidth: 1400, margin: '0 auto' }}>
        <Stack direction="row" sx={{ alignItems: 'center', mb: 3 }} spacing={1}>
          <ShieldAlert size={28} color="#1976d2" />
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Admin Audit Logs (ประวัติการใช้งานระบบ)
          </Typography>
        </Stack>

        <AuditLogFilter
          search={search}
          setSearch={setSearch}
          actionFilter={actionFilter}
          setActionFilter={setActionFilter}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          onSearch={handleSearchSubmit}
          onRefresh={loadData}
        />

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

        <AuditLogDetailDialog selectedLog={selectedLog} onClose={() => setSelectedLog(null)} />
      </Box>
    </MainLayout>
  );
};

export default AdminAuditLogPage;