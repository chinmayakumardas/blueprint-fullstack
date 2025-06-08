"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import NotificationsPopover from "./layout/notifications-popover";
import { logoutUser } from "@/store/features/authSlice";
import { fetchUserByEmail } from "@/store/features/userSlice";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { FiSearch, FiUser, FiLogOut } from "react-icons/fi";

export function SiteHeader() {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const { user, email } = useSelector((state) => state.auth) || {};
  const {
    userData,
    employeeData,
    loading: userLoading,
  } = useSelector((state) => state.user) || {};

  // Static test user data

  const recipientId = employeeData?.employeeID; // Fallback to a default ID if employeeData is not available

  // Use safe fallbacks
  const userInfo = userData || {};
  const employeeInfo = employeeData || {};

  // Fetch user data on component mount
  useEffect(() => {
    dispatch(fetchUserByEmail());
  }, [dispatch]);

  // Get page title from pathname
  const getPageTitle = () => {
    const path = pathname.split("/")[1];
    if (!path) return "Home";
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
    
        <div className="hidden md:block">
          <h1 className="text-base font-medium">{getPageTitle()}</h1>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <NotificationsPopover recipientId={recipientId} />

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src={userInfo.profilePicture}
                      alt={userInfo.fullName || "User"}
                    />
                    <AvatarFallback>
                      {userInfo.fullName?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src="/Avatar.png"
                      alt={userInfo.fullName || "User"}
                    />
                    <AvatarFallback>
                      {userInfo.fullName?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">
                      {userInfo.fullName || "Loading..."}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {employeeInfo.designation ||
                        userInfo.role ||
                        "Loading..."}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="px-4 py-2 text-sm text-muted-foreground">
                  <p>
                    <span className="font-semibold">Email: </span>
                    {userInfo.email || "Loading..."}
                  </p>
                  {employeeInfo.employeeID && (
                    <p>
                      <span className="font-semibold">Employee ID: </span>
                      {employeeInfo.employeeID}
                    </p>
                  )}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <a
                    href="/profiles"
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <FiUser className="h-4 w-4" />
                    <span>View Profile</span>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer"
                >
                  <FiLogOut className="h-4 w-4 mr-2" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
