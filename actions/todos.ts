"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { Priority } from "@prisma/client"
import { z } from "zod"

async function getCurrentUserId(): Promise<string> {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")
  return session.user.id
}

async function verifyListOwnership(listId: string, userId: string) {
  const list = await prisma.list.findFirst({ where: { id: listId, userId } })
  if (!list) throw new Error("List not found or access denied")
  return list
}

const todoSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  priority: z.nativeEnum(Priority).default("MEDIUM"),
  dueDate: z.string().optional().nullable(),
})

export async function createTodo(
  listId: string,
  prevState: unknown,
  formData: FormData,
) {
  const userId = await getCurrentUserId()
  await verifyListOwnership(listId, userId)

  const parsed = todoSchema.safeParse({
    title: formData.get("title"),
    priority: formData.get("priority") || "MEDIUM",
    dueDate: formData.get("dueDate"),
  })

  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const { title, priority, dueDate } = parsed.data

  await prisma.todo.create({
    data: {
      title,
      priority,
      dueDate: dueDate ? new Date(dueDate) : null,
      listId,
    },
  })

  revalidatePath(`/lists/${listId}`)
  return { success: true }
}

export async function getTodos(listId: string) {
  const userId = await getCurrentUserId()
  await verifyListOwnership(listId, userId)

  return prisma.todo.findMany({
    where: { listId },
    orderBy: [
      { completed: "asc" },
      { priority: "desc" },
      { createdAt: "desc" },
    ],
  })
}

export async function toggleTodo(todoId: string, listId: string) {
  const userId = await getCurrentUserId()
  await verifyListOwnership(listId, userId)

  const todo = await prisma.todo.findFirst({ where: { id: todoId, listId } })
  if (!todo) return { error: "Todo not found", success: false }

  await prisma.todo.update({
    where: { id: todoId },
    data: { completed: !todo.completed },
  })

  revalidatePath(`/lists/${listId}`)
  return { success: true, error: null }
}

export async function deleteTodo(todoId: string, listId: string) {
  const userId = await getCurrentUserId()
  await verifyListOwnership(listId, userId)

  await prisma.todo.delete({ where: { id: todoId } })

  revalidatePath(`/lists/${listId}`)
  return { success: true, error: null }
}

export async function updateTodo(
  todoId: string,
  listId: string,
  prevState: unknown,
  formData: FormData,
) {
  const userId = await getCurrentUserId()
  await verifyListOwnership(listId, userId)

  const parsed = todoSchema.safeParse({
    title: formData.get("title"),
    priority: formData.get("priority") || "MEDIUM",
    dueDate: formData.get("dueDate"),
  })

  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const { title, priority, dueDate } = parsed.data

  await prisma.todo.update({
    where: { id: todoId },
    data: {
      title,
      priority,
      dueDate: dueDate ? new Date(dueDate) : null,
    },
  })

  revalidatePath(`/lists/${listId}`)
  return { success: true, error: null }
}
