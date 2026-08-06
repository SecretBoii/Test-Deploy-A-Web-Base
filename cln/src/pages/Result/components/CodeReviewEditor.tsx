import { Box, Typography, Paper } from '@mui/material'
import MonacoEditor from '@monaco-editor/react'
import { Code } from 'lucide-react'

interface CodeReviewEditorProps {
  sourceCode: string
}

export function CodeReviewEditor({ sourceCode }: CodeReviewEditorProps) {
  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 3, 
        borderRadius: '16px',
        border: '1px solid #e2e8f0', 
        boxShadow: 'none',
        bgcolor: '#ffffff'
      }}
    >
      {/* Title Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
        <Box 
          sx={{ 
            p: 1, 
            borderRadius: '8px', 
            bgcolor: '#f1f5f9', 
            color: '#475569',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Code size={18} />
        </Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '1rem' }}>
          โค้ดที่ส่งตรวจ
        </Typography>
      </Box>

      {/* Code Editor Container without macOS Titlebar */}
      <Box 
        sx={{ 
          borderRadius: '12px', 
          overflow: 'hidden', 
          border: '1px solid #e2e8f0',
          height: '350px'
        }}
      >
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
            padding: { top: 10, bottom: 10 },
          }}
        />
      </Box>
    </Paper>
  )
}

