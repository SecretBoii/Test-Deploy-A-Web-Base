import { useState } from 'react'
import { Box } from '@mui/material'
import { WorkspaceHeader } from './CodeWorkspace/WorkspaceHeader'
import { CodeEditor } from './CodeWorkspace/CodeEditor'
import { ConsoleOutput } from './CodeWorkspace/ConsoleOutput'
import { GeminiFeedback } from './CodeWorkspace/GeminiFeedback'
import { apiClient } from '../api/client'

export function CodeEditorPage() {
  const [code, setCode] = useState('# Write your Python code here\nprint("Hello World!")')
  const [output, setOutput] = useState('')
  const [geminiResponse, setGeminiResponse] = useState('')
  const [isRunning, setIsRunning] = useState(false)

  const handleRunCode = async () => {
    setIsRunning(true)
    setOutput('Running code...')
    setGeminiResponse('Waiting for Gemini feedback...')
    try {
      // เรียกไปยัง API backend (/exercises/run) โดยใช้ apiClient
      const response = await apiClient.post('/exercises/run', { code })
      setOutput(response.data.output || 'Code ran successfully with no output.')
      
      // สมมติว่ามีผลลัพธ์จาก gemini กลับมาจาก API (ปรับแต่งให้เข้ากับ API หลังบ้านของคุณ)
      setGeminiResponse(response.data.feedback || 'Gemini: โค้ดทำงานถูกต้องตามโครงสร้าง ไร้ข้อผิดพลาดครับ! (ตัวอย่างคำแนะนำ)')
    } catch (err: any) {
      setOutput(err.response?.data?.message || err.message || 'Error executing code')
      setGeminiResponse(err.response?.data?.feedback || 'Gemini: พบปัญหาในการรันโค้ด กรุณาตรวจสอบข้อผิดพลาดด้านซ้ายครับ')
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: '85vh' }}>
      {/* 1. Header Toolbar */}
      <WorkspaceHeader isRunning={isRunning} onRun={handleRunCode} />

      {/* 2. Main Workspace Split (Left: Editor, Right: Outputs Stack) */}
      <Box sx={{ display: 'flex', gap: 2, flexGrow: 1, minHeight: 0 }}>
        {/* ตัว Editor เขียนโค้ด (ฝั่งซ้าย) */}
        <CodeEditor code={code} onChange={setCode} />

        {/* ฝั่งขวา: คอนโซลแสดงผลลัพธ์ (บน) และข้อเสนอแนะ Gemini (ล่าง) */}
        <Box sx={{ flex: 0.8, display: 'flex', flexDirection: 'column', gap: 2, minWidth: '320px', minHeight: 0 }}>
          <ConsoleOutput output={output} />
          <GeminiFeedback response={geminiResponse} />
        </Box>
      </Box>
    </Box>
  )
}
