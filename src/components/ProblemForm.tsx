'use client'

import { createProblem } from '@/app/actions'
import { useState } from 'react'

type Props = {
  problemFiles: string[]
  answerFiles: string[]
  audioFiles: string[]
}

export default function ProblemForm({ problemFiles, answerFiles, audioFiles }: Props) {
  const [message, setMessage] = useState('')

  async function handleSubmit(formData: FormData) {
    try {
      await createProblem(formData)
      setMessage('Problem added successfully!')
      // Reset form or redirect could go here
    } catch (e) {
      console.error(e)
      setMessage('Failed to add problem.')
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4 p-4 border rounded bg-white shadow-sm">
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          name="title"
          type="text"
          required
          className="w-full border rounded p-2"
          placeholder="e.g. 2023 Exam 1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Problem File (Markdown)</label>
        <select name="problemFile" required className="w-full border rounded p-2">
          <option value="">Select a file...</option>
          {problemFiles.map(f => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Answer File (Markdown)</label>
        <select name="answerFile" required className="w-full border rounded p-2">
          <option value="">Select a file...</option>
          {answerFiles.map(f => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Audio File</label>
        <select name="audioFile" required className="w-full border rounded p-2">
          <option value="">Select a file...</option>
          {audioFiles.map(f => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Add Problem
      </button>

      {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
    </form>
  )
}
