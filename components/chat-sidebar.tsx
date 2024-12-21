"use client"

import { Plus, MessageSquare, Settings, LogOut } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { ScrollArea } from "@/components/ui/scroll-area"

export function ChatSidebar() {
  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="p-2">
        <Button variant="outline" className="w-full justify-start">
          <Plus className="mr-2 h-4 w-4" />
          New chat
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <SidebarMenu>
            {[...Array(10)].map((_, index) => (
              <SidebarMenuItem key={index}>
                <SidebarMenuButton>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  <span className="flex-1 truncate">Chat {index + 1}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter className="p-2 space-y-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

