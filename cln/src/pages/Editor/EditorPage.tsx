import { useParams, useSearchParams } from 'react-router-dom'
import { MainLayout } from '../../components/Layout/MainLayout'
import { CodeEditorPage } from '../../components/Shared/CodeEditorPage'

export function EditorPage() {
  const { exerciseId } = useParams<{ exerciseId: string }>()
  const [ searchParams ] = useSearchParams()
  const sessionId = searchParams.get('sessionId') 

  const numericExerciseId = exerciseId ? parseInt(exerciseId, 10) : undefined
  const numericSessionId = sessionId ? parseInt(sessionId, 10) : undefined

  return (
    <MainLayout activeItem="Sessions">
      <CodeEditorPage exerciseId={numericExerciseId} sessionId={numericSessionId}/>
    </MainLayout>
  )
}

export default EditorPage
