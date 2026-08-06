import Editor from '@monaco-editor/react'
import { Box } from '@mui/material'
import { styled } from '@mui/material/styles'

interface CodeEditorProps {
  code: string
  onChange: (value: string) => void
}

const EditorContainer = styled(Box)(() => ({
  flex: 1.4, 
  border: '1px solid #cbd5e1', 
  borderRadius: '12px', 
  overflow: 'hidden', 
  backgroundColor: '#1e1e1e',
  display: 'flex',
  flexDirection: 'column'
}));

export function CodeEditor({ code, onChange }: CodeEditorProps) {
  return (
    <EditorContainer>
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
    </EditorContainer>
  )
}

