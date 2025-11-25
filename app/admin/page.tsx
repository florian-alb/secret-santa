import { LaunchButton } from "./LaunchButton";
import { DeleteButton } from "./DeleteButton";
import { EditButton } from "./EditButton";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const secret = searchParams["secret"];

  if (secret !== process.env.ADMIN_SECRET) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-red-500">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Accès Interdit ⛔</h1>
          <p className="text-gray-400">
            Vous n&apos;avez pas le mot de passe magique.
          </p>
        </div>
      </div>
    );
  }

  const participants = await prisma.participant.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-600">Zone Admin 🎅</h1>
          <p className="text-gray-600 mt-2">
            Gérez les participants et lancez le tirage
          </p>
        </div>

        {/* Participants List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-green-800 text-white px-6 py-4">
            <h2 className="text-xl font-semibold">
              📋 Liste des participants ({participants.length})
            </h2>
          </div>

          {participants.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p className="text-lg">
                Aucun participant inscrit pour le moment.
              </p>
              <p className="text-sm mt-2">
                Partagez le lien d&apos;inscription pour commencer !
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nom
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Inscrit le
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {participants.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">👤</span>
                          <span className="font-medium text-gray-900">
                            {p.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                        {p.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-sm">
                        {new Date(p.createdAt).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-2">
                          <EditButton
                            participant={{
                              id: p.id,
                              name: p.name,
                              email: p.email,
                            }}
                          />
                          <DeleteButton id={p.id} name={p.name} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Launch Section */}
        <div className="bg-white p-8 rounded-xl shadow-lg text-center space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">
            🚀 Lancer le tirage
          </h2>

          {participants.length < 3 ? (
            <div className="bg-orange-50 border border-orange-200 text-orange-700 p-4 rounded-lg">
              <p className="font-semibold">⚠️ Pas assez de participants</p>
              <p className="text-sm mt-1">
                Il faut au moins 3 participants pour effectuer un tirage.
                Actuellement : {participants.length}
              </p>
            </div>
          ) : (
            <>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 text-left text-sm text-yellow-800">
                <p className="font-bold">⚠️ Attention :</p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>
                    Les emails seront envoyés immédiatement aux{" "}
                    <strong>{participants.length}</strong> participants.
                  </li>
                  <li>Aucune donnée ne sera sauvegardée (tirage éphémère).</li>
                  <li>Cette action est irréversible.</li>
                </ul>
              </div>

              <LaunchButton />
            </>
          )}
        </div>
      </div>
    </main>
  );
}
