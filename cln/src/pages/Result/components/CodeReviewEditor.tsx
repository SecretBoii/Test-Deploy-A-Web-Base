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
        borderRadius: '24px', 
        border: '1px solid #e2e8f0', 
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02), 0 2px 4px -1px rgba(0,0,0,0.01)',
        bgcolor: '#ffffff'
      }}
    >
      {/* Title Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
        <Box 
          sx={{ 
            p: 1, 
            borderRadius: '12px', 
            bgcolor: '#dbeafe', 
            color: '#2563eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Code size={20} />
        </Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a' }}>
          โค้ดที่ส่งตรวจ
        </Typography>
      </Box>

      {/* Editor Title */}
      <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', display: 'block', mb: 1, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Source Code
      </Typography>

      {/* Code Editor Container without macOS Titlebar */}
      <Box 
        sx={{ 
          borderRadius: '16px', 
          overflow: 'hidden', 
          border: '1px solid #1e293b',
          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)',
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
