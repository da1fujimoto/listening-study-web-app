'use client'

import { toggleMemorizedAction } from '@/app/actions'
import { useRouter } from 'next/navigation'
import { useState, useTransition, useEffect } from 'react'

type Props = {
  id: number
  isMemorized: boolean
}

export default function MemorizedCheckbox({ id, isMemorized }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [optimisticChecked, setOptimisticChecked] = useState(isMemorized)

  // Sync optimistic state with props when they change
  useEffect(() => {
    setOptimisticChecked(isMemorized)
  }, [isMemorized])

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newValue = e.target.checked
    setOptimisticChecked(newValue) // Optimistic update
    
    startTransition(async () => {
      const formData = new FormData()
      formData.append('id', id.toString())
      
      try {
        await toggleMemorizedAction(formData)
        router.refresh()
      } catch (error) {
        // Revert on error
        setOptimisticChecked(!newValue)
        console.error('Failed to toggle memorized:', error)
      }
    })
  }

  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={optimisticChecked}
        onChange={handleChange}
        disabled={isPending}
        className="w-4 h-4 text-green-600 rounded focus:ring-green-500 disabled:opacity-50"
      />
      <span className="text-sm text-gray-600">暗記済み</span>
    </label>
  )
}
