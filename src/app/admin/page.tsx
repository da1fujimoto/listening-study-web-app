import { getFiles, getProblems, deleteProblem } from '@/app/actions'
import ProblemForm from '@/components/ProblemForm'
import DeleteProblemButton from '@/components/DeleteProblemButton'
import ReorderButtons from '@/components/ReorderButtons'
import MemorizedCheckbox from '@/components/MemorizedCheckbox'
import Link from 'next/link'

export default async function AdminPage() {
  const problemFiles = await getFiles('problem')
  const answerFiles = await getFiles('answer')
  const audioFiles = await getFiles('sound')
  const problems = await getProblems()

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Problem Management</h1>
        <Link href="/" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          &larr; Back to Home
        </Link>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Problem</h2>
        <ProblemForm 
          problemFiles={problemFiles} 
          answerFiles={answerFiles} 
          audioFiles={audioFiles} 
        />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Existing Problems</h2>
        <ul className="space-y-2">
          {problems.map((p: any, index: number) => (
            <li key={p.id} className="border p-3 rounded flex justify-between items-center bg-gray-50">
              <div className="flex items-center gap-3 flex-1">
                <ReorderButtons 
                  id={p.id} 
                  isFirst={index === 0} 
                  isLast={index === problems.length - 1} 
                />
                <div className="flex-1">
                  <span className={`font-medium ${p.isMemorized ? 'line-through text-gray-400' : ''}`}>{p.title}</span>
                  <div className="text-xs text-gray-500 mt-1">
                    P: {p.problemFile} | A: {p.answerFile} | S: {p.audioFile}
                  </div>
                </div>
                <MemorizedCheckbox id={p.id} isMemorized={p.isMemorized} />
              </div>
              <DeleteProblemButton id={p.id} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
