import type { User } from "../../../api/users";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Typography,
  Box,
  Chip,
  TablePagination,
} from "@mui/material";
import { Edit2, Trash2, Eye } from "lucide-react";

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: number, username: string) => void;
  onPreview: (user: User) => void;
  formatDate: (dateString?: string) => string;
  total?: number;
  page?: number;
  rowsPerPage?: number;
  onPageChange?: (newPage: number) => void;
  onRowsPerPageChange?: (newRowsPerPage: number) => void;
}

export function UserTable({
  users,
  onEdit,
  onDelete,
  onPreview,
  formatDate,
  total,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}: UserTableProps) {
  // ฟังก์ชันวาด Chip บทบาทดีไซน์หรูหรา (Light Background + Solid Border + Custom Font)
  const getRoleChip = (roleId: number) => {
    switch (roleId) {
      case 3:
        return (
          <Chip
            label="Admin"
            size="small"
            sx={{
              bgcolor: "#ffe4e6",
              color: "#e11d48",
              border: "1px solid #fecdd3",
              fontWeight: 700,
              borderRadius: "6px",
              fontSize: "11px",
              height: "24px",
            }}
          />
        );
      case 2:
        return (
          <Chip
            label="Teacher"
            size="small"
            sx={{
              bgcolor: "#eff6ff",
              color: "#2563eb",
              border: "1px solid #bfdbfe",
              fontWeight: 700,
              borderRadius: "6px",
              fontSize: "11px",
              height: "24px",
            }}
          />
        );
      default:
        return (
          <Chip
            label="Student"
            size="small"
            sx={{
              bgcolor: "#ecfdf5",
              color: "#059669",
              border: "1px solid #a7f3d0",
              fontWeight: 700,
              borderRadius: "6px",
              fontSize: "11px",
              height: "24px",
            }}
          />
        );
    }
  };

  return (
    <TableContainer sx={{ overflowX: "auto" }}>
      <Table sx={{ minWidth: 900 }}>
        <TableHead
          sx={{ bgcolor: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}
        >
          <TableRow>
            <TableCell
              sx={{
                fontWeight: 700,
                color: "#475569",
                fontSize: "13px",
                py: 1.8,
              }}
            >
              ชื่อผู้ใช้
            </TableCell>
            <TableCell
              sx={{
                fontWeight: 700,
                color: "#475569",
                fontSize: "13px",
                py: 1.8,
              }}
            >
              ชื่อ - นามสกุล
            </TableCell>
            <TableCell
              sx={{
                fontWeight: 700,
                color: "#475569",
                fontSize: "13px",
                py: 1.8,
              }}
            >
              อีเมล
            </TableCell>
            <TableCell
              sx={{
                fontWeight: 700,
                color: "#475569",
                fontSize: "13px",
                py: 1.8,
              }}
            >
              บทบาท
            </TableCell>
            <TableCell
              sx={{
                fontWeight: 700,
                color: "#475569",
                fontSize: "13px",
                py: 1.8,
              }}
            >
              สังกัด
            </TableCell>
            <TableCell
              sx={{
                fontWeight: 700,
                color: "#475569",
                fontSize: "13px",
                py: 1.8,
              }}
            >
              สมัครเมื่อ
            </TableCell>
            <TableCell
              align="center"
              width="140px"
              sx={{
                fontWeight: 700,
                color: "#475569",
                fontSize: "13px",
                py: 1.8,
              }}
            >
              จัดการ
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                align="center"
                sx={{ py: 8, color: "#94a3b8" }}
              >
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  ไม่มีข้อมูลรายชื่อสมาชิกที่ตรงกับตัวเลือกค้นหา
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow
                key={user.userId}
                hover
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                {/* รายละเอียดรายแถว */}
                <TableCell
                  sx={{
                    fontWeight: 800,
                    color: "#0f172a",
                    fontSize: "14px",
                    py: 2,
                  }}
                >
                  {user.username}
                </TableCell>
                <TableCell sx={{ color: "#334155", fontWeight: 500, py: 2 }}>
                  {`${user.firstName} ${user.lastName}`}
                </TableCell>
                <TableCell sx={{ color: "#64748b", fontSize: "13px", py: 2 }}>
                  {user.email}
                </TableCell>
                <TableCell sx={{ py: 2 }}>{getRoleChip(user.roleId)}</TableCell>
                <TableCell sx={{ py: 2 }}>
                  {!user.education?.university || user.education.university === "Default University" || user.education.university === "ไม่ระบุ" ? (
                    <Typography
                      variant="body2"
                      sx={{ fontSize: "13px", color: "#94a3b8", fontWeight: 500 }}
                    >
                      ไม่ระบุ
                    </Typography>
                  ) : (
                    <>
                      <Typography
                        variant="body2"
                        sx={{ fontSize: "13px", color: "#0f172a", fontWeight: 600 }}
                      >
                        {user.education.university}
                      </Typography>
                      {user.education?.faculty && user.education.faculty !== "Default Faculty" && user.education.faculty !== "ไม่ระบุ" && user.education.faculty !== "-" && (
                        <Typography
                          variant="caption"
                          sx={{ color: "#64748b", display: "block", mt: 0.25 }}
                        >
                          {user.education.major && user.education.major !== "Default Major" && user.education.major !== "ไม่ระบุ" && user.education.major !== "-"
                            ? `${user.education.faculty} / ${user.education.major}`
                            : user.education.faculty}
                        </Typography>
                      )}
                    </>
                  )}
                </TableCell>
                <TableCell sx={{ color: "#64748b", fontSize: "13px", py: 2 }}>
                  {formatDate(user.registerTimestamp)}
                </TableCell>

                {/* 3. ปุ่ม Action: View / Edit / Delete */}
                <TableCell align="center" sx={{ py: 2 }}>
                  <Box
                    sx={{ display: "flex", gap: 1, justifyContent: "center", alignItems: "center" }}
                  >
                    {/* ปุ่มดูข้อมูลผู้ใช้งาน */}
                    <Tooltip title="ดูข้อมูลผู้ใช้งาน" arrow>
                      <IconButton
                        size="small"
                        onClick={() => onPreview(user)}
                        sx={{
                          color: "#2563eb",
                          bgcolor: "#eff6ff",
                          border: "1px solid #bfdbfe",
                          borderRadius: "8px",
                          width: 32,
                          height: 32,
                          "&:hover": {
                            bgcolor: "#dbeafe",
                            borderColor: "#93c5fd",
                          },
                          transition: "all 0.15s ease",
                        }}
                      >
                        <Eye size={15} />
                      </IconButton>
                    </Tooltip>

                    {/* ปุ่มแก้ไขข้อมูลผู้ใช้งาน */}
                    <Tooltip title="แก้ไขข้อมูลผู้ใช้งาน" arrow>
                      <IconButton
                        size="small"
                        onClick={() => onEdit(user)}
                        sx={{
                          width: 32,
                          height: 32,
                          color: "#4f46e5",
                          bgcolor: "#eef2ff",
                          border: "1px solid #c7d2fe",
                          borderRadius: "8px",
                          "&:hover": {
                            bgcolor: "#e0e7ff",
                            borderColor: "#a5b4fc",
                          },
                          transition: "all 0.15s ease",
                        }}
                      >
                        <Edit2 size={14} />
                      </IconButton>
                    </Tooltip>

                    {/* ปุ่มลบผู้ใช้งาน */}
                    <Tooltip title="ลบผู้ใช้งาน" arrow>
                      <IconButton
                        size="small"
                        onClick={() => onDelete(user.userId, user.username)}
                        sx={{
                          width: 32,
                          height: 32,
                          color: "#e11d48",
                          bgcolor: "#ffe4e6",
                          border: "1px solid #fecdd3",
                          borderRadius: "8px",
                          "&:hover": {
                            bgcolor: "#fecdd3",
                            borderColor: "#fda4af",
                          },
                          transition: "all 0.15s ease",
                        }}
                      >
                        <Trash2 size={14} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* 4. ส่วนแสดง Pagination ของตารางผู้ใช้งาน (Standard MUI TablePagination) */}
      {total !== undefined &&
        page !== undefined &&
        rowsPerPage !== undefined &&
        onPageChange &&
        onRowsPerPageChange && (
          <TablePagination
            rowsPerPageOptions={[10, 20, 50]}
            component="div"
            count={total}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_, newPage) => onPageChange(newPage)}
            onRowsPerPageChange={(e) =>
              onRowsPerPageChange(parseInt(e.target.value, 10))
            }
            labelRowsPerPage="จำนวนรายการต่อหน้า:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} จาก ${count !== -1 ? count : `มากกว่า ${to}`}`
            }
            sx={{
              borderTop: "1px solid #e2e8f0",
              ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows":
                {
                  fontSize: "13px",
                  color: "#64748b",
                  fontWeight: 500,
                },
            }}
          />
        )}
    </TableContainer>
  );
}
