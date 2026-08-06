import { Box } from '@mui/material'
import { RegisterFormFields } from './RegisterFormFields.tsx'
import { useNavigate } from 'react-router-dom'

interface RegisterFormProps {
  step: number
  username: string
  password: string
  firstName: string
  lastName: string
  email: string
  gender: string
  dateOfBirth: string
  university: string
  faculty: string
  major: string
  error: string
  success: string
  onChangeUsername: (val: string) => void
  onChangePassword: (val: string) => void
  onChangeFirstName: (val: string) => void
  onChangeLastName: (val: string) => void
  onChangeEmail: (val: string) => void
  onChangeGender: (val: string) => void
  onChangeDateOfBirth: (val: string) => void
  onChangeUniversity: (val: string) => void
  onChangeFaculty: (val: string) => void
  onChangeMajor: (val: string) => void
  onNext: () => void
  onBack: () => void
  onSubmit: (e: React.FormEvent) => void
}

export function RegisterForm({
  step,
  username,
  password,
  firstName,
  lastName,
  email,
  gender,
  dateOfBirth,
  university,
  faculty,
  major,
  error,
  success,
  onChangeUsername,
  onChangePassword,
  onChangeFirstName,
  onChangeLastName,
  onChangeEmail,
  onChangeGender,
  onChangeDateOfBirth,
  onChangeUniversity,
  onChangeFaculty,
  onChangeMajor,
  onNext,
  onBack,
  onSubmit,
}: RegisterFormProps) {
  const navigate = useNavigate()

  return (
    <Box
      sx={{
        flex: 1.1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: { xs: '48px 24px', md: '48px' },
        bgcolor: '#ffffff',
        boxSizing: 'border-box',
        '@media (prefers-color-scheme: dark)': {
          bgcolor: '#0f172a',
        },
      }}
    >
      <div />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          flexGrow: 1,
          maxWidth: '400px',
          width: '100%',
          margin: { xs: '40px auto', md: '0 auto' },
          gap: 4.5,
          boxSizing: 'border-box',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box
            component="h2"
            sx={{
              fontSize: '32px',
              fontWeight: 800,
              color: '#0f172a',
              letterSpacing: '-0.5px',
              margin: 0,
              '@media (prefers-color-scheme: dark)': {
                color: '#f3f4f6',
              },
            }}
          >
            {step === 1 ? 'Account Credentials' : step === 2 ? 'Personal Info' : 'Education Info'}
          </Box>
          <Box component="p" sx={{ fontSize: '14px', color: '#64748b', fontWeight: 500, margin: 0 }}>
            {step === 1 
              ? 'Please choose your username, password, and email.' 
              : step === 2 
                ? 'Please fill in your basic personal details.' 
                : 'Please select your academic information.'}
          </Box>
        </Box>

        {/* แบบฟอร์มแสดงผลช่องกรอกตามขั้นตอน */}
        <RegisterFormFields
          step={step}
          username={username}
          password={password}
          firstName={firstName}
          lastName={lastName}
          email={email}
          gender={gender}
          dateOfBirth={dateOfBirth}
          university={university}
          faculty={faculty}
          major={major}
          error={error}
          success={success}
          onChangeUsername={onChangeUsername}
          onChangePassword={onChangePassword}
          onChangeFirstName={onChangeFirstName}
          onChangeLastName={onChangeLastName}
          onChangeEmail={onChangeEmail}
          onChangeGender={onChangeGender}
          onChangeDateOfBirth={onChangeDateOfBirth}
          onChangeUniversity={onChangeUniversity}
          onChangeFaculty={onChangeFaculty}
          onChangeMajor={onChangeMajor}
          onNext={onNext}
          onBack={onBack}
          onSubmit={onSubmit}
        />

        {/* ลิงก์กลับหน้า Login (ซ่อนเมื่ออยู่หน้า 2 เพื่อให้ฟอร์มดูเป็นสัดส่วนมากขึ้น) */}
        {step === 1 && (
          <Box sx={{ textAlign: 'center', fontSize: '14px', fontWeight: 600, color: '#64748b', mt: 2 }}>
            Already have an account?{' '}
            <Box
              component="span"
              onClick={() => navigate('/')}
              sx={{
                color: '#4f46e5',
                cursor: 'pointer',
                fontWeight: 700,
                '&:hover': {
                  color: '#4338ca',
                  textDecoration: 'underline',
                },
              }}
            >
              Sign In
            </Box>
          </Box>
        )}
      </Box>
      <div />
    </Box>
  )
}
