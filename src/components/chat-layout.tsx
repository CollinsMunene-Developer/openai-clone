"use client"

import * as React from "react"
import { MessageSquare, Plus, Settings } from 'lucide-react'
import { cn } from "@/src/lib/utils"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
} from "@/src/components/ui/sidebar"
import { Button } from "@/src/components/ui/button"
import { ScrollArea } from "@/src/components/ui/scroll-area"

export function ChatLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true)

  return (
    <SidebarProvider defaultOpen={isSidebarOpen}>
      <div className="flex h-screen overflow-hidden">
        <Sidebar collapsible="icon">
          <SidebarHeader className="p-2">
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() => {
                // Handle new chat creation
              }}
            >
              <Plus className="h-4 w-4" />
              New chat
            </Button>
          </SidebarHeader>
          <SidebarContent>
            <ScrollArea className="h-[calc(100vh-8rem)]">
              {/* Chat history list */}
              <div className="space-y-2 p-2">
                {Array.from({ length: 10 }).map((_, i) => (
                  <Button
                    key={i}
                    variant="ghost"
                    className="w-full justify-start gap-2"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Chat {i + 1}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </SidebarContent>
          <SidebarFooter className="p-2">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </SidebarFooter>
        </Sidebar>
        <main className="flex flex-1 flex-col overflow-hidden">
          <header className="flex h-14 items-center border-b px-4 lg:h-[60px]">
            <SidebarTrigger />
            <div className="ml-2 font-semibold">ChatGPT Clone Version</div>
          </header>
          {children}
        </main>
      </div>
    </SidebarProvider>
  )
}

