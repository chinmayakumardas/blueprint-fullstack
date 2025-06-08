
// "use client"

// import {
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
// } from "@/components/ui/sidebar"
// import { useRouter } from "next/navigation"
// import clsx from "clsx";
// export function NavMain({ items }) {
//   const router = useRouter()

//   return (
//     <SidebarGroup>
//       <SidebarGroupContent className="flex flex-col gap-2">
//         <SidebarMenu>
//           {items.map((item) => (
//             <SidebarMenuItem key={item.title}>
//               <SidebarMenuButton className="cursor-pointer"
//                 active={item.active}
//                 tooltip={item.title}
//                 onClick={() => router.push(item.url)}
//               >
//                 {item.icon && <item.icon />}
//                 <span>{item.title}</span>
//               </SidebarMenuButton>
//             </SidebarMenuItem>
//           ))}
//         </SidebarMenu>
//       </SidebarGroupContent>
//     </SidebarGroup>
//   );
// }


"use client"

import { useRouter, usePathname } from "next/navigation"
import clsx from "clsx"

export function NavMain({ items }) {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <div className="space-y-2 px-2">
      {items.map((item) => {
        const isActive = pathname === item.url

        return (
          <div
            key={item.title}
            onClick={() => router.push(item.url)}
            title={item.title}
            className={clsx(
              "flex items-center gap-3 hover:bg-white hover:text-black  rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 cursor-pointer",
              {
                "bg-white text-black": isActive, // Active item
                
              }
            )}
          >
            {item.icon && <item.icon className="h-5 w-5" />}
            <span>{item.title}</span>
          </div>
        )
      })}
    </div>
  )
}
