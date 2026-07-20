import { Box, Typography, Card } from '@mui/material'

interface StudentHomeProps {
  username: string
  onSelectExercise: (exerciseId: number) => void
}

export function StudentHome({}: StudentHomeProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>

      {/* 1. Stats Row (4 Empty Containers) */}
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

      {/* 2. Progress by Level Section (Empty Container with 5 sub-boxes) */}
      <Card sx={{ p: 3, borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}>
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 700, color: '#1e293b', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}
        >
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(5, 1fr)' },
            gap: 2,
          }}
        >
          {[...Array(5)].map((_, idx) => (
            <Box
              key={idx}
              sx={{
                height: 130,
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                bgcolor: '#f8fafc',
              }}
            />
          ))}
        </Box>
      </Card>

      {/* 3. Session กำลังเรียน Section (Empty Container Box) */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 1 }}>
        </Typography>
        <Card
          sx={{
            minHeight: 320,
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            bgcolor: '#ffffff',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
          }}
        />
      </Box>

      {/* 4. ผลล่าสุด Section (Empty Container Box) */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 1 }}>
        </Typography>
        <Card
          sx={{
            minHeight: 160,
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
export default StudentHome
