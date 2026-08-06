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
  backgroundColor: 'var(--bg)', 
  borderRadius: '12px', 
  border: '1px solid var(--border)', 
  padding: '16px', 
  minHeight: 0,
  boxShadow: 'var(--shadow)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    borderColor: 'var(--border)',
    boxShadow: 'var(--shadow)',
  }
}));

const TerminalHeader = styled(Box)(() => ({
  display: 'flex', 
  alignItems: 'center',
  marginBottom: '12px'
}));

const TerminalTitle = styled(Typography)(() => ({
  color: 'var(--text)', 
  fontWeight: 700, 
  fontSize: '0.875rem',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontFamily: 'inherit'
}));

const TerminalContent = styled(Box)(() => ({
  flexGrow: 1, 
  overflowY: 'auto', 
  backgroundColor: 'var(--code-bg)', 
  borderRadius: '8px', 
  padding: '16px', 
  border: '1px solid var(--border)',
  boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.05)',
  display: 'flex',
  flexDirection: 'column'
}));

export function ConsoleOutput({ output }: ConsoleOutputProps) {
  const isError = output.toLowerCase().includes('error') || 
                  output.toLowerCase().includes('exception') || 
                  output.toLowerCase().includes('traceback') ||
                  output.toLowerCase().includes('failed')

  const isWaiting = !output || output.includes('Waiting for execution...')
  const textColor = isWaiting ? 'var(--text)' : (isError ? '#ef4444' : 'var(--text-h)')

  return (
    <TerminalContainer>
      <TerminalHeader>
        <TerminalTitle variant="subtitle2">
          <Terminal size={16} color="#475569" /> Console Output
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

