"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { z } from "zod"

async function getCurrentUserId(): Promise<string> {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")
  return session.user.id
}

const listSchema = z.object({
  name: z.string().min(1, "Name is required").max(50),
})

export async function createList(prevState: unknown, formData: FormData) {
  const userId = await getCurrentUserId()
  const parsed = listSchema.safeParse({ name: formData.get("name") })
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  await prisma.list.create({
    data: { name: parsed.data.name, userId },
  })

  revalidatePath("/dashboard")
  return { success: true }
}

export async function getLists() {
  const userId = await getCurrentUserId()

  return prisma.list.findMany({
    where: { userId },
    include: {
      _count: { select: { todos: true } },
      todos: { select: { completed: true } },
    },
    orderBy: { createdAt: "desc" },
  })
}

export async function getStats() {
  const userId = await getCurrentUserId()

  const lists = await prisma.list.findMany({
    where: { userId },
    include: { todos: { select: { completed: true } } },
  })

  const total = lists.reduce((acc, l) => acc + l.todos.length, 0)
  const completed = lists.reduce(
    (acc, l) => acc + l.todos.filter((t) => t.completed).length,
    0,
  )
  const pending = total - completed

  return { total, completed, pending }
}

export async function deleteList(listId: string) {
  const userId = await getCurrentUserId()
  const list = await prisma.list.findFirst({ where: { id: listId, userId } })
  if (!list) return { error: "List not found" }

  await prisma.list.delete({ where: { id: listId } })
  revalidatePath("/dashboard")
  return { success: true }
}

export async function updateList(
  listId: string,
  prevState: unknown,
  formData: FormData,
) {
  const userId = await getCurrentUserId()

  const parsed = listSchema.safeParse({ name: formData.get("name") })
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const list = await prisma.list.findFirst({ where: { id: listId, userId } })
  if (!list) return { error: "List not found" }

  await prisma.list.update({
    where: { id: listId },
    data: { name: parsed.data.name },
  })

  revalidatePath("/dashboard")
  return { success: true, error: null }
}
