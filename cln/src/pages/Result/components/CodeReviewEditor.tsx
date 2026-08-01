import { Box, Typography, Paper } from '@mui/material'
import MonacoEditor from '@monaco-editor/react'

interface CodeReviewEditorProps {
  sourceCode: string
}

export function CodeReviewEditor({ sourceCode }: CodeReviewEditorProps) {
  return (
    <Paper sx={{ p: 2.5, borderRadius: '16px', border: '1px solid #e2e8f0', height: '100%' }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: '#1e293b' }}>
        โค้ดที่คุณส่งประเมิน:
      </Typography>
      <Box sx={{ height: '400px', border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden' }}>
        <MonacoEditor
          height="100%"
          language="python"
          theme="vs-dark"
          value={sourceCode}
          options={{
            readOnly: true,
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
          }}
        />
      </Box>
    </Paper>
  )
}
