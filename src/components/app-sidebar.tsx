"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Coffee,
  Command,
  DollarSign,
  Frame,
  GalleryVerticalEnd,
  Layers,
  LayoutDashboard,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  Users,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: LayoutDashboard,
      isActive: true,
      items: [
        {
          title: "View Dashboard",
          url: "/admin",
        },
      ],
    },
    {
      title: "Waiters",
      url: "/admin/waiters",
      icon: Users,
      isActive: false,
      items: [
        {
          title: "View All",
          url: "/admin/waiters",
        },
      ],
    },
    {
      title: "Tables",
      url: "/admin/tables",
      icon: Layers,
      isActive: false,
      items: [
        {
          title: "View All",
          url: "/admin/tables",
        },
      ],
    },
    {
      title: "Food & Drinks",
      url: "/admin/foods",
      icon: Coffee,
      isActive: false,
      items: [
        {
          title: "View All",
          url: "/admin/foods",
        },
      ],
    },
    {
      title: "Categories",
      url: "/admin/categories",
      icon: Layers,
      isActive: false,
      items: [
        {
          title: "View All",
          url: "/admin/categories",
        },
      ],
    },
    {
      title: "Finances",
      url: "/admin/finances",
      icon: DollarSign,
      isActive: false,
      items: [
        {
          title: "View Summary",
          url: "/admin/finances",
        },
      ],
    },
  ],
  // projects: [
  //   {
  //     name: "Design Engineering",
  //     url: "#",
  //     icon: Frame,
  //   },
  //   {
  //     name: "Sales & Marketing",
  //     url: "#",
  //     icon: PieChart,
  //   },
  //   {
  //     name: "Travel",
  //     url: "#",
  //     icon: Map,
  //   },
  // ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* {data.projects ? (
          <NavProjects projects={data.projects} />
        ):(
          <></>
        ) */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
