import { getProblems } from '@/app/actions'
import Link from 'next/link'
import MemorizedCheckbox from '@/components/MemorizedCheckbox'

export default async function Home() {
  const problems = await getProblems() // Already sorted by order ASC
  
  // Filter out memorized problems for start button
  const activeProblems = problems.filter((p: any) => !p.isMemorized)
  const startId = activeProblems.length > 0 ? activeProblems[0].id : null

  return (
    <div className="max-w-md mx-auto p-4 min-h-screen flex flex-col">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Listening Practice</h1>
        <p className="text-gray-600 mt-2">High School Entrance Exam Prep</p>
      </header>

      <main className="flex-grow space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Link
            href={startId ? `/practice/seq/${startId}` : '#'}
            className={`block p-6 rounded-xl text-center transition-colors ${
              startId 
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <div className="text-2xl mb-2">顺序</div>
            <div className="text-sm opacity-90">Start Sequential</div>
          </Link>

          <Link
            href={startId ? `/practice/random/start` : '#'}
            className={`block p-6 rounded-xl text-center transition-colors ${
              startId 
                ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <div className="text-2xl mb-2">ランダム</div>
            <div className="text-sm opacity-90">Start Random</div>
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
            <h2 className="font-semibold text-gray-700">Problem List</h2>
            <Link href="/admin" className="text-xs text-blue-600 hover:underline">
              Manage
            </Link>
          </div>
          <div className="divide-y max-h-[400px] overflow-y-auto">
            {problems.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No problems added yet.</div>
            ) : (
              problems.map((p: any) => (
                <div key={p.id} className="p-4 hover:bg-gray-50 transition-colors flex justify-between items-center">
                  <Link
                    href={`/practice/seq/${p.id}`}
                    className="flex-1 flex justify-between items-center"
                  >
                    <span className={`text-gray-800 ${p.isMemorized ? 'line-through text-gray-400' : ''}`}>{p.title}</span>
                    <span className="text-gray-400 text-sm">#{p.id}</span>
                  </Link>
                  <div className="ml-4">
                    <MemorizedCheckbox id={p.id} isMemorized={p.isMemorized} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
      
      <footer className="mt-8 text-center text-xs text-gray-400">
        &copy; 2025 Listening Practice App
      </footer>
    </div>
  )
}
