import { getProblems } from '@/app/actions'
import { redirect } from 'next/navigation'

export default async function RandomStartPage() {
  const problems = await getProblems()
  
  if (problems.length === 0) {
    redirect('/')
  }

  const randomIndex = Math.floor(Math.random() * problems.length)
  const randomId = problems[randomIndex].id
  
  redirect(`/practice/random/${randomId}`)
}
