import fs from 'fs'
import path from 'path'
import { getProblems, getProblem } from '@/app/actions'
import PracticeSession from '@/components/PracticeSession'
import { notFound } from 'next/navigation'

type Props = {
  params: Promise<{
    mode: string
    id: string
  }>
}

async function getFileContent(filename: string, type: 'problem' | 'answer') {
  const filePath = path.join(process.cwd(), 'public', type, filename)
  try {
    return await fs.promises.readFile(filePath, 'utf-8')
  } catch (e) {
    console.error(`Error reading file ${filePath}:`, e)
    return 'Error loading content.'
  }
}

export default async function PracticePage({ params }: Props) {
  const { mode, id } = await params
  const problemId = parseInt(id)
  
  if (isNaN(problemId)) return notFound()

  const problem = await getProblem(problemId)
  if (!problem) return notFound()

  const problemContent = await getFileContent(problem.problemFile, 'problem')
  const answerContent = await getFileContent(problem.answerFile, 'answer')

  // Determine Next ID
  let nextId: number | null = null
  const allProblems = await getProblems() // Already sorted by order ASC

  if (mode === 'seq') {
    const currentIndex = allProblems.findIndex(p => p.id === problemId)
    if (currentIndex !== -1 && currentIndex < allProblems.length - 1) {
      nextId = allProblems[currentIndex + 1].id
    }
  } else if (mode === 'random') {
    // Pick a random ID that is NOT the current one
    const otherProblems = allProblems.filter(p => p.id !== problemId)
    if (otherProblems.length > 0) {
      const randomIndex = Math.floor(Math.random() * otherProblems.length)
      nextId = otherProblems[randomIndex].id
    } else {
      // Only 1 problem exists
      nextId = problemId
    }
  }

  return (
    <PracticeSession
      problem={{
        id: problem.id,
        title: problem.title,
        problemContent,
        answerContent,
        audioUrl: `/sound/${problem.audioFile}`
      }}
      nextId={nextId}
      mode={mode as 'seq' | 'random'}
    />
  )
}
