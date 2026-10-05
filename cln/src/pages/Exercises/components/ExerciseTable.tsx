import React from 'react'
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
  Tooltip,
  CircularProgress,
} from '@mui/material'
import { Edit3, Trash2, HelpCircle, Eye } from 'lucide-react'
import { DIFFICULTY_LEVELS } from '../../../constants/difficulty'
import type { Exercise, SortField, SortOrder } from '../types'

interface ExerciseTableProps {
  exercises: Exercise[]
  sortField: SortField
  sortOrder: SortOrder
  onSort: (field: SortField) => void
  onEdit: (exercise: Exercise) => void
  onDelete: (id: number) => void
  onPreview?: (exercise: Exercise) => void
  loading?: boolean
}

export const ExerciseTable: React.FC<ExerciseTableProps> = ({
  exercises,
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
        {/* หัวตาราง (Table Head): ปรับชื่อฟิลด์เป็นภาษาไทยและปรับขนาด Typography (13px, weight 700) สอดคล้องกับหน้าสถิติรูปที่ 2 */}
        <TableHead sx={{ bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
          <TableRow
            sx={{
              '& th': {
                fontWeight: 700,
                color: '#475569',
                fontSize: '13px',
                py: 1.8,
                whiteSpace: 'nowrap',
              },
            }}
          >
            {/* คอลัมน์ 1: รหัสโจทย์ (คงการคลิกเรียงลำดับ Asc/Desc) */}
            <TableCell width="105px">
              <TableSortLabel
                active={sortField === 'id'}
                direction={sortField === 'id' ? sortOrder : 'asc'}
                onClick={() => onSort('id')}
                sx={{
                  '&.Mui-active': { color: '#0f172a', fontWeight: 800 },
                  '& .MuiTableSortLabel-icon': { color: '#475569 !important' },
                }}
              >
                รหัสโจทย์
              </TableSortLabel>
            </TableCell>

            {/* คอลัมน์ 2: ชื่อโจทย์ */}
            <TableCell sx={{ minWidth: '200px' }}>
              ชื่อโจทย์
            </TableCell>

            {/* คอลัมน์ 3: หัวข้อบทเรียน */}
            <TableCell sx={{ width: '130px' }}>
              หัวข้อบทเรียน
            </TableCell>

            {/* คอลัมน์ 4: วัตถุประสงค์การเรียนรู้ */}
            <TableCell sx={{ minWidth: '180px' }}>
              วัตถุประสงค์
            </TableCell>

            {/* คอลัมน์ 5: ระดับการเรียนรู้ (คงการคลิกเรียงลำดับ Asc/Desc) */}
            <TableCell sx={{ minWidth: '175px' }}>
              <TableSortLabel
                active={sortField === 'bloom'}
                direction={sortField === 'bloom' ? sortOrder : 'asc'}
                onClick={() => onSort('bloom')}
                sx={{
                  '&.Mui-active': { color: '#0f172a', fontWeight: 800 },
                  '& .MuiTableSortLabel-icon': { color: '#475569 !important' },
                }}
              >
                ระดับการเรียนรู้ (Bloom)
              </TableSortLabel>
            </TableCell>

            {/* คอลัมน์ 6: เวลาที่กำหนด */}
            <TableCell sx={{ width: '110px' }}>
              เวลาที่กำหนด
            </TableCell>

            {/* คอลัมน์ 7: สถานะ */}
            <TableCell sx={{ width: '110px' }}>
              สถานะ
            </TableCell>

            {/* คอลัมน์ 8: การจัดการ */}
            <TableCell width="135px" align="center">
              การจัดการ
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            // แสดงสถานะกำลังโหลดแบบ CircularProgress กลางตาราง สไตล์เดียวกับ ExerciseResults
            <TableRow>
              <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1.5 }}>
                  <CircularProgress size={36} sx={{ color: '#4f46e5' }} />
                  <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, fontSize: '13.5px' }}>
                    กำลังโหลดข้อมูลแบบฝึกหัด...
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          ) : exercises.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
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
                    <HelpCircle size={28} />
                  </Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1e293b' }}>
                    ไม่พบรายการโจทย์ที่ตรงกับเงื่อนไขค้นหา
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>
                    ลองตรวจสอบคำสะกด หรือปรับเปลี่ยนตัวกรองระดับความยาก/สถานะ
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          ) : (
            exercises.map((row) => {
              const diffMeta = DIFFICULTY_LEVELS[row.difficultyLevel] || {
                label: `Lv.${row.difficultyLevel}`,
                description: 'ความรู้พื้นฐาน',
                color: '#3b82f6',
                bg: '#eff6ff',
                border: '#bfdbfe',
              }

              return (
                <TableRow
                  key={row.exerciseId}
                  hover
                  sx={{
                    '&:hover': { bgcolor: '#f8fafc' },
                    transition: 'background-color 0.15s ease',
                    '&:last-child td, &:last-child th': { border: 0 },
                  }}
                >
                  {/* ID */}
                  <TableCell sx={{ fontWeight: 700, color: '#64748b', fontSize: '13px', py: 2 }}>
                    #{row.exerciseId}
                  </TableCell>

                  {/* TITLE */}
                  <TableCell sx={{ py: 2 }}>
                    <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '13.5px' }}>
                      {row.title}
                    </Typography>
                  </TableCell>

                  {/* TOPIC */}
                  <TableCell sx={{ py: 2, whiteSpace: 'nowrap' }}>
                    <Typography sx={{ color: '#334155', fontWeight: 600, fontSize: '13px' }}>
                      {row.topic}
                    </Typography>
                  </TableCell>

                  {/* OBJECTIVE */}
                  <TableCell sx={{ py: 2 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#475569',
                        fontSize: '13px',
                        lineHeight: 1.45,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {row.objective || '-'}
                    </Typography>
                  </TableCell>

                  {/* BLOOM LEVEL */}
                  <TableCell sx={{ py: 2 }}>
                    <Chip
                      label={`Lv.${row.difficultyLevel} - ${diffMeta.label.split('&')[0].trim()}`}
                      size="small"
                      sx={{
                        bgcolor: diffMeta.bg,
                        color: diffMeta.color,
                        fontWeight: 700,
                        borderRadius: '6px',
                        border: `1px solid ${diffMeta.border}`,
                        fontSize: '11.5px',
                        height: '24px',
                      }}
                    />
                  </TableCell>

                  {/* TIME */}
                  <TableCell sx={{ py: 2, whiteSpace: 'nowrap' }}>
                    <Typography sx={{ color: '#334155', fontWeight: 600, fontSize: '13px' }}>
                      {row.expectedTime} นาที
                    </Typography>
                  </TableCell>

                  {/* STATUS */}
                  <TableCell sx={{ py: 2 }}>
                    <Box
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 0.9,
                        px: 1.25,
                        py: 0.4,
                        borderRadius: '20px',
                        bgcolor: row.status === 'active' ? '#ecfdf5' : '#f1f5f9',
                        border: `1px solid ${row.status === 'active' ? '#a7f3d0' : '#e2e8f0'}`,
                      }}
                    >
                      <Box
                        sx={{
                          width: 7,
                          height: 7,
                          borderRadius: '50%',
                          bgcolor: row.status === 'active' ? '#10b981' : '#94a3b8',
                          boxShadow: row.status === 'active' ? '0 0 0 2px rgba(16, 185, 129, 0.2)' : 'none',
                        }}
                      />
                      <Typography
                        sx={{
                          fontSize: '11.5px',
                          fontWeight: 700,
                          color: row.status === 'active' ? '#059669' : '#64748b',
                          textTransform: 'capitalize',
                        }}
                      >
                        {row.status === 'active' ? 'Active' : 'Inactive'}
                      </Typography>
                    </Box>
                  </TableCell>

                  {/* ACTIONS */}
                  <TableCell align="center" sx={{ py: 2 }}>
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                      {/* Preview Button (Admin Audit Log style: Soft blue) */}
                      {onPreview && (
                        <Tooltip title="ดูพรีวิวโจทย์" arrow>
                          <IconButton
                            size="small"
                            onClick={() => onPreview(row)}
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
                        </Tooltip>
                      )}

                      {/* Edit Button (Admin UserTable style: Indigo icon on white border) */}
                      <Tooltip title="แก้ไขข้อมูลโจทย์" arrow>
                        <IconButton
                          size="small"
                          onClick={() => onEdit(row)}
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
                      </Tooltip>

                      {/* Delete Button (Admin UserTable style: Solid red with white icon) */}
                      <Tooltip title="ลบโจทย์ออกจากระบบ" arrow>
                        <IconButton
                          size="small"
                          onClick={() => onDelete(row.exerciseId)}
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
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default ExerciseTable;
