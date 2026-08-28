import { useEffect, useState, type FormEvent } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import type { User } from '../../../api/users';

interface UserDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  user: User | null;
}

export function UserDialog({ open, onClose, onSubmit, user }: UserDialogProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('male');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [roleId, setRoleId] = useState<number>(1);
  const [university, setUniversity] = useState('');
  const [faculty, setFaculty] = useState('');
  const [major, setMajor] = useState('');

  useEffect(() => {
    if (user) {
      setUsername(user.username || '');
      setPassword('');
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setEmail(user.email || '');
      setGender(user.gender || 'male');
      if (user.dateOfBirth) {
        setDateOfBirth(user.dateOfBirth.substring(0, 10));
      } else {
        setDateOfBirth('');
      }
      setRoleId(user.roleId || 1);
      setUniversity(user.education?.university || '');
      setFaculty(user.education?.faculty || '');
      setMajor(user.education?.major || '');
    } else {
      setUsername('');
      setPassword('');
      setFirstName('');
      setLastName('');
      setEmail('');
      setGender('male');
      setDateOfBirth('');
      setRoleId(1);
      setUniversity('');
      setFaculty('');
      setMajor('');
    }
  }, [user, open]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const data: any = {
      username,
      firstName,
      lastName,
      email,
      gender,
      dateOfBirth,
      roleId,
      university,
      faculty,
      major,
    };
    if (password) data.password = password;
    onSubmit(data);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: { borderRadius: '20px', p: 1.5, border: '1px solid #e2e8f0' }
        }
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ fontWeight: 800, color: '#0f172a', pb: 1 }}>
          {user ? 'แก้ไขผู้ใช้งาน' : 'เพิ่มผู้ใช้งานใหม่'}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                fullWidth
                required
                disabled={!!user}
                autoComplete="username"
                variant="outlined"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label={user ? "รหัสผ่านใหม่ (ว่างไว้ถ้าไม่เปลี่ยน)" : "รหัสผ่าน (ว่างไว้จะเป็น '1234')"}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                required={!user}
                autoComplete="new-password"
                variant="outlined"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="ชื่อจริง"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                fullWidth
                required
                variant="outlined"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="นามสกุล"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                fullWidth
                required
                variant="outlined"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="อีเมล"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                required
                variant="outlined"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <FormControl fullWidth required>
                <InputLabel>เพศ</InputLabel>
                <Select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  label="เพศ"
                >
                  <MenuItem value="male">ชาย</MenuItem>
                  <MenuItem value="female">หญิง</MenuItem>
                  <MenuItem value="other">อื่นๆ</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <FormControl fullWidth required>
                <InputLabel>สิทธิ์ผู้ใช้งาน</InputLabel>
                <Select
                  value={roleId}
                  onChange={(e) => setRoleId(Number(e.target.value))}
                  label="สิทธิ์ผู้ใช้งาน"
                >
                  <MenuItem value={1}>Student</MenuItem>
                  <MenuItem value={2}>Teacher</MenuItem>
                  <MenuItem value={3}>Admin</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="วันเกิด"
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                fullWidth
                required
                slotProps={{
                  inputLabel: { shrink: true }
                }}
                variant="outlined"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label={roleId === 1 ? "มหาวิทยาลัย" : "มหาวิทยาลัย (ไม่บังคับ)"}
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                fullWidth
                required={roleId === 1}
                variant="outlined"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label={roleId === 1 ? "คณะ" : "คณะ (ไม่บังคับ)"}
                value={faculty}
                onChange={(e) => setFaculty(e.target.value)}
                fullWidth
                required={roleId === 1}
                variant="outlined"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label={roleId === 1 ? "สาขาวิชา" : "สาขาวิชา (ไม่บังคับ)"}
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                fullWidth
                required={roleId === 1}
                variant="outlined"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 700,
              color: '#64748b',
              borderColor: '#cbd5e1',
              '&:hover': {
                borderColor: '#94a3b8',
                bgcolor: '#f8fafc',
              }
            }}
          >
            ยกเลิก
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 700,
              bgcolor: '#4f46e5',
              boxShadow: 'none',
              '&:hover': {
                bgcolor: '#4338ca',
                boxShadow: 'none',
              }
            }}
          >
            บันทึก
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
