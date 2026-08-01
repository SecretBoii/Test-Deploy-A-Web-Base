import { TextField, Button, Box, MenuItem, InputAdornment } from '@mui/material'
import { User, Lock, Calendar, School, BookOpen, GraduationCap, Smile } from 'lucide-react'

interface RegisterFormFieldsProps {
  step: number
  username: string
  password: string
  gender: string
  dateOfBirth: string
  university: string
  faculty: string
  major: string
  error: string
  success: string
  onChangeUsername: (val: string) => void
  onChangePassword: (val: string) => void
  onChangeGender: (val: string) => void
  onChangeDateOfBirth: (val: string) => void
  onChangeUniversity: (val: string) => void
  onChangeFaculty: (val: string) => void
  onChangeMajor: (val: string) => void
  onNext: () => void
  onBack: () => void
  onSubmit: (e: React.FormEvent) => void
}

export function RegisterFormFields({
  step,
  username,
  password,
  gender,
  dateOfBirth,
  university,
  faculty,
  major,
  error,
  success,
  onChangeUsername,
  onChangePassword,
  onChangeGender,
  onChangeDateOfBirth,
  onChangeUniversity,
  onChangeFaculty,
  onChangeMajor,
  onNext,
  onBack,
  onSubmit,
}: RegisterFormFieldsProps) {
  return (
    <Box
      component="form"
      onSubmit={(e) => {
        e.preventDefault()
        // ให้ส่งฟอร์มก็ต่อเมื่ออยู่ขั้นตอนสุดท้าย (ขั้นตอนที่ 3) เท่านั้น
        if (step === 3) {
          onSubmit(e)
        }
      }}
      sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}
      noValidate
      autoComplete="off"
    >
      {/* ================= ขั้นตอนที่ 1 (Account Info) ================= */}
      {step === 1 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {/* Username */}
          <TextField
            fullWidth
            placeholder="username"
            value={username}
            onChange={(e) => onChangeUsername(e.target.value)}
            autoComplete="off"
            slotProps={{
              htmlInput: { 'aria-label': 'Username' },
              input: {
                startAdornment: (
                  <InputAdornment position="start" style={{ color: '#94a3b8', marginRight: 12 }}>
                    <User size={20} />
                  </InputAdornment>
                ),
                style: {
                  borderRadius: 12,
                  height: 52,
                  fontSize: 15,
                },
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '@media (prefers-color-scheme: dark)': {
                  '& fieldset': { borderColor: '#1e293b' },
                  '&:hover fieldset': { borderColor: '#334155' },
                  color: '#f3f4f6',
                },
              },
            }}
          />

          {/* Password */}
          <TextField
            fullWidth
            type="password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => onChangePassword(e.target.value)}
            autoComplete="new-password"
            slotProps={{
              htmlInput: { 'aria-label': 'Password' },
              input: {
                startAdornment: (
                  <InputAdornment position="start" style={{ color: '#94a3b8', marginRight: 12 }}>
                    <Lock size={20} />
                  </InputAdornment>
                ),
                style: {
                  borderRadius: 12,
                  height: 52,
                  fontSize: 15,
                },
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '@media (prefers-color-scheme: dark)': {
                  '& fieldset': { borderColor: '#1e293b' },
                  '&:hover fieldset': { borderColor: '#334155' },
                  color: '#f3f4f6',
                },
              },
            }}
          />
        </Box>
      )}

      {/* ================= ขั้นตอนที่ 2 (Personal Info) ================= */}
      {step === 2 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {/* Gender */}
          <TextField
            fullWidth
            select
            value={gender}
            onChange={(e) => onChangeGender(e.target.value)}
            slotProps={{
              htmlInput: { 'aria-label': 'Gender' },
              select: {
                displayEmpty: true,
                renderValue: (selected: any) => {
                  if (!selected) {
                    return <span style={{ color: '#94a3b8' }}>Gender</span>
                  }
                  return selected === 'male' ? 'Male' : selected === 'female' ? 'Female' : 'Other'
                }
              },
              input: {
                startAdornment: (
                  <InputAdornment position="start" style={{ color: '#94a3b8', marginRight: 12 }}>
                    <Smile size={20} />
                  </InputAdornment>
                ),
                style: {
                  borderRadius: 12,
                  height: 52,
                  fontSize: 15,
                },
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '@media (prefers-color-scheme: dark)': {
                  '& fieldset': { borderColor: '#1e293b' },
                  '&:hover fieldset': { borderColor: '#334155' },
                  color: '#f3f4f6',
                },
              },
            }}
          >
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </TextField>

          {/* Date of Birth */}
          <TextField
            fullWidth
            type="date"
            value={dateOfBirth}
            onChange={(e) => onChangeDateOfBirth(e.target.value)}
            slotProps={{
              htmlInput: { 'aria-label': 'Date of Birth' },
              input: {
                startAdornment: (
                  <InputAdornment position="start" style={{ color: '#94a3b8', marginRight: 12 }}>
                    <Calendar size={20} />
                  </InputAdornment>
                ),
                style: {
                  borderRadius: 12,
                  height: 52,
                  fontSize: 15,
                },
              },
              inputLabel: { shrink: true }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '@media (prefers-color-scheme: dark)': {
                  '& fieldset': { borderColor: '#1e293b' },
                  '&:hover fieldset': { borderColor: '#334155' },
                  color: '#f3f4f6',
                },
              },
            }}
          />
        </Box>
      )}

      {/* ================= ขั้นตอนที่ 3 (Education Info) ================= */}
      {step === 3 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {/* University */}
          <TextField
            fullWidth
            select
            value={university}
            onChange={(e) => onChangeUniversity(e.target.value)}
            slotProps={{
              htmlInput: { 'aria-label': 'University' },
              select: {
                displayEmpty: true,
                renderValue: (selected: any) => {
                  if (!selected) {
                    return <span style={{ color: '#94a3b8' }}>University</span>
                  }
                  return selected
                }
              },
              input: {
                startAdornment: (
                  <InputAdornment position="start" style={{ color: '#94a3b8', marginRight: 12 }}>
                    <School size={20} />
                  </InputAdornment>
                ),
                style: {
                  borderRadius: 12,
                  height: 52,
                  fontSize: 15,
                },
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '@media (prefers-color-scheme: dark)': {
                  '& fieldset': { borderColor: '#1e293b' },
                  '&:hover fieldset': { borderColor: '#334155' },
                  color: '#f3f4f6',
                },
              },
            }}
          >
            <MenuItem value="มหาวิทยาลัยสงขลานครินทร์">มหาวิทยาลัยสงขลานครินทร์</MenuItem>
          </TextField>

          {/* Faculty */}
          <TextField
            fullWidth
            select
            value={faculty}
            onChange={(e) => onChangeFaculty(e.target.value)}
            slotProps={{
              htmlInput: { 'aria-label': 'Faculty' },
              select: {
                displayEmpty: true,
                renderValue: (selected: any) => {
                  if (!selected) {
                    return <span style={{ color: '#94a3b8' }}>Faculty</span>
                  }
                  return selected
                }
              },
              input: {
                startAdornment: (
                  <InputAdornment position="start" style={{ color: '#94a3b8', marginRight: 12 }}>
                    <BookOpen size={20} />
                  </InputAdornment>
                ),
                style: {
                  borderRadius: 12,
                  height: 52,
                  fontSize: 15,
                },
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '@media (prefers-color-scheme: dark)': {
                  '& fieldset': { borderColor: '#1e293b' },
                  '&:hover fieldset': { borderColor: '#334155' },
                  color: '#f3f4f6',
                },
              },
            }}
          >
            <MenuItem value="วิทยาศาสตร์">วิทยาศาสตร์</MenuItem>
          </TextField>

          {/* Major */}
          <TextField
            fullWidth
            select
            value={major}
            onChange={(e) => onChangeMajor(e.target.value)}
            slotProps={{
              htmlInput: { 'aria-label': 'Major' },
              select: {
                displayEmpty: true,
                renderValue: (selected: any) => {
                  if (!selected) {
                    return <span style={{ color: '#94a3b8' }}>Major</span>
                  }
                  return selected
                }
              },
              input: {
                startAdornment: (
                  <InputAdornment position="start" style={{ color: '#94a3b8', marginRight: 12 }}>
                    <GraduationCap size={20} />
                  </InputAdornment>
                ),
                style: {
                  borderRadius: 12,
                  height: 52,
                  fontSize: 15,
                },
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '@media (prefers-color-scheme: dark)': {
                  '& fieldset': { borderColor: '#1e293b' },
                  '&:hover fieldset': { borderColor: '#334155' },
                  color: '#f3f4f6',
                },
              },
            }}
          >
            <MenuItem value="เทคโนโลยีสารสนเทศและการสื่อสาร">เทคโนโลยีสารสนเทศและการสื่อสาร</MenuItem>
          </TextField>
        </Box>
      )}

      {/* บล็อกแจ้งเตือนข้อความ Error สีแดง */}
      {error && (
        <Box
          sx={{
            color: '#ef4444',
            fontSize: '13.5px',
            fontWeight: 600,
            textAlign: 'center',
            bgcolor: 'rgba(239, 68, 68, 0.06)',
            py: 1,
            px: 2,
            borderRadius: '10px',
            border: '1px solid rgba(239, 68, 68, 0.15)',
          }}
        >
          {error}
        </Box>
      )}

      {/* บล็อกแจ้งเตือนเมื่อสมัครสำเร็จ สีเขียว */}
      {success && (
        <Box
          sx={{
            color: '#10b981',
            fontSize: '13.5px',
            fontWeight: 600,
            textAlign: 'center',
            bgcolor: 'rgba(16, 185, 129, 0.06)',
            py: 1,
            px: 2,
            borderRadius: '10px',
            border: '1px solid rgba(16, 185, 129, 0.15)',
          }}
        >
          {success}
        </Box>
      )}

      {/* ================= คอนโทรลปุ่มกดด้านล่างแบบฟอร์ม ================= */}
      <Box sx={{ mt: 1 }}>
        {step === 1 ? (
          // ปุ่ม "Next" สำหรับข้ามไปขั้นตอนที่ 2
          <Button
            fullWidth
            type="button"
            variant="contained"
            onClick={onNext}
            sx={{
              height: '50px',
              fontSize: '15px',
              fontWeight: 700,
              borderRadius: '12px',
              textTransform: 'none',
              backgroundColor: '#4f46e5',
              boxShadow: '0px 4px 15px rgba(79, 70, 229, 0.15)',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: '#4338ca',
                boxShadow: '0px 6px 20px rgba(79, 70, 229, 0.25)',
              },
            }}
          >
            Next Step
          </Button>
        ) : step === 2 ? (
          // ปุ่ม "Back" และ "Next" สำหรับขั้นตอนที่ 2
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              fullWidth
              type="button"
              variant="outlined"
              onClick={onBack}
              sx={{
                flex: 0.8,
                height: '50px',
                fontSize: '15px',
                fontWeight: 700,
                borderRadius: '12px',
                textTransform: 'none',
                borderColor: '#cbd5e1',
                color: '#64748b',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: '#94a3b8',
                  backgroundColor: '#f8fafc',
                  '@media (prefers-color-scheme: dark)': {
                    backgroundColor: '#1e293b',
                    borderColor: '#475569'
                  }
                },
                '@media (prefers-color-scheme: dark)': {
                  borderColor: '#334155',
                  color: '#94a3b8',
                }
              }}
            >
              Back
            </Button>
            <Button
              fullWidth
              type="button"
              variant="contained"
              onClick={onNext}
              sx={{
                flex: 1.2,
                height: '50px',
                fontSize: '15px',
                fontWeight: 700,
                borderRadius: '12px',
                textTransform: 'none',
                backgroundColor: '#4f46e5',
                boxShadow: '0px 4px 15px rgba(79, 70, 229, 0.15)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: '#4338ca',
                  boxShadow: '0px 6px 20px rgba(79, 70, 229, 0.25)',
                },
              }}
            >
              Next Step
            </Button>
          </Box>
        ) : (
          // ปุ่ม "Back" และ "Sign Up" สำหรับขั้นตอนที่ 3 (ส่งแบบฟอร์ม)
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              fullWidth
              type="button"
              variant="outlined"
              onClick={onBack}
              sx={{
                flex: 0.8,
                height: '50px',
                fontSize: '15px',
                fontWeight: 700,
                borderRadius: '12px',
                textTransform: 'none',
                borderColor: '#cbd5e1',
                color: '#64748b',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: '#94a3b8',
                  backgroundColor: '#f8fafc',
                  '@media (prefers-color-scheme: dark)': {
                    backgroundColor: '#1e293b',
                    borderColor: '#475569'
                  }
                },
                '@media (prefers-color-scheme: dark)': {
                  borderColor: '#334155',
                  color: '#94a3b8',
                }
              }}
            >
              Back
            </Button>
            <Button
              fullWidth
              type="submit"
              variant="contained"
              sx={{
                flex: 1.2,
                height: '50px',
                fontSize: '15px',
                fontWeight: 700,
                borderRadius: '12px',
                textTransform: 'none',
                backgroundColor: '#4f46e5',
                boxShadow: '0px 4px 15px rgba(79, 70, 229, 0.15)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: '#4338ca',
                  boxShadow: '0px 6px 20px rgba(79, 70, 229, 0.25)',
                },
              }}
            >
              Sign Up
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  )
}
