"use client"

import { cn } from '@/lib/utils'
import { LayoutDashboard, LogOut, Menu, UserCog, X } from 'lucide-react'
import { AnimatePresence } from 'motion/react'
import React, { useState } from 'react'
import { motion } from 'motion/react'
import Link from 'next/link'
import { Button } from './ui/button'
import { useAuth } from '@/auth/AuthContext'
import Image from 'next/image'
import { ModeToggle } from './ui/ThemeToggle'

const MobileMenu = () => {
    const [open, setOpen] = useState<boolean>(false)
    const { logout, user } = useAuth()
    const animate = true
    console.log(user?.displayName)
    return (
        <div
            className={cn(
                "h-10 px-4 py-4 inline-flex flex-row md:hidden items-center justify-between bg-neutral-100 dark:bg-neutral-800 "
            )}
        >
            <div className="flex justify-end z-20 w-full">
                <Menu
                    className="text-neutral-800 dark:text-neutral-200 cursor-pointer"
                    onClick={() => setOpen(!open)}
                />
            </div>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ x: "-100%", opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: "-100%", opacity: 0 }}
                        transition={{
                            duration: 0.3,
                            ease: "easeInOut",
                        }}
                        className={cn(
                            "fixed h-full w-2/3 inset-0 bg-white dark:bg-neutral-900 p-10 z-[100] flex flex-col justify-between",
                        )}
                    >
                        <div
                            className="absolute right-10 top-10 z-50 text-neutral-800 dark:text-neutral-200 cursor-pointer"
                            onClick={() => setOpen(false)}
                        >
                            <X />
                        </div>
                        <div>
                            <ul className=' flex flex-col transition-all duration-300 ease-in-out'>

                                {/* dashboard menu */}
                                <div className='inline-flex py-2 gap-2 group/sidebar'>
                                    <LayoutDashboard className="text-neutral-700 !size-5 dark:text-neutral-200 flex-shrink-0" />
                                    <Link className='text-sm text-[#404040]' href={"/dashboard"}>
                                        <motion.span
                                            animate={{
                                                display: animate ? (open ? "inline-block" : "none") : "inline-block",
                                                opacity: animate ? (open ? 1 : 0) : 1,
                                            }}
                                            className="text-neutral-700 dark:text-neutral-200 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0 group-hover:translate-x-[5px]"
                                        >
                                            Dashboard
                                        </motion.span>
                                    </Link>
                                </div>

                                {/* profile link */}
                                <div className='inline-flex py-2 gap-2 group/sidebar'>
                                    <UserCog className="text-neutral-700 !size-5 dark:text-neutral-200 flex-shrink-0" />
                                    <Link className='text-sm text-[#404040]' href={"/profile"}>
                                        <motion.span
                                            animate={{
                                                display: animate ? (open ? "inline-block" : "none") : "inline-block",
                                                opacity: animate ? (open ? 1 : 0) : 1,
                                            }}
                                            className="text-neutral-700 dark:text-neutral-200 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0 group-hover:translate-x-[5px]"
                                        >
                                            Profile
                                        </motion.span>
                                    </Link>
                                </div>

                                {/* logout menu */}
                                <div className="flex items-center justify-start gap-2 group/sidebar py-2">
                                    <Button onClick={logout} className="p-0 m-0 hover:bg-transparent" variant={"ghost"}>
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

                                {/* profile and mode toggle */}
                                <div className="flex items-end h-[calc(100vh-180px)] justify-between">
                                    <Link
                                        href={"#"}
                                        className={cn(
                                            "flex items-center justify-start gap-2 group/sidebar py-2"
                                        )}
                                    >
                                        <Button size={"icon"} variant={"ghost"}>
                                            <Image
                                                src={`${user?.photoURL}`} className="h-7 w-7 flex-shrink-0 rounded-full"
                                                width={50}
                                                height={50}
                                                alt="Avatar" />
                                        </Button>
                                        <motion.span
                                            animate={{
                                                display: animate ? (open ? "inline-block" : "none") : "inline-block",
                                                opacity: animate ? (open ? 1 : 0) : 1,
                                            }}
                                            className="text-neutral-700 dark:text-neutral-200 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0"
                                        >
                                            {user?.displayName}
                                        </motion.span>
                                    </Link>
                                    <ModeToggle />
                                </div>
                            </ul>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default MobileMenu