import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  Button,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import { Users, Search, RefreshCw } from 'lucide-react';
import { MainLayout } from '../../components/Layout/MainLayout';
import { type User, getUsers, createUser, updateUser, deleteUser } from '../../api/users';
import { UserDialog } from './components/UserDialog';
import { UserTable } from './components/UserTable';
import { ConfirmDialog } from './components/ConfirmDialog';

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<number | ''>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // State สำหรับ Confirm Dialog
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState('');
  const [confirmMessage, setConfirmMessage] = useState('');
  const [confirmColor, setConfirmColor] = useState<'error' | 'success' | 'primary'>('primary');
  const [confirmAction, setConfirmAction] = useState<(() => Promise<void>) | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, statusFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (search) params.search = search;
      if (roleFilter !== '') params.roleId = roleFilter;
      if (statusFilter !== '') params.status = statusFilter;
      const data = await getUsers(params);
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      fetchUsers();
    }
  };

  const handleAddClick = () => {
    setSelectedUser(null);
    setDialogOpen(true);
  };

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  const handleDeleteClick = (id: number, name: string) => {
    setConfirmTitle('ยืนยันการลบผู้ใช้งาน');
    setConfirmMessage(`คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้งาน "${name}"? ข้อมูลคะแนนและประวัติการเรียนทั้งหมดของบัญชีนี้จะถูกลบออกทั้งหมดและไม่สามารถกู้คืนได้`);
    setConfirmColor('error');
    setConfirmAction(() => async () => {
      try {
        await deleteUser(id);
        fetchUsers();
        setConfirmOpen(false);
      } catch (error) {
        alert('เกิดข้อผิดพลาดในการลบผู้ใช้งาน');
      }
    });
    setConfirmOpen(true);
  };

  const handleDialogSubmit = (formData: any) => {
    const isEdit = !!selectedUser;
    setConfirmTitle(isEdit ? 'ยืนยันการแก้ไขข้อมูล' : 'ยืนยันการเพิ่มผู้ใช้งาน');
    setConfirmMessage(isEdit ? 'คุณแน่ใจหรือไม่ว่าต้องการบันทึกการแก้ไขข้อมูลผู้ใช้งานนี้?' : 'คุณแน่ใจหรือไม่ว่าต้องการเพิ่มผู้ใช้งานใหม่เข้าระบบ?');
    setConfirmColor('primary');
    setConfirmAction(() => async () => {
      try {
        if (isEdit) {
          await updateUser(selectedUser.userId, formData);
        } else {
          await createUser(formData);
        }
        setDialogOpen(false);
        setConfirmOpen(false);
        fetchUsers();
      } catch (error: any) {
        const errMsg = error.response?.data?.message || 'บันทึกข้อมูลไม่สำเร็จ';
        alert(errMsg);
        setConfirmOpen(false);
      }
    });
    setConfirmOpen(true);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';
    return date.toLocaleDateString('th-TH', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getRelativeTime = (dateString?: string) => {
    if (!dateString) return 'ไม่มีข้อมูล';
    const diff = Date.now() - new Date(dateString).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'เมื่อสักครู่';
    if (minutes < 60) return `เมื่อ ${minutes} นาทีที่แล้ว`;
    if (hours < 24) return `เมื่อ ${hours} ชั่วโมงที่แล้ว`;
    return `เมื่อ ${days} วันที่แล้ว`;
  };

  const handleConfirmExecute = async () => {
    if (confirmAction) {
      await confirmAction();
    }
  };

  return (
    <MainLayout activeItem="UserManagement">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%', maxWidth: '1440px', margin: '0 auto' }}>
        
        {/* ครอบหัวข้อ ตัวกรอง และตารางให้อยู่ในการ์ดใบเดียวกันเพื่อความสวยงามตามแบบหน้า Exercises */}
        <Card sx={{ p: 3, borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: 'none', overflow: 'hidden' }}>
          
          {/* Header Action Section */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Users size={24} color="#4f46e5" />
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>
                จัดการผู้ใช้งานทั้งหมด ({users.length} คน)
              </Typography>
            </Box>
            <Button
              variant="contained"
              onClick={handleAddClick}
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 700,
                bgcolor: '#4f46e5',
                color: '#ffffff',
                px: 2.5,
                py: 1,
                boxShadow: 'none',
                '&:hover': {
                  bgcolor: '#4338ca',
                  boxShadow: 'none',
                },
                transition: 'all 0.15s ease',
              }}
            >
              + เพิ่มผู้ใช้งาน
            </Button>
          </Box>

          {/* Filters Section (จัดเรียงในแถวเดียวกัน) */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center', mb: 3 }}>
            <TextField
              placeholder="ค้นหาชื่อจริง, นามสกุล, Username, อีเมล..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearchKeyPress}
              sx={{ flexGrow: 1, minWidth: { xs: '100%', sm: 250 } }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start" sx={{ color: '#94a3b8', mr: 1 }}>
                      <Search size={20} />
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: '12px',
                    bgcolor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    height: '46px',
                    '& fieldset': { border: 'none' },
                  },
                }
              }}
            />
            
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel sx={{ fontSize: '13px', fontWeight: 700, color: '#475569' }}>สิทธิ์ผู้ใช้งาน</InputLabel>
              <Select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as number | '')}
                label="สิทธิ์ผู้ใช้งาน"
                sx={{
                  borderRadius: '12px',
                  bgcolor: '#f8fafc',
                  height: '46px',
                  '& .MuiOutlinedInput-notchedOutline': { border: '1px solid #e2e8f0' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#cbd5e1' },
                }}
              >
                <MenuItem value="">ทั้งหมด</MenuItem>
                <MenuItem value={1}>Student</MenuItem>
                <MenuItem value={2}>Teacher</MenuItem>
                <MenuItem value={3}>Admin</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel sx={{ fontSize: '13px', fontWeight: 700, color: '#475569' }}>สถานะ</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as string)}
                label="สถานะ"
                sx={{
                  borderRadius: '12px',
                  bgcolor: '#f8fafc',
                  height: '46px',
                  '& .MuiOutlinedInput-notchedOutline': { border: '1px solid #e2e8f0' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#cbd5e1' },
                }}
              >
                <MenuItem value="">ทั้งหมด</MenuItem>
                <MenuItem value="online">Online</MenuItem>
                <MenuItem value="offline">Offline</MenuItem>
              </Select>
            </FormControl>

            <IconButton
              onClick={fetchUsers}
              sx={{
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                width: '46px',
                height: '46px',
                bgcolor: '#f8fafc',
                '&:hover': { bgcolor: '#f1f5f9' },
                transition: 'all 0.2s',
              }}
            >
              <RefreshCw size={18} />
            </IconButton>
          </Box>

          {/* User Table Component */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress size={36} />
            </Box>
          ) : (
            <UserTable
              users={users}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
              formatDate={formatDate}
              getRelativeTime={getRelativeTime}
            />
          )}
        </Card>
      </Box>

      {/* Dialog กรอกข้อมูล */}
      <UserDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleDialogSubmit}
        user={selectedUser}
      />

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmExecute}
        title={confirmTitle}
        message={confirmMessage}
        confirmColor={confirmColor}
      />
    </MainLayout>
  );
}

export default UsersPage;
