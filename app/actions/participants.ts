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

export async function updateParticipant(
  id: string,
  data: { name: string; email: string }
) {
  try {
    await prisma.participant.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
      },
    });
    revalidatePath("/admin/launch");
    return { success: true };
  } catch (error: unknown) {
    console.error("Erreur modification:", error);
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return { success: false, message: "Cet email est déjà utilisé." };
    }
    return { success: false, message: "Erreur lors de la modification." };
  }
}

