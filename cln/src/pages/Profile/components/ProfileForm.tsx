
import { 
  Box, 
  Card, 
  Avatar, 
  Typography,
  Grid, 
  TextField 
} from '@mui/material';

interface ProfileFormProps {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  dateOfBirth: string;
  university: string;
  faculty: string;
  major: string;
  registerTimestamp?: string;
  formatDate: (date?: string) => string;
  roleName?: string;
}

export function ProfileForm({
  username,
  firstName,
  lastName,
  email,
  gender,
  dateOfBirth,
  university,
  faculty,
  major,
  registerTimestamp,
  formatDate,
  roleName
}: ProfileFormProps) {
  // จัดข้อความเพศให้แสดงผลสวยงามเป็นภาษาไทย
  const displayGender = () => {
    if (!gender) return '-';
    const lower = gender.toLowerCase();
    if (lower === 'male') return 'Male';
    if (lower === 'female') return 'Female';
    if (lower === 'other') return 'Other';
    return gender;
  };

  return (
    <Card sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', p: 4, boxShadow: 'none' }}>
      {/* Profile Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
        <Avatar 
          sx={{ 
            width: 72, 
            height: 72, 
            bgcolor: '#fef08a',
            color: '#854d0e',
            fontSize: '2rem',
            fontWeight: 700,
            border: '1px solid #fef08a'
          }}
        >
          {username?.charAt(0).toUpperCase()}
        </Avatar>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#0f172a' }}>
            {firstName} {lastName}
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
            {username} • {roleName || '-'}
          </Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8', mt: 0.5 }}>
            สมัครเมื่อ: {formatDate(registerTimestamp)}
          </Typography>
        </Box>
      </Box>

      {/* Form (Inert read-only view: ห้ามเอาเมาส์ชี้เพื่อเอาเคอร์เซอร์เจาะพิมพ์ และห้ามแก้ไข) */}
      <Box component="div">
        <Grid container spacing={2.5}>
          {/* FIRST NAME */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="FIRST NAME"
              value={firstName}
              variant="outlined"
              slotProps={{ input: { readOnly: true, tabIndex: -1 } }}
              sx={{ 
                pointerEvents: 'none',
                '& .MuiOutlinedInput-root': { 
                  borderRadius: '10px',
                  backgroundColor: '#f8fafc' 
                } 
              }}
            />
          </Grid>

          {/* LAST NAME */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="LAST NAME"
              value={lastName}
              variant="outlined"
              slotProps={{ input: { readOnly: true, tabIndex: -1 } }}
              sx={{ 
                pointerEvents: 'none',
                '& .MuiOutlinedInput-root': { 
                  borderRadius: '10px',
                  backgroundColor: '#f8fafc' 
                } 
              }}
            />
          </Grid>

          {/* EMAIL */}
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="EMAIL"
              value={email}
              variant="outlined"
              slotProps={{ input: { readOnly: true, tabIndex: -1 } }}
              sx={{ 
                pointerEvents: 'none',
                '& .MuiOutlinedInput-root': { 
                  borderRadius: '10px',
                  backgroundColor: '#f8fafc' 
                } 
              }}
            />
          </Grid>

          {/* USERNAME */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="USERNAME"
              value={username}
              variant="outlined"
              slotProps={{ input: { readOnly: true, tabIndex: -1 } }}
              sx={{ 
                pointerEvents: 'none',
                '& .MuiOutlinedInput-root': { 
                  borderRadius: '10px',
                  backgroundColor: '#f8fafc' 
                } 
              }}
            />
          </Grid>

          {/* เพศ */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="GENDER"
              value={displayGender()}
              variant="outlined"
              slotProps={{ input: { readOnly: true, tabIndex: -1 } }}
              sx={{ 
                pointerEvents: 'none',
                '& .MuiOutlinedInput-root': { 
                  borderRadius: '10px',
                  backgroundColor: '#f8fafc' 
                } 
              }}
            />
          </Grid>

          {/* วันเกิด */}
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="DATE OF BIRTH"
              type="date"
              value={dateOfBirth}
              slotProps={{ 
                input: { readOnly: true, tabIndex: -1 },
                inputLabel: { shrink: true } 
              }}
              variant="outlined"
              sx={{ 
                pointerEvents: 'none',
                '& .MuiOutlinedInput-root': { 
                  borderRadius: '10px',
                  backgroundColor: '#f8fafc' 
                } 
              }}
            />
          </Grid>

          {/* มหาวิทยาลัย (ใช้ pointerEvents: 'none' เพื่อห้ามเอาเมาส์ชี้เอาเคอร์เซอร์เจาะ และป้องกันการแก้ไข) */}
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="UNIVERSITY"
              value={university}
              variant="outlined"
              slotProps={{ input: { readOnly: true, tabIndex: -1 } }}
              sx={{ 
                pointerEvents: 'none',
                '& .MuiOutlinedInput-root': { 
                  borderRadius: '10px',
                  backgroundColor: '#f8fafc' 
                } 
              }}
            />
          </Grid>

          {/* คณะ */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="FACULTY"
              value={faculty}
              variant="outlined"
              slotProps={{ input: { readOnly: true, tabIndex: -1 } }}
              sx={{ 
                pointerEvents: 'none',
                '& .MuiOutlinedInput-root': { 
                  borderRadius: '10px',
                  backgroundColor: '#f8fafc' 
                } 
              }}
            />
          </Grid>

          {/* สาขา */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="MAJOR"
              value={major}
              variant="outlined"
              slotProps={{ input: { readOnly: true, tabIndex: -1 } }}
              sx={{ 
                pointerEvents: 'none',
                '& .MuiOutlinedInput-root': { 
                  borderRadius: '10px',
                  backgroundColor: '#f8fafc' 
                } 
              }}
            />
          </Grid>
        </Grid>
      </Box>
    </Card>
  );
}
