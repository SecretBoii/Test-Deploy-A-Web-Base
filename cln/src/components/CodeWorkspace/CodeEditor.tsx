import Editor from '@monaco-editor/react'
import { Box } from '@mui/material'

interface CodeEditorProps {
  code: string
  onChange: (value: string) => void
}

export function CodeEditor({ code, onChange }: CodeEditorProps) {
  return (
    <Box sx={{ flex: 1.2, border: '1px solid #cbd5e1', borderRadius: '12px', overflow: 'hidden', bgcolor: '#1e1e1e' }}>
      <Editor
        height="100%"
        defaultLanguage="python"
        theme="vs-dark"
        value={code}
        onChange={(value) => onChange(value || '')}
        options={{
          fontSize: 14,
          minimap: { enabled: false }, // ปิดตัวแผนที่นำทางย่อด้านข้าง
          automaticLayout: true,
        }}
      />
    </Box>
  )
}
