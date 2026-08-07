import { useState, useEffect, useRef } from 'react'
import { Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { WorkspaceHeader } from '../CodeWorkspace/WorkspaceHeader'
import { CodeEditor } from '../CodeWorkspace/CodeEditor'
import { ConsoleOutput } from '../CodeWorkspace/ConsoleOutput'
import { GemmaFeedback } from '../CodeWorkspace/GemmaFeedback'
import { ExerciseHint } from '../CodeWorkspace/ExerciseHint'
import { apiClient } from '../../api/client'

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
}

export function CodeEditorPage({ exerciseId = 101, sessionId }: CodeEditorPageProps) {
  const navigate = useNavigate();
  const [code, setCode] = useState('# Write your Python code here\nprint("Hello World!")')
  const [output, setOutput] = useState('')
  const [gemmaResponse, setGemmaResponse] = useState('')
  const [score, setScore] = useState<number | null>(null)
  const [runCount, setRunCount] = useState<number>(0)
  const [isRunning, setIsRunning] = useState(false)
  const [exerciseData, setExerciseData] = useState<ExerciseDetail | null>(null)
  const [loadingExercise, setLoadingExercise] = useState(false)
  const [hintUsed, setHintUsed] = useState(false)
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
      setHintUsed(false)
      apiClient
        .get(`/exercises/${exerciseId}`)
        .then((res) => {
          setExerciseData(res.data)
        })
        .catch((err) => {
          console.error('Failed to load exercise:', err)
        })
        .finally(() => {
          setLoadingExercise(false)
        })
    }
  }, [exerciseId])
  
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
    } catch (err: any) {
      setIsRunning(false)
      setOutput(err.response?.data?.message || err.message || 'เกิดข้อผิดพลาดในการรันโค้ด')
      setGemmaResponse('เกิดข้อผิดพลาดในการเชื่อมต่อกับระบบ AI')
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
        onSubmit={() => executeAndPoll('/exercises/submit')}
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
            onUseHint={() => setHintUsed(true)}
          />
          <ConsoleOutput output={output} />
          <GemmaFeedback response={gemmaResponse} score={score} />
        </Box>
      </Box>
    </Box>
  )
}
