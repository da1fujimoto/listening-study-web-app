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
    orderBy: { createdAt: 'desc' },
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

  await prisma.problem.create({
    data: {
      title,
      problemFile,
      answerFile,
      audioFile,
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
