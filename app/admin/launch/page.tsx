import { LaunchButton } from './LaunchButton'

export default async function AdminPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await props.searchParams;
  const secret = searchParams['secret']

  if (secret !== process.env.ADMIN_SECRET) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-red-500">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Accès Interdit ⛔</h1>
          <p className="text-gray-400">Vous n'avez pas le mot de passe magique.</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-lg w-full text-center space-y-6">
        <h1 className="text-3xl font-bold text-red-600">Zone Admin ⚠️</h1>
        <p className="text-gray-700">
          Vous êtes sur le point de lancer le tirage au sort.
        </p>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 text-left text-sm text-yellow-800">
          <p className="font-bold">Attention :</p>
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li>Les emails seront envoyés immédiatement.</li>
            <li>Aucune donnée ne sera sauvegardée (tirage éphémère).</li>
            <li>Cette action est irréversible.</li>
          </ul>
        </div>
        
        <LaunchButton />
      </div>
    </main>
  )
}

