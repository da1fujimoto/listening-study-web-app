import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function fixOrderValues() {
  console.log('Fetching all problems...')
  const problems = await prisma.problem.findMany({
    orderBy: { id: 'asc' },
  })

  console.log(`Found ${problems.length} problems`)
  
  for (let i = 0; i < problems.length; i++) {
    console.log(`Setting order ${i} for problem ${problems[i].id}: ${problems[i].title}`)
    await prisma.problem.update({
      where: { id: problems[i].id },
      data: { order: i },
    })
  }

  console.log('Done! Verifying...')
  const updated = await prisma.problem.findMany({
    orderBy: { order: 'asc' },
  })
  
  console.log('\nFinal order:')
  updated.forEach(p => {
    console.log(`  ${p.order}: ${p.title} (ID: ${p.id})`)
  })
  
  await prisma.$disconnect()
}

fixOrderValues().catch(console.error)
