import { Box, Typography, Card } from '@mui/material'

interface AdminDashboardProps {
  username?: string
}

export function AdminDashboard({}: AdminDashboardProps) {
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

      {/* 2. Middle Row: Donut Chart (Left), Activity Columns (Middle), Top Tasks (Right) */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1.2fr 1fr' },
          gap: 3,
        }}
      >
        {/* User Proportion Card (Donut chart placeholder + legend lines) */}
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
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e293b', mb: 3, height: 20 }} />

          {/* Donut Layout */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1, minHeight: 180 }}>
            {/* Circle Placeholder */}
            <Box
              sx={{
                width: 100,
                height: 100,
                borderRadius: '50%',
                border: '16px solid #f1f5f9',
                borderColor: '#f1f5f9 #e2e8f0 #cbd5e1 #94a3b8', // mock segmented border
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            />
            {/* Legend Placeholder Lines */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, width: '100%' }}>
              {[...Array(3)].map((_, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#cbd5e1' }} />
                  <Box sx={{ height: 12, bgcolor: '#f1f5f9', borderRadius: '4px', width: '70%' }} />
                </Box>
              ))}
            </Box>
          </Box>
        </Card>

        {/* Daily Activity Column Chart Card (7 Days columns) */}
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
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e293b', mb: 3, height: 20 }} />

          {/* 7 Columns representation */}
          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-around',
              minHeight: 180,
            }}
          >
            {[1.5, 2, 1.8, 2.5, 3.5, 1.6, 1.4].map((heightScale, idx) => (
              <Box
                key={idx}
                sx={{
                  width: '10%',
                  height: `${heightScale * 20}%`, // varied heights
                  borderRadius: '6px 6px 0 0',
                  border: '1px solid #e2e8f0',
                  bgcolor: '#f8fafc',
                }}
              />
            ))}
          </Box>
        </Card>

        {/* Most Active Tasks Card (5 level rows) */}
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
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e293b', mb: 3, height: 20 }} />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {[...Array(5)].map((_, idx) => (
              <Box key={idx} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ height: 12, bgcolor: '#f1f5f9', borderRadius: '4px', width: '80%' }} />
                <Box
                  sx={{
                    height: 8,
                    borderRadius: '4px',
                    border: '1px solid #e2e8f0',
                    bgcolor: '#f8fafc',
                  }}
                />
              </Box>
            ))}
          </Box>
        </Card>
      </Box>

      {/* 3. Latest Users Section (Empty Container Box) */}
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

export default AdminDashboard
