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

    // 4. Préparer les emails (Circulaire)
    const emails = shuffled.map((giver, index) => {
      const receiver = shuffled[(index + 1) % shuffled.length];

      return {
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
      };
    });

    // 5. Envoi des emails en batch (évite la limite de taux de 2 emails/seconde)
    const { data, error } = await resend.batch.send(emails);

    if (error) {
      console.error("Erreur envoi batch:", error);
      return {
        success: false,
        message: "Une erreur s'est produite lors de l'envoi des emails.",
      };
    }

    // Vérifier si certains emails ont échoué
    const failedEmails = data?.data?.filter((result) => "error" in result) ?? [];
    if (failedEmails.length > 0) {
      console.error("Certains emails ont échoué:", failedEmails);
      return {
        success: false,
        message: `${failedEmails.length} email(s) n'ont pas pu être envoyés.`,
      };
    }

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
