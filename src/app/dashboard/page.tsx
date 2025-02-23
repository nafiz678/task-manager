/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { LayoutDashboard, UserCog, LogOut, PanelLeft, CalendarPlus } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useAuth } from "@/auth/AuthContext";
import { Button } from "@/components/ui/button";
import Loader from "@/components/loader";
import AddTask from "@/components/Add-task";
import { ModeToggle } from "@/components/ui/ThemeToggle";
import Dashboard from "@/components/Dashboard";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import MobileMenu from "@/components/MobileMenu";

export interface TaskProps {
  _id: string;
  title: string;
  description: string;
  category: "to-do" | "in-progress" | "done";
  timestamp?: string;
}

const sidebar = () => {

  const [dialogOpen, setDialogOpen] = useState(false);
  const [open, setOpen] = useState<boolean>(false);
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  // Fetch all tasks
  const { data: tasks = [], isLoading, refetch } = useQuery<TaskProps[]>({
    queryKey: ["tasks", user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const { data } = await axios.get(`/api/tasks/${user.email}`);
      return data;
    },
    enabled: !!user?.email,
  });


  if (loading) return <Loader />;
  if (!user) {
    router.push("/auth/login");
    return null;
  }



  const links = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: (
        <LayoutDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Profile",
      href: "/profile",
      icon: (
        <UserCog className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];



  const animate = true

  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-950 w-full flex-1  mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
        "h-screen"
      )}
    >
      <Sidebar open={open}>
        <SidebarBody className="justify-between gap-10 border">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <div className="rounded-md transition-all duration-300 ease-in-out flex items-end justify-end w-full">
              <span className="hover:bg-gray-200 dark:hover:bg-gray-800 p-[3px] rounded-md">
                <PanelLeft className="cursor-pointer " onClick={() => setOpen((prev) => !prev)} />
              </span>
            </div>
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}

              <div className="flex items-center justify-start gap-2 group/sidebar py-2">
                <Button className="p-0 m-0" variant={"ghost"} onClick={() => setDialogOpen(true)}>
                  <CalendarPlus className="text-neutral-700 !size-5 dark:text-neutral-200 " />
                  <motion.span
                    animate={{
                      display: animate ? (open ? "inline-block" : "none") : "inline-block",
                      opacity: animate ? (open ? 1 : 0) : 1,
                    }}
                    className="text-neutral-700 dark:text-neutral-200 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0 group-hover:translate-x-[5px]"
                  >
                    Add task
                  </motion.span>
                </Button>
              </div>
              {/* AddTask Dialog */}
              <AddTask refetch={refetch} open={dialogOpen} setOpen={setDialogOpen} />

              <div className="flex items-center justify-start gap-2 group/sidebar py-2">
                <Button onClick={logout} className="p-0 m-0" variant={"ghost"}>
                  <LogOut className="text-neutral-700 !size-5 dark:text-neutral-200 " />
                  <motion.span
                    animate={{
                      display: animate ? (open ? "inline-block" : "none") : "inline-block",
                      opacity: animate ? (open ? 1 : 0) : 1,
                    }}
                    className="text-neutral-700 dark:text-neutral-200 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0 group-hover:translate-x-[5px]"
                  >
                    Logout
                  </motion.span>
                </Button>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <SidebarLink
              link={{
                label: user.displayName,
                href: "#",
                icon: (
                  <Image
                    src={`${user.photoURL}`}
                    className="h-7 w-7 flex-shrink-0 rounded-full"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                ),
              }}
            />
            {open ? <ModeToggle /> : null}
          </div>
        </SidebarBody>

        {/* mobile menu */}
        <MobileMenu />
      </Sidebar>
      <Dashboard refetch={refetch} tasks={tasks} isLoading={isLoading} />
    </div>
  );
}




export default sidebar