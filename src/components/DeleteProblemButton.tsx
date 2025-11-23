'use client'

import { deleteProblemAction } from '@/app/actions'

type Props = {
  id: number
}

export default function DeleteProblemButton({ id }: Props) {
  return (
    <form
      action={deleteProblemAction}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="text-red-500 hover:text-red-700 text-sm px-3 py-1 border border-red-200 rounded hover:bg-red-50 transition-colors"
      >
        Delete
      </button>
    </form>
  )
}
