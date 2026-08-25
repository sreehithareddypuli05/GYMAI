import type { ReactNode } from 'react'
import { Navbar } from './Navbar'
import { MobileNav } from './MobileNav'

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-charcoal bg-grid-lines bg-[length:32px_32px]">
      <Navbar />
      <main className="px-5 pb-24 pt-24 lg:px-8 lg:pb-10 lg:pt-28">
        <div className="mx-auto w-full max-w-7xl">{children}</div>
      </main>
      <MobileNav />
    </div>
  )
}
