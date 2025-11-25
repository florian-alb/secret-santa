"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteParticipant(id: string) {
  try {
    await prisma.participant.delete({
      where: { id },
    });
    revalidatePath("/admin/launch");
    return { success: true };
  } catch (error) {
    console.error("Erreur suppression:", error);
    return { success: false, message: "Erreur lors de la suppression." };
  }
}

