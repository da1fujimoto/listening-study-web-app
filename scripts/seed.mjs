import { PrismaClient } from '../src/generated/client/index.js'
const prisma = new PrismaClient()

async function main() {
  const problems = [
    {
      title: '2023 Exam 1',
      problemFile: 'test.md',
      answerFile: 'test.md',
      audioFile: 'test.mp3',
    },
    {
      title: '2023 Exam 2',
      problemFile: 'test.md',
      answerFile: 'test.md',
      audioFile: 'test.mp3',
    },
    {
      title: '2022 Exam 1',
      problemFile: 'test.md',
      answerFile: 'test.md',
      audioFile: 'test.mp3',
    },
  ]

  for (const p of problems) {
    await prisma.problem.create({
      data: p,
    })
  }
  console.log('Seeded 3 problems')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
