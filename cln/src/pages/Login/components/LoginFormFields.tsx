import { TextField, Button, InputAdornment, Box } from '@mui/material'
import { User, Lock } from 'lucide-react'

interface LoginFormFieldsProps {
  username: string
  password: string
  error: string
  onChangeUsername: (val: string) => void
  onChangePassword: (val: string) => void
  onSubmit: (e: React.FormEvent) => void
}

export function LoginFormFields({
  username,
  password,
  error,
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
        variant="outlined"
        placeholder="username"
        type="text"
        value={username}
        onChange={(e) => onChangeUsername(e.target.value)}
        autoComplete="off"
        slotProps={{
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
      <Box component="div" sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="At least 8 characters"
          type="password"
          value={password}
          onChange={(e) => onChangePassword(e.target.value)}
          autoComplete="new-password"
          slotProps={{
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
        <Box
          component="a"
          href="#forgot"
          sx={{
            alignSelf: 'flex-end',
            fontSize: '13px',
            fontWeight: 700,
            color: '#4f46e5',
            textDecoration: 'none',
            transition: 'color 0.2s',
            '&:hover': {
              color: '#4338ca',
              textDecoration: 'underline',
            },
          }}
        >
          Forgot password?
        </Box>
      </Box>

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

      {/* Login CTA */}
      <Button
        fullWidth
        type="submit"
        variant="contained"
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
        Login
      </Button>


    </Box>
  )
}
