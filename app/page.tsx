import { prisma } from '@/lib/prisma'
import RegistrationForm from './components/RegistrationForm'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const participants = await prisma.participant.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return (
    <main className="min-h-screen bg-green-900 text-white p-8 flex flex-col items-center font-sans">
      <div className="max-w-2xl w-full space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-bold text-red-600 bg-white inline-block px-8 py-4 rounded-full shadow-lg transform -rotate-2">
            Secret Santa 🎅
          </h1>
          <p className="text-xl font-light opacity-90">Inscrivez-vous et attendez la magie de Noël !</p>
        </div>

        <RegistrationForm />

        <div className="bg-white/20 p-8 rounded-xl backdrop-blur-md border border-white/10">
          <h2 className="text-3xl font-semibold mb-6 text-center">
            {participants.length} Participant{participants.length > 1 ? 's' : ''}
          </h2>
          
          {participants.length === 0 ? (
            <p className="text-center text-lg opacity-80 italic">La liste est vide... pour l'instant !</p>
          ) : (
            <div className="flex flex-wrap justify-center gap-3">
              {participants.map((p) => (
                <span key={p.id} className="bg-white text-green-900 px-4 py-2 rounded-full font-bold shadow-sm flex items-center gap-2">
                  👤 {p.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
