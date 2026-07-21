import { useState } from 'react'
import { Box } from '@mui/material'
import { WorkspaceHeader } from './CodeWorkspace/WorkspaceHeader'
import { CodeEditor } from './CodeWorkspace/CodeEditor'
import { ConsoleOutput } from './CodeWorkspace/ConsoleOutput'
import { GeminiFeedback } from './CodeWorkspace/GeminiFeedback'
import { ExerciseHint } from './CodeWorkspace/ExerciseHint'
import { apiClient } from '../api/client'

interface CodeEditorPageProps {
  exerciseId?: number
}

export function CodeEditorPage({ exerciseId = 101 }: CodeEditorPageProps) {
  const [code, setCode] = useState('# Write your Python code here\nprint("Hello World!")')
  const [output, setOutput] = useState('')
  const [geminiResponse, setGeminiResponse] = useState('')
  const [score, setScore] = useState<number | null>(null)
  const [runCount, setRunCount] = useState<number | null>(null)
  const [isRunning, setIsRunning] = useState(false)

  const executeAndPoll = async (endpoint: '/exercises/run' | '/exercises/submit') => {
    setIsRunning(true)
    setOutput('🚀 กำลังรันโค้ดและส่งเข้า Queue...')
    setGeminiResponse('🤖 Gemini กำลังเตรียมวิเคราะห์โค้ดและคำนวณคะแนน...')
    setScore(null)

    try {
      // 1. ส่งโค้ดไปยัง Backend
      const res = await apiClient.post(endpoint, {
        userId: '1',
        exerciseId: String(exerciseId),
        sourceCode: code,
        hintUsed: false,
      })

      const activityId = res.data.activityId
      if (!activityId) {
        throw new Error('ไม่ได้รับ Activity ID จากระบบ')
      }

      setOutput('⏳ โค้ดกำลังรันใน Sandbox และรอผลลัพธ์จาก Gemini...')

      // 2. Poll สถานะจาก Backend (/exercises/status/:activityId)
      let attempts = 0
      const maxAttempts = 25

      const interval = setInterval(async () => {
        attempts++
        try {
          const statusRes = await apiClient.get(`/exercises/status/${activityId}`)
          const data = statusRes.data

          if (data.status === 'SUCCESS' || data.status === 'FAILED') {
            clearInterval(interval)
            setIsRunning(false)

            // แสดงผล Result (stdout) หรือ Exception (stderr) ใน Console Output
            if (data.exceptionMessage) {
              setOutput(data.exceptionMessage)
            } else {
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

            // แสดงผล Gemini Feedback
            if (data.aiFeedback) {
              setGeminiResponse(data.aiFeedback)
            } else {
              setGeminiResponse('Gemini ประมวลผลเสร็จสิ้นเรียบร้อยแล้ว')
            }
          } else if (attempts >= maxAttempts) {
            clearInterval(interval)
            setIsRunning(false)
            setOutput('⚠️ การประมวลผลใช้เวลานานเกินกำหนด (Timeout)')
            setGeminiResponse('ไม่สามารถรับข้อมูลจาก Gemini ได้ในขณะนี้')
          }
        } catch (pollErr) {
          console.error('Polling status error:', pollErr)
        }
      }, 1000)
    } catch (err: any) {
      setIsRunning(false)
      setOutput(err.response?.data?.message || err.message || 'เกิดข้อผิดพลาดในการรันโค้ด')
      setGeminiResponse('เกิดข้อผิดพลาดในการเชื่อมต่อกับระบบ AI')
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: '85vh' }}>
      {/* 1. Header Toolbar */}
      <WorkspaceHeader
        exerciseId={exerciseId}
        isRunning={isRunning}
        runCount={runCount}
        onRun={() => executeAndPoll('/exercises/run')}
        onSubmit={() => executeAndPoll('/exercises/submit')}
      />

      {/* 2. Main Workspace Split (Left: Editor, Right: Outputs Stack) */}
      <Box sx={{ display: 'flex', gap: 2, flexGrow: 1, minHeight: 0 }}>
        {/* ตัว Editor เขียนโค้ด (ฝั่งซ้าย) */}
        <CodeEditor code={code} onChange={setCode} />

        {/* ฝั่งขวา: คอนโซลแสดงผลลัพธ์, คำใบ้โจทย์ และข้อเสนอแนะ Gemini */}
        <Box sx={{ flex: 0.8, display: 'flex', flexDirection: 'column', gap: 2, minWidth: '320px', minHeight: 0 }}>
          <ExerciseHint exerciseId={exerciseId} />
          <ConsoleOutput output={output} />
          <GeminiFeedback response={geminiResponse} score={score} />
        </Box>
      </Box>
    </Box>
  )
}
