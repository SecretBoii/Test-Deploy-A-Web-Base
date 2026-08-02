import { Box, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { Terminal } from 'lucide-react'

interface ConsoleOutputProps {
  output: string
}

const TerminalContainer = styled(Box)(() => ({
  flex: 1, 
  display: 'flex', 
  flexDirection: 'column', 
  backgroundColor: '#0f172a', 
  borderRadius: '12px', 
  border: '1px solid rgba(255, 255, 255, 0.08)', 
  padding: '16px', 
  minHeight: 0,
  boxShadow: '0 4px 15px -3px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    borderColor: 'rgba(255, 255, 255, 0.15)',
    boxShadow: '0 0 12px rgba(255, 255, 255, 0.03), 0 4px 15px -3px rgba(0, 0, 0, 0.15)',
  }
}));

const TerminalHeader = styled(Box)(() => ({
  display: 'flex', 
  alignItems: 'center',
  marginBottom: '12px'
}));

const TerminalTitle = styled(Typography)(() => ({
  color: '#94a3b8', 
  fontWeight: 700, 
  fontSize: '0.875rem',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontFamily: "'Prompt', 'Plus Jakarta Sans', sans-serif"
}));

const TerminalContent = styled(Box)(() => ({
  flexGrow: 1, 
  overflowY: 'auto', 
  backgroundColor: '#020617', 
  borderRadius: '8px', 
  padding: '16px', 
  border: '1px solid rgba(255, 255, 255, 0.05)',
  boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.45)',
  display: 'flex',
  flexDirection: 'column'
}));

export function ConsoleOutput({ output }: ConsoleOutputProps) {
  const isError = output.toLowerCase().includes('error') || 
                  output.toLowerCase().includes('exception') || 
                  output.toLowerCase().includes('traceback') ||
                  output.toLowerCase().includes('failed')

  const textColor = isError ? '#f87171' : '#34d399' // Red-pink for errors, emerald green for output

  return (
    <TerminalContainer>
      <TerminalHeader>
        <TerminalTitle variant="subtitle2">
          <Terminal size={16} color="#94a3b8" /> Console Output
        </TerminalTitle>
      </TerminalHeader>
      
      <TerminalContent>
        <pre style={{ 
          margin: 0, 
          color: textColor, 
          fontFamily: "'Fira Code', ui-monospace, Consolas, monospace", 
          fontSize: '13px', 
          whiteSpace: 'pre-wrap',
          lineHeight: 1.6
        }}>
          {output || '$ Waiting for execution...'}
        </pre>
      </TerminalContent>
    </TerminalContainer>
  )
}

