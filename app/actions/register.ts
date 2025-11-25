'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function registerParticipant(formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string

  if (!name || !email) {
    return { success: false, message: 'Nom et email requis.' }
  }

  try {
    await prisma.participant.create({
      data: {
        name,
        email,
      },
    })
    revalidatePath('/')
    return { success: true, message: 'Inscription réussie !' }
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { success: false, message: 'Cet email est déjà inscrit.' }
    }
    return { success: false, message: "Une erreur s'est produite." }
  }
}

