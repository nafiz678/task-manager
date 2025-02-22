"use client"

import { motion } from "motion/react";
import { LogIn } from "lucide-react";
import { toast } from "sonner"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod";
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Input
} from "@/components/ui/input"
import {
    PasswordInput
} from "@/components/ui/password-input"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { useAuth } from "@/auth/AuthContext";
import { UserCredential } from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { saveUser } from "@/app/(api)/utils";

const formSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});


export default function Login() {
    const { login, user, googleSignIn, setLoading } = useAuth()
    const router = useRouter()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            console.log(user)
            console.log(values)
            await login(values.email, values.password)
                .then(async (res: UserCredential) => {
                    console.log(res)
                    router.push("/dashboard");
                    toast.success("login Successful")
                })
                .catch((err: void) => {
                    toast.error(err.message)
                })

        } catch (error) {
            console.error("Form submission error", error);
            toast.error("Failed to submit the form. Please try again.");
        }
    }

    const handleGoogle = async () => {
        try {
            //User Registration using google
            const data = await googleSignIn()
            // save user info in db if the user is new
            await saveUser(data?.user)
            router.push("/dashboard");
            toast.success("Login Successful")
        } catch (err) {
            toast.error(err?.message)
        } finally {
            setLoading(false)
        }
    }


    return (
        <div className="flex items-center gap-6 justify-center min-h-screen w-screen p-4 overflow-hidden">

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md "
            >
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Login</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-3xl mx-auto py-4">

                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem className="!mt-5">
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter your email"

                                                    type="email"
                                                    {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem className="!mt-5">
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <PasswordInput placeholder="••••••••" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button className="w-full" type="submit">Login</Button>
                            </form>
                        </Form>
                        <div className="flex items-center gap-4">
                            <div className="flex-1 border-t border-neutral-300 dark:border-neutral-600"></div>
                            <p className="text-sm text-neutral-600 dark:text-neutral-300">
                                New here?{" "}
                                <Link href="/auth/register" className="text-black hover:underline">
                                    Sign up
                                </Link>
                            </p>
                            <div className="flex-1 border-t border-neutral-300 dark:border-neutral-600"></div>
                        </div>
                        <div className="flex justify-center mt-4">
                            <Button onClick={handleGoogle}
                                variant="outline"
                                className="flex items-center w-full gap-2"
                            >
                                <LogIn size={20} /> Sign in with Google
                            </Button>
                        </div>

                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
