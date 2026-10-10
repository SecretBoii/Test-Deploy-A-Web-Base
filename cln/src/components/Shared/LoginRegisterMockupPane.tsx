import { Box } from '@mui/material'
import { Award, Play, MousePointer } from 'lucide-react'

export function LoginRegisterMockupPane() {
  return (
    <Box
      sx={{
        flex: 1,
        background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: { xs: '32px 24px', md: '48px' },
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
        gap: { xs: '40px', md: '0px' },
        alignItems: { xs: 'center', md: 'stretch' },
        '@media (prefers-color-scheme: dark)': {
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        },
      }}
    >
      {/* โลโก้แบรนด์ Python Exercise แนวนอนรูปที่ 2 (ไอคอน PE พร้อมชื่อโครงการ) สร้างอัตลักษณ์ที่สอดคล้องกับ Sidebar */}
      <Box
        component="img"
        src="/logo-brand.png"
        alt="Python Exercise"
        sx={{
          height: 42,
          maxWidth: '100%',
          objectFit: 'contain',
          display: 'block',
          alignSelf: 'flex-start',
        }}
      />

      {/* Mockup Cards Section */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          flexGrow: 1,
          gap: { xs: '30px', md: '40px' },
          position: 'relative',
          margin: { xs: '20px 0', md: '40px 0' },
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '320px',
            height: '280px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {/* Progress Card */}
          <Box
            sx={{
              bgcolor: '#ffffff',
              borderRadius: '20px',
              padding: '24px',
              boxShadow: '0px 10px 30px rgba(15, 23, 42, 0.06)',
              border: '1px solid #e2e8f0',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0px 20px 40px rgba(15, 23, 42, 0.1)',
              },
              '@media (prefers-color-scheme: dark)': {
                bgcolor: '#0f172a',
                borderColor: '#1e293b',
                boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.4)',
              },
              position: 'absolute',
              top: 0,
              left: 0,
              width: '170px',
              zIndex: 10,
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
            }}
          >
            <Box
              sx={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                bgcolor: 'rgba(79, 70, 229, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#4f46e5',
              }}
            >
              <Award size={20} />
            </Box>
            <Box
              component="span"
              sx={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#94a3b8',
                letterSpacing: '0.8px',
                textTransform: 'uppercase',
              }}
            >
              Exercises Solved
            </Box>
            <Box
              component="h3"
              sx={{
                fontSize: '26px',
                fontWeight: 800,
                color: '#312e81',
                margin: 0,
                '@media (prefers-color-scheme: dark)': {
                  color: '#6366f1',
                },
              }}
            >
              24 / 35
            </Box>
          </Box>

          {/* Donut Chart Card */}
          <Box
            sx={{
              bgcolor: '#ffffff',
              borderRadius: '20px',
              padding: '20px',
              boxShadow: '0px 10px 30px rgba(15, 23, 42, 0.06)',
              border: '1px solid #e2e8f0',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0px 20px 40px rgba(15, 23, 42, 0.1)',
              },
              '@media (prefers-color-scheme: dark)': {
                bgcolor: '#0f172a',
                borderColor: '#1e293b',
                boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.4)',
              },
              position: 'absolute',
              top: '40px',
              right: '-10px',
              width: '170px',
              zIndex: 20,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box
              sx={{
                position: 'relative',
                width: '130px',
                height: '130px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                '& circle.track': {
                  stroke: '#f8fafc',
                  '@media (prefers-color-scheme: dark)': {
                    stroke: '#2e1065',
                  },
                },
              }}
            >
              <svg width="120" height="120" viewBox="0 0 100 100">
                <circle
                  className="track"
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  strokeWidth="12"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#f59e0b"
                  strokeWidth="12"
                  strokeDasharray="65.3 251.3"
                  strokeDashoffset="0"
                  transform="rotate(-90 50 50)"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#4f46e5"
                  strokeWidth="12"
                  strokeDasharray="85.4 251.3"
                  strokeDashoffset="-65.3"
                  style={{ strokeDasharray: '13.5 3' }}
                  transform="rotate(-90 50 50)"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#ef4444"
                  strokeWidth="12"
                  strokeDasharray="55.3 251.3"
                  strokeDashoffset="-150.7"
                  transform="rotate(-90 50 50)"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#10b981"
                  strokeWidth="12"
                  strokeDasharray="45.3 251.3"
                  strokeDashoffset="-206"
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <Box
                sx={{
                  position: 'absolute',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                }}
              >
                <Box
                  component="span"
                  sx={{
                    fontSize: '18px',
                    fontWeight: 800,
                    color: '#0f172a',
                    lineHeight: 1,
                    '@media (prefers-color-scheme: dark)': {
                      color: '#f3f4f6',
                    },
                  }}
                >
                  34%
                </Box>
                <Box
                  component="span"
                  sx={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#64748b',
                    marginTop: '2px',
                  }}
                >
                  Python
                </Box>
              </Box>
              <Box
                component="span"
                sx={{
                  position: 'absolute',
                  bottom: '25px',
                  right: '25px',
                  zIndex: 30,
                  color: '#0f172a',
                  transform: 'rotate(-15deg)',
                  animation: 'floatPointer 3s ease-in-out infinite',
                  '@keyframes floatPointer': {
                    '0%, 100%': { transform: 'translate(0, 0) rotate(-15deg)' },
                    '50%': { transform: 'translate(-3px, -3px) rotate(-15deg)' },
                  },
                  '@media (prefers-color-scheme: dark)': {
                    color: '#f1f5f9',
                  },
                }}
              >
                <MousePointer fill="currentColor" size={24} />
              </Box>
            </Box>
          </Box>

          {/* Run Code Card */}
          <Box
            sx={{
              position: 'absolute',
              bottom: '-20px',
              left: '-20px',
              width: '200px',
              bgcolor: 'rgba(255, 255, 255, 0.6)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              borderRadius: '20px',
              padding: '24px',
              border: '2px dashed rgba(79, 70, 229, 0.2)',
              zIndex: 15,
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1,
              boxShadow: '0px 10px 25px rgba(15, 23, 42, 0.04)',
              '@media (prefers-color-scheme: dark)': {
                bgcolor: 'rgba(30, 41, 59, 0.6)',
                border: '2px dashed rgba(59, 130, 246, 0.25)',
              },
            }}
          >
            <Box
              sx={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                bgcolor: '#4f46e5',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.35)',
                transition: 'transform 0.2s ease, background-color 0.2s ease',
                cursor: 'pointer',
                paddingLeft: '3px',
                '&:hover': {
                  transform: 'scale(1.05)',
                  bgcolor: '#4338ca',
                },
              }}
            >
              <Play size={18} fill="currentColor" />
            </Box>
            <Box
              component="h4"
              sx={{
                fontSize: '14px',
                fontWeight: 700,
                color: '#0f172a',
                margin: 0,
                '@media (prefers-color-scheme: dark)': {
                  color: '#f3f4f6',
                },
              }}
            >
              Run Python Code
            </Box>
            <Box component="p" sx={{ fontSize: '11px', color: '#64748b', margin: 0 }}>
              or drop .py file here
            </Box>
          </Box>
        </Box>


      </Box>
    </Box>
  )
}
