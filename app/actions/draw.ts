"use server";

import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function launchDraw() {
  try {
    // 1. Charger les participants
    const participants = await prisma.participant.findMany();

    // 2. Vérification
    if (participants.length < 3) {
      return {
        success: false,
        message: "Il faut au moins 3 participants pour faire un tirage.",
      };
    }

    // 3. Fisher-Yates Shuffle
    const shuffled = [...participants];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // 4. Envoi des emails (Circulaire)
    const emailPromises = shuffled.map((giver, index) => {
      const receiver = shuffled[(index + 1) % shuffled.length];

      return resend.emails.send({
        from: "Secret Santa <contact@maketo.fr>", // À configurer avec un domaine vérifié
        to: giver.email,
        subject: "🎅 Ton tirage Secret Santa !",
        html: `
          <div style="font-family: sans-serif; text-align: center; padding: 20px;">
            <h1>Salut ${giver.name} ! 🎄</h1>
            <p style="font-size: 18px;">Ta mission, si tu l'acceptes : offrir un cadeau à :</p>
            <h2 style="color: #d32f2f; font-size: 24px;">🎁 ${receiver.name} 🎁</h2>
            <p>Chut, c'est un secret ! 🤫</p>
          </div>
        `,
      });
    });

    await Promise.all(emailPromises);

    return {
      success: true,
      message: "Tirage effectué et emails envoyés avec succès !",
    };
  } catch (error) {
    console.error("Erreur tirage:", error);
    return {
      success: false,
      message: "Une erreur s'est produite lors du tirage.",
    };
  }
}
