"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";

import { NavMain } from "@/components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  IconDashboard,
  IconPhoneCall,
  IconCalendarEvent,
  IconUser,
  IconFolder,
  IconChecklist,
  IconUsers,
  IconBug,
  IconReportAnalytics,
} from "@tabler/icons-react";

const navdata = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: IconDashboard,
  },
  {
    title: "Contact",
    url: "/contact",
    icon: IconPhoneCall,
  },
  {
    title: "Meeting",
    url: "/meeting",
    icon: IconCalendarEvent,
  },
  {
    title: "Client",
    url: "/client",
    icon: IconUser,
  },
  {
    title: "Project",
    url: "/project",
    icon: IconFolder,
  },
  {
    title: "Task",
    url: "/task",
    icon: IconChecklist,
  },
  {
    title: "Team",
    url: "/team",
    icon: IconUsers,
  },
  {
    title: "Bug",
    url: "/bug",
    icon: IconBug,
  },
  {
    title: "Report",
    url: "/report",
    icon: IconReportAnalytics,
  },
];


export function AppSidebar({ ...props }) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          
                <div className="flex items-center space-x-2 ">
                  <Image
                    src="/logo.png" // make sure logo is optimized & inside public folder
                    alt="AAS BluePrint Logo"
                    width={50}
                    height={50}
                    className="rounded-sm"
                    priority
                    quality={90}
                  />
                  <span className="text-base font-semibold ">BluePrint</span>
                </div>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navdata} />
      </SidebarContent>
    </Sidebar>
  );
}


