"use client";

import { launchDraw } from "@/app/actions/draw";
import { useState } from "react";

export function LaunchButton() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleLaunch = async () => {
    if (
      !confirm(
        "Êtes-vous sûr de vouloir lancer le tirage ? C'est parti pour de bon !"
      )
    )
      return;

    setLoading(true);
    try {
      const result = await launchDraw();
      setStatus(result);
    } catch (e) {
      setStatus({ success: false, message: `Erreur inattendue. ${e}` });
    } finally {
      setLoading(false);
    }
  };

  if (status?.success) {
    return (
      <div className="p-4 bg-green-100 text-green-800 rounded-lg animate-pulse">
        <h3 className="font-bold text-xl">Succès ! 🎉</h3>
        <p>{status.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {status && !status.success && (
        <div className="p-3 bg-red-100 text-red-800 rounded-lg text-sm">
          {status.message}
        </div>
      )}
      <button
        onClick={handleLaunch}
        disabled={loading}
        className="w-full bg-red-600 text-white text-xl font-bold py-4 px-8 rounded-lg hover:bg-red-700 transition transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
      >
        {loading ? "Lancement en cours..." : "LANCER LE TIRAGE 🚀"}
      </button>
    </div>
  );
}
