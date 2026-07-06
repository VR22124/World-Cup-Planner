import { Sidebar } from "./sidebar"
import { Header } from "./header"

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}
