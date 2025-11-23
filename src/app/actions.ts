'use server'

import fs from 'fs'
import path from 'path'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getFiles(type: 'problem' | 'answer' | 'sound') {
  const dir = path.join(process.cwd(), 'public', type)
  try {
    const files = await fs.promises.readdir(dir)
    return files.filter(file => !file.startsWith('.')) // Exclude hidden files
  } catch (error) {
    console.error(`Error reading directory ${type}:`, error)
    return []
  }
}

export async function getProblems() {
  return await prisma.problem.findMany({
    orderBy: { order: 'asc' },
  })
}

export async function createProblem(formData: FormData) {
  const title = formData.get('title') as string
  const problemFile = formData.get('problemFile') as string
  const answerFile = formData.get('answerFile') as string
  const audioFile = formData.get('audioFile') as string

  if (!title || !problemFile || !answerFile || !audioFile) {
    throw new Error('Missing required fields')
  }

  // Get the highest order value
  const maxOrderProblem = await prisma.problem.findFirst({
    orderBy: { order: 'desc' },
    select: { order: true },
  })

  const newOrder = (maxOrderProblem?.order ?? -1) + 1

  await prisma.problem.create({
    data: {
      title,
      problemFile,
      answerFile,
      audioFile,
      order: newOrder,
    },
  })

  revalidatePath('/')
  revalidatePath('/admin')
}

export async function getProblem(id: number) {
  return await prisma.problem.findUnique({
    where: { id },
  })
}

export async function deleteProblem(id: number) {
  console.log('Attempting to delete problem with ID:', id)
  try {
    const deleted = await prisma.problem.delete({
      where: { id },
    })
    console.log('Successfully deleted problem:', deleted)
    revalidatePath('/admin')
    revalidatePath('/')
  } catch (error) {
    console.error('Error deleting problem:', error)
    throw error
  }
}

export async function deleteProblemAction(formData: FormData) {
  const id = parseInt(formData.get('id') as string)
  if (isNaN(id)) {
    throw new Error('Invalid ID')
  }
  await deleteProblem(id)
}

export async function swapProblemOrder(id1: number, id2: number) {
  const [problem1, problem2] = await Promise.all([
    prisma.problem.findUnique({ where: { id: id1 } }),
    prisma.problem.findUnique({ where: { id: id2 } }),
  ])

  if (!problem1 || !problem2) {
    throw new Error('Problem not found')
  }

  // Swap order values
  await Promise.all([
    prisma.problem.update({
      where: { id: id1 },
      data: { order: problem2.order },
    }),
    prisma.problem.update({
      where: { id: id2 },
      data: { order: problem1.order },
    }),
  ])

  revalidatePath('/admin')
  revalidatePath('/')
}

export async function moveProblemUp(formData: FormData) {
  const id = parseInt(formData.get('id') as string)
  if (isNaN(id)) {
    throw new Error('Invalid ID')
  }

  const problems = await prisma.problem.findMany({
    orderBy: { order: 'asc' },
  })

  const currentIndex = problems.findIndex(p => p.id === id)
  if (currentIndex > 0) {
    await swapProblemOrder(problems[currentIndex].id, problems[currentIndex - 1].id)
  }
}

export async function moveProblemDown(formData: FormData) {
  const id = parseInt(formData.get('id') as string)
  if (isNaN(id)) {
    throw new Error('Invalid ID')
  }

  const problems = await prisma.problem.findMany({
    orderBy: { order: 'asc' },
  })

  const currentIndex = problems.findIndex((p: any) => p.id === id)
  if (currentIndex < problems.length - 1 && currentIndex !== -1) {
    await swapProblemOrder(problems[currentIndex].id, problems[currentIndex + 1].id)
  }
}

export async function toggleMemorized(id: number) {
  const problem = await prisma.problem.findUnique({
    where: { id },
  })

  if (!problem) {
    throw new Error('Problem not found')
  }

  await prisma.problem.update({
    where: { id },
    data: { isMemorized: !problem.isMemorized },
  })

  revalidatePath('/admin')
  revalidatePath('/')
  revalidatePath('/practice')
}

export async function toggleMemorizedAction(formData: FormData) {
  const id = parseInt(formData.get('id') as string)
  if (isNaN(id)) {
    throw new Error('Invalid ID')
  }
  await toggleMemorized(id)
}
