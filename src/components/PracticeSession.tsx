'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AudioPlayer from './AudioPlayer'
import MarkdownViewer from './MarkdownViewer'
import MemorizedCheckbox from './MemorizedCheckbox'

type Props = {
  problem: {
    id: number
    title: string
    problemContent: string
    answerContent: string
    audioUrl: string
    isMemorized: boolean
  }
  nextId: number | null
  mode: 'seq' | 'random'
}

export default function PracticeSession({ problem, nextId, mode }: Props) {
  const [showAnswer, setShowAnswer] = useState(false)
  const router = useRouter()

  const handleNext = () => {
    if (nextId) {
      router.push(`/practice/${mode}/${nextId}`)
    }
  }

  return (
    <div className="max-w-md mx-auto p-4 pb-20 space-y-6">
      <header className="flex justify-between items-center gap-4">
        <h1 className="text-lg font-bold text-gray-800 truncate">{problem.title}</h1>
        <div className="flex items-center gap-3">
          <MemorizedCheckbox id={problem.id} isMemorized={problem.isMemorized} />
          <button 
            onClick={() => router.push('/')}
            className="text-sm text-gray-500 hover:text-gray-800"
          >
            Exit
          </button>
        </div>
      </header>

      <AudioPlayer src={problem.audioUrl} />

      <div className="bg-white p-4 rounded-xl shadow-sm border min-h-[200px]">
        <h2 className="text-xs font-bold text-gray-400 uppercase mb-2">Problem</h2>
        <MarkdownViewer content={problem.problemContent} />
      </div>

      {showAnswer ? (
        <div className="bg-green-50 p-4 rounded-xl shadow-sm border border-green-100 animate-in fade-in slide-in-from-bottom-4">
          <h2 className="text-xs font-bold text-green-600 uppercase mb-2">Answer & Explanation</h2>
          <MarkdownViewer content={problem.answerContent} />
          
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleNext}
              disabled={!nextId}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                nextId
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Next Problem
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAnswer(true)}
          className="w-full py-4 bg-gray-800 text-white rounded-xl font-medium hover:bg-gray-700 transition-colors shadow-lg"
        >
          Show Answer
        </button>
      )}
    </div>
  )
}
