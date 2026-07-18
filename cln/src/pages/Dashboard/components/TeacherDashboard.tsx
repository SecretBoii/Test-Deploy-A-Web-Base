import { Box, Typography, Card } from '@mui/material'

interface TeacherDashboardProps {
  username?: string
}

export function TeacherDashboard({}: TeacherDashboardProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>

      {/* 1. Stats Row (4 Empty Card Containers) */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
          gap: 2.5,
        }}
      >
        {[...Array(4)].map((_, idx) => (
          <Card
            key={idx}
            sx={{
              height: 110,
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              bgcolor: '#ffffff',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
            }}
          />
        ))}
      </Box>

      {/* 2. Middle Section: Bloom Level (Left) & Tasks Sent (Right) */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1.2fr 1fr' },
          gap: 3,
        }}
      >
        {/* Bloom Level Empty Card (with 5 sub-boxes) */}
        <Card
          sx={{
            p: 3,
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            bgcolor: '#ffffff',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
          }}
        >
          {/* Section Title Placeholder */}
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 700, color: '#1e293b', mb: 2, height: 20 }}
          />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {[...Array(5)].map((_, idx) => (
              <Box
                key={idx}
                sx={{
                  height: 32,
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  bgcolor: '#f8fafc',
                }}
              />
            ))}
          </Box>
        </Card>

        {/* Tasks Sent Empty Card (with 4 column sub-boxes) */}
        <Card
          sx={{
            p: 3,
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            bgcolor: '#ffffff',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Section Title Placeholder */}
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 700, color: '#1e293b', mb: 2, height: 20 }}
          />

          {/* Columns Chart Placeholder */}
          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-around',
              minHeight: 180,
            }}
          >
            {[...Array(4)].map((_, idx) => (
              <Box
                key={idx}
                sx={{
                  width: '18%',
                  height: `${(idx + 1) * 20}%`, // varied heights
                  borderRadius: '8px 8px 0 0',
                  border: '1px solid #e2e8f0',
                  bgcolor: '#f8fafc',
                }}
              />
            ))}
          </Box>
        </Card>
      </Box>

      {/* 3. Latest Results Section (Empty Container Box) */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1e293b', height: 24 }} />
        <Card
          sx={{
            minHeight: 260,
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            bgcolor: '#ffffff',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
          }}
        />
      </Box>

    </Box>
  )
}

export default TeacherDashboard
