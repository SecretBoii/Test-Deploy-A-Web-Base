import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Box,
  Typography,
  TableSortLabel,
  CircularProgress,
} from '@mui/material';
import { Edit3, Trash2, Eye, Layers } from 'lucide-react';
import { DIFFICULTY_LEVELS } from '../../../../constants/difficulty';
import type { TeacherSessionItem, SessionSortField, SessionSortOrder } from '../../types';

interface SessionTableProps {
  sessions: TeacherSessionItem[];
  sortField: SessionSortField;
  sortOrder: SessionSortOrder;
  onSort: (field: SessionSortField) => void;
  onEdit: (session: TeacherSessionItem) => void;
  onDelete: (sessionId: number) => void;
  onPreview: (session: TeacherSessionItem) => void;
  loading?: boolean;
}

export const SessionTable: React.FC<SessionTableProps> = ({
  sessions,
  sortField,
  sortOrder,
  onSort,
  onEdit,
  onDelete,
  onPreview,
  loading = false,
}) => {
  return (
    <TableContainer sx={{ overflowX: 'auto' }}>
      <Table sx={{ minWidth: 950 }}>
        <TableHead>
          <TableRow
            sx={{
              bgcolor: '#f8fafc',
              '& th': {
                borderBottom: '1px solid #e2e8f0',
                fontWeight: 700,
                color: '#475569',
                fontSize: '13px',
                py: 1.8,
                whiteSpace: 'nowrap',
              },
            }}
          >
            {/* Header รหัสบทเรียน */}
            <TableCell width="95px">
              <TableSortLabel
                active={sortField === 'id'}
                direction={sortField === 'id' ? sortOrder : 'asc'}
                onClick={() => onSort('id')}
                sx={{
                  '&.Mui-active': { color: '#0f172a', fontWeight: 800 },
                  '& .MuiTableSortLabel-icon': { color: '#475569 !important' },
                }}
              >
                รหัสบทเรียน
              </TableSortLabel>
            </TableCell>

            {/* Header ชื่อบทเรียนและจุดประสงค์ */}
            <TableCell sx={{ minWidth: '240px' }}>
              <TableSortLabel
                active={sortField === 'name'}
                direction={sortField === 'name' ? sortOrder : 'asc'}
                onClick={() => onSort('name')}
                sx={{
                  '&.Mui-active': { color: '#0f172a', fontWeight: 800 },
                  '& .MuiTableSortLabel-icon': { color: '#475569 !important' },
                }}
              >
                ชื่อบทเรียนและจุดประสงค์
              </TableSortLabel>
            </TableCell>

            {/* Header ระดับเป้าหมาย */}
            <TableCell sx={{ minWidth: '170px' }}>
              <TableSortLabel
                active={sortField === 'level'}
                direction={sortField === 'level' ? sortOrder : 'asc'}
                onClick={() => onSort('level')}
                sx={{
                  '&.Mui-active': { color: '#0f172a', fontWeight: 800 },
                  '& .MuiTableSortLabel-icon': { color: '#475569 !important' },
                }}
              >
                ระดับเป้าหมาย
              </TableSortLabel>
            </TableCell>

            {/* Header ระยะเวลา */}
            <TableCell sx={{ width: '120px' }}>
              <TableSortLabel
                active={sortField === 'duration'}
                direction={sortField === 'duration' ? sortOrder : 'asc'}
                onClick={() => onSort('duration')}
                sx={{
                  '&.Mui-active': { color: '#0f172a', fontWeight: 800 },
                  '& .MuiTableSortLabel-icon': { color: '#475569 !important' },
                }}
              >
                ระยะเวลา
              </TableSortLabel>
            </TableCell>

            {/* Header จำนวนข้อ */}
            <TableCell sx={{ width: '110px' }}>
              จำนวนข้อ
            </TableCell>

            {/* Header สถานะ */}
            <TableCell sx={{ width: '110px' }}>
              สถานะ
            </TableCell>

            {/* Header การจัดการ */}
            <TableCell width="135px" align="center">
              การจัดการ
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {loading ? (
            // แสดงสถานะกำลังโหลดแบบ CircularProgress กลางตาราง สไตล์เดียวกับ ExerciseTable
            <TableRow>
              <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1.5 }}>
                  <CircularProgress size={36} sx={{ color: '#4f46e5' }} />
                  <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, fontSize: '13.5px' }}>
                    กำลังโหลดข้อมูลชุดบทเรียน...
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          ) : sessions.length === 0 ? (
            // Empty State ตามแบบ ExerciseTable
            <TableRow>
              <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 52,
                      height: 52,
                      borderRadius: '50%',
                      bgcolor: '#f1f5f9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#94a3b8',
                      mb: 1,
                    }}
                  >
                    <Layers size={28} />
                  </Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1e293b' }}>
                    ไม่พบรายการ Session ที่ตรงกับเงื่อนไขค้นหา
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>
                    ลองตรวจสอบคำสะกด หรือปรับเปลี่ยนตัวกรองระดับความยาก/สถานะ
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          ) : (
            // Data Rows
            sessions.map((session) => {
              const diffMeta = DIFFICULTY_LEVELS[session.targetLevel] || {
                label: `Level ${session.targetLevel}`,
                color: '#3b82f6',
                bg: '#eff6ff',
                border: '#bfdbfe',
              };

              return (
                <TableRow
                  key={session.sessionId}
                  hover
                  sx={{
                    '&:hover': { bgcolor: '#f8fafc' },
                    transition: 'background-color 0.15s ease',
                    '&:last-child td, &:last-child th': { border: 0 },
                  }}
                >
                  {/* ID */}
                  <TableCell sx={{ color: '#64748b', fontWeight: 700, fontSize: '13px', py: 2 }}>
                    #{session.sessionId}
                  </TableCell>

                  {/* Name & Objective */}
                  <TableCell sx={{ py: 2 }}>
                    <Box sx={{ fontWeight: 700, color: '#0f172a', fontSize: '14px', mb: 0.35 }}>
                      {session.sessionName}
                    </Box>
                    <Typography
                      variant="caption"
                      sx={{
                        color: '#64748b',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: 1.45,
                        fontSize: '12.5px',
                      }}
                    >
                      {session.sessionObjective}
                    </Typography>
                  </TableCell>

                  {/* Level Badge */}
                  <TableCell sx={{ py: 2 }}>
                    <Chip
                      size="small"
                      label={`Lv.${session.targetLevel} - ${diffMeta.label.split('&')[0].trim()}`}
                      sx={{
                        bgcolor: diffMeta.bg,
                        color: diffMeta.color,
                        border: `1px solid ${diffMeta.border}`,
                        fontWeight: 700,
                        borderRadius: '6px',
                        fontSize: '11px',
                        height: '24px',
                      }}
                    />
                  </TableCell>

                  {/* Duration (ระยะเวลา) - แสดงข้อความธรรมดา ไม่มีไอคอนนาฬิกา สไตล์เดียวกับ ExerciseTable */}
                  <TableCell sx={{ py: 2, whiteSpace: 'nowrap' }}>
                    <Typography sx={{ color: '#334155', fontWeight: 600, fontSize: '13px' }}>
                      {session.duration} นาที
                    </Typography>
                  </TableCell>

                  {/* Exercises Count (จำนวนข้อ) - แสดงข้อความธรรมดา ไม่มีกรอบ Chip คลีนสบายตา */}
                  <TableCell sx={{ py: 2, whiteSpace: 'nowrap' }}>
                    <Typography sx={{ color: '#334155', fontWeight: 600, fontSize: '13px' }}>
                      {session.exerciseCount} ข้อ
                    </Typography>
                  </TableCell>

                  {/* Status (Pill พร้อม Glowing Status Dot ตามแบบ ExerciseTable) */}
                  <TableCell sx={{ py: 2 }}>
                    <Box
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 0.9,
                        px: 1.25,
                        py: 0.4,
                        borderRadius: '20px',
                        bgcolor: session.status === 'active' ? '#ecfdf5' : '#f1f5f9',
                        border: `1px solid ${session.status === 'active' ? '#a7f3d0' : '#e2e8f0'}`,
                      }}
                    >
                      <Box
                        sx={{
                          width: 7,
                          height: 7,
                          borderRadius: '50%',
                          bgcolor: session.status === 'active' ? '#10b981' : '#94a3b8',
                          boxShadow: session.status === 'active' ? '0 0 0 2px rgba(16, 185, 129, 0.2)' : 'none',
                        }}
                      />
                      <Typography
                        sx={{
                          fontSize: '11.5px',
                          fontWeight: 700,
                          color: session.status === 'active' ? '#059669' : '#64748b',
                          textTransform: 'capitalize',
                        }}
                      >
                        {session.status === 'active' ? 'Active' : 'Inactive'}
                      </Typography>
                    </Box>
                  </TableCell>

                  {/* Action Buttons (32x32px สไตล์เดียวกับ ExerciseTable และ UserTable) */}
                  <TableCell align="center" sx={{ py: 2 }}>
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                      {/* Preview Button (Soft blue) */}
                      <IconButton
                        size="small"
                        onClick={() => onPreview(session)}
                        sx={{
                          color: '#2563eb',
                          bgcolor: '#eff6ff',
                          border: '1px solid #bfdbfe',
                          borderRadius: '8px',
                          width: 32,
                          height: 32,
                          '&:hover': {
                            bgcolor: '#dbeafe',
                            borderColor: '#93c5fd',
                          },
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <Eye size={15} />
                      </IconButton>

                      {/* Edit Button (Indigo on white border) */}
                      <IconButton
                        size="small"
                        onClick={() => onEdit(session)}
                        sx={{
                          color: '#4f46e5',
                          bgcolor: '#ffffff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          width: 32,
                          height: 32,
                          '&:hover': {
                            bgcolor: 'rgba(79, 70, 229, 0.08)',
                            borderColor: '#818cf8',
                          },
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <Edit3 size={15} />
                      </IconButton>

                      {/* Delete Button (Solid red) */}
                      <IconButton
                        size="small"
                        onClick={() => onDelete(session.sessionId)}
                        sx={{
                          color: '#ffffff',
                          bgcolor: '#ef4444',
                          borderRadius: '8px',
                          width: 32,
                          height: 32,
                          '&:hover': {
                            bgcolor: '#dc2626',
                          },
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <Trash2 size={15} />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SessionTable;
