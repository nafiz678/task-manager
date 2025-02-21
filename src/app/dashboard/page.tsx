/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { LayoutDashboard, UserCog, Settings, LogOut, PanelLeft } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import image from "../../../public/profile.jpg"
import { useRouter } from "next/navigation";
import { useAuth } from "@/auth/AuthContext";
import { Button } from "@/components/ui/button";
import Loader from "@/components/loader";

const sidebar = () => {

  const [open, setOpen] = useState<boolean>(false);
  const { user, loading, logout } = useAuth();
  const router = useRouter();

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
    {
      label: "Settings",
      href: "#",
      icon: (
        <Settings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];

  const animate = true

  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1  mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
        "h-screen"
      )}
    >
      <Sidebar open={open}>
        <SidebarBody className="justify-between gap-10 border">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <div className="rounded-md transition-all duration-300 ease-in-out flex items-end justify-end w-full">
              <span className="hover:bg-gray-200 p-[3px] rounded-md">
                <PanelLeft className="cursor-pointer " onClick={() => setOpen((prev) => !prev)} />
              </span>
            </div>
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}

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
          <div>
            <SidebarLink
              link={{
                label: user.displayName,
                href: "#",
                icon: (
                  <Image
                    src={user.photoURL}
                    className="h-7 w-7 flex-shrink-0 rounded-full"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <Dashboard />
    </div>
  );
}


// Dummy dashboard component with content
const Dashboard = () => {

  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) return <p>Loading...</p>;
  if (!user) {
    router.push("/auth/login");
    return null;
  }

  return (
    <div className="grid flex-1 grid-cols-12 justify-evenly items-center pl-6">
      {/* todo list box */}
      <div className="col-span-4 border h-screen">
        todo list box
      </div>
      {/* In Progress box */}
      <div className="col-span-4 border h-screen">
        In Progress box
      </div>
      {/* Done box */}
      <div className="col-span-4 border h-screen">
        Done box
      </div>
    </div>
  );
};

export default sidebar