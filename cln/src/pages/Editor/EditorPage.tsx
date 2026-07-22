import { useParams, Navigate, useSearchParams } from 'react-router-dom'
import { MainLayout } from '../../components/MainLayout'
import { CodeEditorPage } from '../../components/CodeEditorPage'
import { useAuth } from '../../context/AuthContext'

export function EditorPage() {
  const { user } = useAuth()
  const { exerciseId } = useParams<{ exerciseId: string }>()
  const [ searchParams ] = useSearchParams()
  const sessionId = searchParams.get('sessionId') 

  if (user?.roleId !== 1) {
    return <Navigate to="/dashboard" replace />
  }

  const numericExerciseId = exerciseId ? parseInt(exerciseId, 10) : undefined
  const numericSessionId = sessionId ? parseInt(sessionId, 10) : undefined

  return (
    <MainLayout activeItem="Sessions">
      <CodeEditorPage exerciseId={numericExerciseId} sessionId={numericSessionId}/>
    </MainLayout>
  )
}

export default EditorPage
