import { useState, useEffect, useRef } from 'react'
import { Box, Card, Typography, Button } from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom'
import { Lock, ArrowLeft } from 'lucide-react'
import { WorkspaceHeader } from '../CodeWorkspace/WorkspaceHeader'
import { CodeEditor } from '../CodeWorkspace/CodeEditor'
import { ConsoleOutput } from '../CodeWorkspace/ConsoleOutput'
import { GemmaFeedback } from '../CodeWorkspace/GemmaFeedback'
import { ExerciseHint } from '../CodeWorkspace/ExerciseHint'
import { apiClient } from '../../api/client'
import { ConfirmSubmitDialog } from '../CodeWorkspace/ConfirmSubmitDialog'

interface CodeEditorPageProps {
  exerciseId?: number
  sessionId?: number
}

export interface ExerciseDetail {
  exerciseId: number
  title: string
  description: string
  topic: string
  objective: string
  difficultyLevel: number
  expectedTime: number
  status?: string
  hint: string
  runCount?: number
  hasUsedHint?: boolean
}

export function CodeEditorPage({ exerciseId = 101, sessionId }: CodeEditorPageProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [code, setCode] = useState('# Write your Python code here\nprint("Hello World!")')
  const [output, setOutput] = useState('')
  const [gemmaResponse, setGemmaResponse] = useState('')
  const [score, setScore] = useState<number | null>(null)
  const [runCount, setRunCount] = useState<number>(0)
  const [isRunning, setIsRunning] = useState(false)
  const [exerciseData, setExerciseData] = useState<ExerciseDetail | null>(null)
  const [exerciseError, setExerciseError] = useState<string | null>(null)
  const [loadingExercise, setLoadingExercise] = useState(false)
  const [hintUsed, setHintUsed] = useState(false)
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false)
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (exerciseData && typeof exerciseData.runCount === 'number') {
      setRunCount(exerciseData.runCount)
    } else {
      setRunCount(0)
    }
  }, [exerciseData])
  
  useEffect(() => {
    if (exerciseId) {
      setLoadingExercise(true)
      // รีเซ็ตสถานะการใช้คำใบ้เป็น false ทันทีที่มีการเปลี่ยนหรือโหลดข้อใหม่ เพื่อป้องกันสถานะจากข้อก่อนหน้าค้าง
      setHintUsed(false)
      apiClient
        .get(`/exercises/${exerciseId}`)
        .then((res) => {
          setExerciseData(res.data)
          setExerciseError(null)
          // หากผู้เรียนเคยเปิดดูคำใบ้ในรอบปัจจุบันของข้อนี้มาก่อน ให้เปิดค้างไว้ตามเดิมแม้จะมีการรีเฟรชหน้าเว็บ
          if (res.data?.hasUsedHint) {
            setHintUsed(true)
          } else {
            setHintUsed(false)
          }
        })
        .catch((err) => {
          console.error('Failed to load exercise:', err)
          const message =
            err.response?.data?.message || 'ไม่สามารถโหลดข้อมูลแบบฝึกหัดได้'
          setExerciseError(message)
        })
        .finally(() => {
          setLoadingExercise(false)
        })
    }
  }, [exerciseId, location.key])
  
  // ทำความสะอาด Interval เมื่อ Component ถูกถอดออก (unmount) ป้องกัน Memory Leak
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current)
      }
    }
  }, [])

  const executeAndPoll = async (endpoint: '/exercises/run' | '/exercises/submit') => {
    // ล้าง Interval เดิมหากยังมีอยู่
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current)
    }
    setIsRunning(true)
    setOutput('กำลังรันโค้ดและส่งเข้า Queue...')
    setGemmaResponse('Gemma กำลังเตรียมวิเคราะห์โค้ดและคำนวณคะแนน...')
    setScore(null)

    let nextRunCount = runCount
    if (endpoint === '/exercises/run') {
      nextRunCount = runCount + 1
      setRunCount(nextRunCount)
    }

    try {
      // 1. ส่งโค้ดไปยัง Backend
      const res = await apiClient.post(endpoint, {
        exerciseId: String(exerciseId),
        sessionId: sessionId ? String(sessionId) : undefined,
        sourceCode: code,
        hintUsed: hintUsed,
        runCount: nextRunCount,
      })

      const activityId = res.data.activityId
      if (!activityId) {
        throw new Error('ไม่ได้รับ Activity ID จากระบบ')
      }

      setOutput('โค้ดกำลังรันใน Sandbox และรอผลลัพธ์จาก Gemma...')

      // 2. Poll สถานะจาก Backend (/exercises/status/:activityId)
      let attempts = 0
      const maxAttempts = 60

      pollIntervalRef.current = setInterval(async () => {
        attempts++
        try {
          const statusRes = await apiClient.get(`/exercises/status/${activityId}`)
          const data = statusRes.data

          // แสดงผล Console Output ทันทีที่มีผลลัพธ์จาก Docker (แม้ Gemma จะยังวิเคราะห์ไม่เสร็จ)
          const liveOutput = data.exceptionMessage || data.output
          if (liveOutput) {
            setOutput(liveOutput)
          }

          const isDone = String(data.status || data.rawStatus).toLowerCase() !== 'pending'

          if (isDone) {
            if (pollIntervalRef.current) {
              clearInterval(pollIntervalRef.current)
              pollIntervalRef.current = null
            }
            setIsRunning(false)

            if (endpoint === '/exercises/submit') {
              setHintUsed(false)
              navigate(`/result/${activityId}`)
              return
            }

            if (!data.output && !data.exceptionMessage) {
              setOutput('โค้ดทำงานสำเร็จ (ไม่มีข้อความ print ออกมา)')
            }

            // แสดงผล คะแนน
            if (typeof data.score === 'number') {
              setScore(data.score)
            }

            // แสดงผล จำนวนครั้งที่รัน (runCount)
            if (typeof data.runCount === 'number') {
              setRunCount(data.runCount)
            }

            // แสดงผล Gemma Feedback
            if (data.aiFeedback) {
              setGemmaResponse(data.aiFeedback)
            } else {
              setGemmaResponse('Gemma ประมวลผลเสร็จสิ้นเรียบร้อยแล้ว')
            }
          } else if (attempts >= maxAttempts) {
            if (pollIntervalRef.current) {
              clearInterval(pollIntervalRef.current)
              pollIntervalRef.current = null
            }
            setIsRunning(false)
            setOutput('การประมวลผลใช้เวลานานเกินกำหนด (Timeout)')
            setGemmaResponse('ไม่สามารถรับข้อมูลจาก Gemma ได้ในขณะนี้')
          }
        } catch (pollErr) {
          console.error('Polling status error:', pollErr)
        }
      }, 1000)
    } catch (err: unknown) {
      setIsRunning(false)
      const errResponse = (err as { response?: { data?: { message?: unknown } }; message?: string })?.response?.data?.message
      const rawMsg = errResponse ?? (err as Error)?.message ?? 'เกิดข้อผิดพลาดในการรันโค้ด'
      const formattedMsg = Array.isArray(rawMsg) ? rawMsg.join(', ') : String(rawMsg)
      setOutput(formattedMsg)
      setGemmaResponse('เกิดข้อผิดพลาดในการเชื่อมต่อกับระบบ AI')
    }
  }

  if (exerciseError && !loadingExercise) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '75vh',
          p: 3,
        }}
      >
        <Card
          sx={{
            maxWidth: 480,
            width: '100%',
            p: 4,
            borderRadius: '24px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 8px 30px rgba(15, 23, 42, 0.05)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            bgcolor: '#ffffff',
          }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '20px',
              bgcolor: '#fef2f2',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 1,
            }}
          >
            <Lock size={32} />
          </Box>
          <Typography
            variant="h6"
            sx={{ fontWeight: 800, color: '#0f172a', fontSize: '1.2rem' }}
          >
            ไม่สามารถเข้าถึงแบบฝึกหัดได้
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: '#64748b', lineHeight: 1.6, fontSize: '14px' }}
          >
            {exerciseError}
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/sessions')}
            startIcon={<ArrowLeft size={16} />}
            sx={{
              mt: 2,
              bgcolor: '#4f46e5',
              borderRadius: '10px',
              px: 3,
              py: 1.2,
              fontWeight: 700,
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': { bgcolor: '#4338ca', boxShadow: 'none' },
            }}
          >
            กลับสู่หน้ารวมบทเรียน
          </Button>
        </Card>
      </Box>
    )
  }

  // บันทึกการเปิดคำใบ้ลงฐานข้อมูลทันทีแบบ Real-time เพื่อป้องกันข้อมูลสูญหายเมื่อรีเฟรชหน้าเว็บ
  const handleUseHint = async () => {
    setHintUsed(true)
    if (!exerciseId) return
    try {
      await apiClient.post(`/exercises/${exerciseId}/hint`)
    } catch (err) {
      console.error('ไม่สามารถบันทึกสถานะการเปิดดูคำใบ้ได้:', err)
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: '85vh' }}>
      {/* 1. Header Toolbar */}
      <WorkspaceHeader
        exerciseData={exerciseData}
        loading={loadingExercise}
        isRunning={isRunning}
        runCount={runCount}
        onRun={() => executeAndPoll('/exercises/run')}
        onSubmit={() => setSubmitDialogOpen(true)}
      />

      {/* 2. Main Workspace Split (Left: Editor, Right: Outputs Stack) */}
      <Box sx={{ display: 'flex', gap: 2, flexGrow: 1, minHeight: 0 }}>
        {/* ตัว Editor เขียนโค้ด (ฝั่งซ้าย) */}
        <CodeEditor code={code} onChange={setCode} />

        {/* ฝั่งขวา: คอนโซลแสดงผลลัพธ์, คำใบ้โจทย์ และข้อเสนอแนะ Gemma */}
        <Box sx={{ flex: 0.8, display: 'flex', flexDirection: 'column', gap: 2, minWidth: '320px', minHeight: 0 }}>
          <ExerciseHint 
            hint={exerciseData?.hint} 
            loading={loadingExercise} 
            hintUsed={hintUsed}
            onUseHint={handleUseHint}
          />
          <ConsoleOutput output={output} />
          <GemmaFeedback response={gemmaResponse} score={score} />
        </Box>
      </Box>

      {/* Dialog ยืนยันการส่งคำตอบ */}
      <ConfirmSubmitDialog
        open={submitDialogOpen}
        onClose={() => setSubmitDialogOpen(false)}
        onConfirm={() => {
          setSubmitDialogOpen(false)
          executeAndPoll('/exercises/submit')
        }}
        exerciseTitle={exerciseData?.title}
        runCount={runCount}
      />
    </Box>
  )
}
