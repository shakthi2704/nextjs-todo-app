import { getLists, getStats } from "@/actions/lists"
import { auth } from "@/lib/auth"
import { StatsCards } from "@/components/dashboard/StatsCards"
import { ListCard } from "@/components/lists/ListCard"
import { CreateListModal } from "@/components/lists/CreateListModal"

type ListItem = Awaited<ReturnType<typeof getLists>>[number]

export default async function DashboardPage() {
  const session = await auth()
  const [lists, stats] = await Promise.all([getLists(), getStats()])
  const firstName = session?.user?.name?.split(" ")[0] ?? "there"

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Hello, {firstName} 👋</h1>
        <p className="text-muted-foreground mt-1">
          Here&apos;s an overview of your tasks
        </p>
      </div>

      <StatsCards
        total={stats.total}
        completed={stats.completed}
        pending={stats.pending}
      />

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">My Lists</h2>
        <CreateListModal />
      </div>

      {lists.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground border rounded-lg">
          <p className="text-lg font-medium">No lists yet</p>
          <p className="text-sm mt-1">Create your first list to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {lists.map((list: ListItem) => (
            <ListCard key={list.id} list={list} />
          ))}
        </div>
      )}
    </div>
  )
} 