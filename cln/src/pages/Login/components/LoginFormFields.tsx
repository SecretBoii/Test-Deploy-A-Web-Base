import { TextField, Button, InputAdornment, Box, CircularProgress } from '@mui/material'
import { User, Lock } from 'lucide-react'

interface LoginFormFieldsProps {
  username: string
  password: string
  error: string
  success?: string
  loading?: boolean
  onChangeUsername: (val: string) => void
  onChangePassword: (val: string) => void
  onSubmit: (e: React.FormEvent) => void
}

export function LoginFormFields({
  username,
  password,
  error,
  success,
  loading = false,
  onChangeUsername,
  onChangePassword,
  onSubmit,
}: LoginFormFieldsProps) {
  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
      noValidate
      autoComplete="off"
    >
      {/* Username Field */}
      <TextField
        fullWidth
        disabled={loading}
        variant="outlined"
        placeholder="username"
        type="text"
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

      {/* Password Field */}
      <TextField
        fullWidth
        disabled={loading}
        variant="outlined"
        placeholder="At least 8 characters"
        type="password"
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

      {/* แจ้งเตือนข้อความ Error สีแดง */}
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
            mt: -1,
            mb: 1,
          }}
        >
          {error}
        </Box>
      )}

      {/* แจ้งเตือนสถานะสำเร็จ สีเขียว */}
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
            mt: -1,
            mb: 1,
          }}
        >
          {success}
        </Box>
      )}

      {/* Login CTA */}
      <Button
        fullWidth
        type="submit"
        variant="contained"
        disabled={loading}
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
          '&.Mui-disabled': {
            backgroundColor: '#818cf8',
            color: '#ffffff',
            opacity: 0.85,
            cursor: 'not-allowed',
          },
        }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5 }}>
            <CircularProgress size={20} sx={{ color: '#ffffff' }} />
            <span>กำลังเข้าสู่ระบบ...</span>
          </Box>
        ) : (
          'Login'
        )}
      </Button>


    </Box>
  )
}
