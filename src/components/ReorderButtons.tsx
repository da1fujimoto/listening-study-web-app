'use client'

import { moveProblemUp, moveProblemDown } from '@/app/actions'
import { useRouter } from 'next/navigation'

type Props = {
  id: number
  isFirst: boolean
  isLast: boolean
}

export default function ReorderButtons({ id, isFirst, isLast }: Props) {
  const router = useRouter()

  async function handleMoveUp(formData: FormData) {
    await moveProblemUp(formData)
    router.refresh()
  }

  async function handleMoveDown(formData: FormData) {
    await moveProblemDown(formData)
    router.refresh()
  }

  return (
    <div className="flex flex-col gap-1">
      <form action={handleMoveUp}>
        <input type="hidden" name="id" value={id} />
        <button
          type="submit"
          disabled={isFirst}
          className="text-gray-600 hover:text-blue-600 disabled:text-gray-300 disabled:cursor-not-allowed p-1"
          title="Move up"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      </form>
      <form action={handleMoveDown}>
        <input type="hidden" name="id" value={id} />
        <button
          type="submit"
          disabled={isLast}
          className="text-gray-600 hover:text-blue-600 disabled:text-gray-300 disabled:cursor-not-allowed p-1"
          title="Move down"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </form>
    </div>
  )
}
