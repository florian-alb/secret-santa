"use client";

import { deleteParticipant } from "@/app/actions/participants";
import { useTransition } from "react";

export function DeleteButton({ id, name }: { id: string; name: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm(`Supprimer ${name} de la liste ?`)) return;

    startTransition(async () => {
      await deleteParticipant(id);
    });
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition disabled:opacity-50"
      title={`Supprimer ${name}`}
    >
      {isPending ? "..." : "🗑️"}
    </button>
  );
}

