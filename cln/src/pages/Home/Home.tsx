import { useState } from 'react'
import { MainLayout } from '../../components/MainLayout'
import { Box } from '@mui/material'

export function Home() {
  const [activeItem, setActiveItem] = useState('Home')

  return (
    <MainLayout activeItem={activeItem} onItemClick={setActiveItem}>
      {/* Main content will go here */}
      <Box>
        <h2>{activeItem}</h2>
        {/* Page content details will be implemented here */}
      </Box>
    </MainLayout>
  )
}

export default Home
