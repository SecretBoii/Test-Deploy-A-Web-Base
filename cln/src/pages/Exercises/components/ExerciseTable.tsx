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
} from '@mui/material'
import { Edit3, Trash2, HelpCircle } from 'lucide-react'
import { DIFFICULTY_LEVELS } from '../../../constants/difficulty'

interface Exercise {
  exerciseId: number
  title: string
  description: string
  topic: string
  objective: string
  difficultyLevel: number
  expectedTime: number
  status: string
  hint: string
}

interface ExerciseTableProps {
  exercises: Exercise[]
  sortField: 'id' | 'bloom'
  sortOrder: 'asc' | 'desc'
  onSort: (field: 'id' | 'bloom') => void
  onEdit: (exercise: Exercise) => void
  onDelete: (id: number) => void
}

export const ExerciseTable: React.FC<ExerciseTableProps> = ({
  exercises,
  sortField,
  sortOrder,
  onSort,
  onEdit,
  onDelete,
}) => {

  // แปลงเลเวลเป็นป้าย Bloom Taxonomy ภาษาไทยตามรูป
  const getBloomThaiSubtext = (level: number) => {
    switch (level) {
      case 1:
        return 'การจดจำ และ การเข้าใจ'
      case 2:
        return 'การนำไปใช้'
      case 3:
        return 'การวิเคราะห์'
      case 4:
        return 'การประเมินค่า'
      case 5:
        return 'การสร้างสรรค์'
      default:
        return 'ความรู้พื้นฐาน'
    }
  }

  const getBloomShortLabel = (level: number) => {
    switch (level) {
      case 1:
        return 'Lv.1 Remembering & Understanding'
      case 2:
        return 'Lv.2 Apply'
      case 3:
        return 'Lv.3 Analyze'
      case 4:
        return 'Lv.4 Evaluate'
      case 5:
        return 'Lv.5 Create'
      default:
        return `Lv.${level}`
    }
  }

  return (
    <TableContainer sx={{ overflowX: 'auto' }}>
      <Table sx={{ minWidth: 900 }}>
        <TableHead sx={{ bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
          <TableRow>
            {/* Clickable ID Header */}
            <TableCell width="100px" sx={{ fontWeight: 700, color: '#475569', fontSize: '13px', py: 1.5 }}>
              <TableSortLabel
                active={sortField === 'id'}
                direction={sortField === 'id' ? sortOrder : 'asc'}
                onClick={() => onSort('id')}
                sx={{
                  '&.Mui-active': { color: '#0f172a', fontWeight: 800 },
                  '& .MuiTableSortLabel-icon': { color: '#475569 !important' }
                }}
              >
                ID
              </TableSortLabel>
            </TableCell>
            
            <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '13px', py: 1.5 }}>TITLE</TableCell>
            <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '13px', py: 1.5 }}>TOPIC</TableCell>
            <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '13px', py: 1.5 }}>OBJECTIVE</TableCell>
            
            {/* Clickable BLOOM LEVEL Header */}
            <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '13px', py: 1.5 }}>
              <TableSortLabel
                active={sortField === 'bloom'}
                direction={sortField === 'bloom' ? sortOrder : 'asc'}
                onClick={() => onSort('bloom')}
                sx={{
                  '&.Mui-active': { color: '#0f172a', fontWeight: 800 },
                  '& .MuiTableSortLabel-icon': { color: '#475569 !important' }
                }}
              >
                BLOOM LEVEL
              </TableSortLabel>
            </TableCell>
            
            <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '13px', py: 1.5 }}>TIME</TableCell>
            <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '13px', py: 1.5 }}>STATUS</TableCell>
            <TableCell width="120px" align="center" sx={{ fontWeight: 700, color: '#475569', fontSize: '13px', py: 1.5 }}>ACTIONS</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {exercises.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} align="center" sx={{ py: 8, color: '#94a3b8' }}>
                <HelpCircle size={40} style={{ marginBottom: '8px', opacity: 0.6 }} />
                <Typography variant="body1" sx={{ fontWeight: 500 }}>ไม่พบโจทย์ตรงกับที่คุณค้นหา</Typography>
              </TableCell>
            </TableRow>
          ) : (
            exercises.map((row) => {
              const diffMeta = DIFFICULTY_LEVELS[row.difficultyLevel] || {
                label: `Lv.${row.difficultyLevel}`,
                color: '#3b82f6',
                bg: '#eff6ff',
                border: '#bfdbfe',
              }

              return (
                <TableRow key={row.exerciseId} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  {/* ID */}
                  <TableCell sx={{ fontWeight: 600, color: '#64748b', py: 2 }}>{row.exerciseId}</TableCell>
                  
                  {/* TITLE & DESCRIPTION */}
                  <TableCell sx={{ py: 2, minWidth: '250px' }}>
                    <Box sx={{ fontWeight: 800, color: '#0f172a', fontSize: '14px', mb: 0.25 }}>
                      {row.title}
                    </Box>
                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block', lineHeight: 1.4 }}>
                      {row.description}
                    </Typography>
                  </TableCell>

                  {/* TOPIC */}
                  <TableCell sx={{ py: 2 }}>
                    <Typography variant="body2" sx={{ color: '#334155', fontWeight: 600 }}>
                      {row.topic}
                    </Typography>
                  </TableCell>

                  {/* OBJECTIVE */}
                  <TableCell sx={{ py: 2 }}>
                    <Typography variant="body2" sx={{ color: '#475569' }}>
                      {row.objective}
                    </Typography>
                  </TableCell>

                  {/* BLOOM LEVEL + SUBTEXT */}
                  <TableCell sx={{ py: 2 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, alignItems: 'flex-start' }}>
                      <Chip
                        label={getBloomShortLabel(row.difficultyLevel)}
                        size="small"
                        sx={{
                          bgcolor: diffMeta.bg,
                          color: diffMeta.color,
                          fontWeight: 700,
                          borderRadius: '6px',
                          border: `1px solid ${diffMeta.border}`,
                          fontSize: '11px',
                        }}
                      />
                      <Typography variant="caption" sx={{ color: '#64748b', fontSize: '10px', display: 'block', pl: 0.5 }}>
                        {getBloomThaiSubtext(row.difficultyLevel)}
                      </Typography>
                    </Box>
                  </TableCell>

                  {/* TIME */}
                  <TableCell sx={{ py: 2, whiteSpace: 'nowrap' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155' }}>
                      {row.expectedTime} นาที
                    </Typography>
                  </TableCell>

                  {/* STATUS */}
                  <TableCell sx={{ py: 2 }}>
                    <Chip
                      label={row.status}
                      size="small"
                      sx={{
                        bgcolor: row.status === 'active' ? '#ecfdf5' : '#f1f5f9',
                        color: row.status === 'active' ? '#10b981' : '#64748b',
                        fontWeight: 700,
                        borderRadius: '6px',
                        fontSize: '11px',
                        textTransform: 'lowercase',
                      }}
                    />
                  </TableCell>

                  {/* ACTIONS */}
                  <TableCell align="center" sx={{ py: 2 }}>
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                      
                      {/* Edit Button */}
                      <IconButton
                        onClick={() => onEdit(row)}
                        sx={{
                          width: 32,
                          height: 32,
                          color: '#f97316',
                          bgcolor: '#ffffff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '50%',
                          '&:hover': {
                            bgcolor: '#fff7ed',
                            borderColor: '#fdba74',
                          },
                          transition: 'all 0.15s',
                        }}
                      >
                        <Edit3 size={14} />
                      </IconButton>

                      {/* Delete Button */}
                      <IconButton
                        onClick={() => onDelete(row.exerciseId)}
                        sx={{
                          width: 32,
                          height: 32,
                          color: '#ffffff',
                          bgcolor: '#ef4444',
                          borderRadius: '50%',
                          '&:hover': {
                            bgcolor: '#dc2626',
                          },
                          transition: 'all 0.15s',
                        }}
                      >
                        <Trash2 size={14} />
                      </IconButton>

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
