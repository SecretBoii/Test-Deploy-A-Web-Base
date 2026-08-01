import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { register } from '../../api'
import { Box } from '@mui/material'
import { LoginRegisterMockupPane } from '../../components/Shared/LoginRegisterMockupPane.tsx'
import { RegisterForm } from './components/RegisterForm.tsx'

export function Register() {
  const navigate = useNavigate()
  
  const [step, setStep] = useState(1)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [gender, setGender] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [university, setUniversity] = useState('')
  const [faculty, setFaculty] = useState('')
  const [major, setMajor] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleNextStep = () => {
    if (step === 1) {
      if (!username.trim() || !password) {
        setError('กรุณากรอก Username และ Password ให้ครบถ้วน')
        return
      }
      setError('')
      setStep(2)
    } else if (step === 2) {
      if (!gender || !dateOfBirth) {
        setError('กรุณาระบุเพศและวันเกิดให้ครบถ้วน')
        return
      }
      setError('')
      setStep(3)
    }
  }

  const handlePrevStep = () => {
    setError('')
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!university.trim() || !faculty.trim() || !major.trim()) {
      setError('กรุณากรอกข้อมูลสถาบันการศึกษาให้ครบถ้วน')
      return
    }

    try {
      await register({
        username: username.trim(),
        password,
        gender,
        dateOfBirth,
        university: university.trim(),
        faculty: faculty.trim(),
        major: major.trim(),
      })
      
      setSuccess('สมัครสมาชิกสำเร็จแล้ว! กำลังนำคุณไปหน้าเข้าสู่ระบบ...')
      setTimeout(() => {
        navigate('/')
      }, 2000)
    } catch (err: any) {
      console.error('Registration error:', err)
      const errorMsg = err.response?.data?.message || 'การสมัครสมาชิกล้มเหลว กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง'
      setError(Array.isArray(errorMsg) ? errorMsg.join(', ') : errorMsg)
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        width: '100%',
        bgcolor: '#ffffff',
        fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
        boxSizing: 'border-box',
        flexDirection: { xs: 'column', md: 'row' },
        '@media (prefers-color-scheme: dark)': {
          bgcolor: '#0f172a',
        },
      }}
    >
      {/* ฝั่งซ้าย - หน้าจอจำลอง Mockup การเขียนโค้ดและเป้าหมาย */}
      <LoginRegisterMockupPane />

      {/* ฝั่งขวา - ฟอร์มกรอกสมัครสมาชิก */}
      <RegisterForm
        step={step}
        username={username}
        password={password}
        gender={gender}
        dateOfBirth={dateOfBirth}
        university={university}
        faculty={faculty}
        major={major}
        error={error}
        success={success}
        onChangeUsername={setUsername}
        onChangePassword={setPassword}
        onChangeGender={setGender}
        onChangeDateOfBirth={setDateOfBirth}
        onChangeUniversity={setUniversity}
        onChangeFaculty={setFaculty}
        onChangeMajor={setMajor}
        onNext={handleNextStep}
        onBack={handlePrevStep}
        onSubmit={handleSubmit}
      />
    </Box>
  )
}

export default Register
