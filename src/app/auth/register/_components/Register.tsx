    "use client"

    import React, { useState } from "react";
    import { motion } from "motion/react";
    import { LogIn, UploadCloud } from "lucide-react";
    import { toast } from "sonner"
    import { useForm } from "react-hook-form";
    import { zodResolver } from "@hookform/resolvers/zod"
    import * as z from "zod";
    import { Button } from "@/components/ui/button"
    // import loginAnim from "../../public/registration.json"
    // import Lottie from "lottie-react";
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
    import Image from "next/image";
    import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
    import { useAuth } from "@/auth/AuthContext";
    import { imageUpload, saveUser } from "@/app/(api)/utils";
    import { UserCredential } from "firebase/auth";
    import { useRouter } from "next/navigation";
    import Link from "next/link";

    const formSchema = z.object({
        name: z.string(),
        email: z.string(),
        password: z.string()
    });

    export default function Register() {
        const [image, setImage] = useState<HTMLInputElement | null | string>(null);
        const [imageUrl, setImageUrl] = useState<string>("")
        const { register, updateUser, setUser, googleSignIn, setLoading } = useAuth()
        const router = useRouter()
        const form = useForm<z.infer<typeof formSchema>>({
            resolver: zodResolver(formSchema),
            defaultValues: {
                name: "",
                email: "",
                password: "",
            }
        })

        async function onSubmit(values: z.infer<typeof formSchema>) {
            try {
                if (!imageUrl) return toast.error("Wait for the image to load")
                await register(values.email, values.password)
                    .then(async (res: UserCredential) => {
                        console.log(res.user)
                        await updateUser(values.name, imageUrl)
                        const user = res.user
                        const newUser = { ...user, displayName: values.name, photoURL: imageUrl }
                        await saveUser({ ...res?.user, displayName: values.name, photoURL: imageUrl })
                        setUser(newUser)
                        router.push("/dashboard");
                        toast.success("Registration Successful")
                    })
                    .catch((err: void) => {
                        console.log(err)
                    })

            } catch (error) {
                console.error("Form submission error", error);
                toast.error("Failed to submit the form. Please try again.");
            }
        }

        const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) {
                const Image = await imageUpload(file)
                setImageUrl(Image)
                setImage(URL.createObjectURL(file));
                console.log(image)
            }
        };

        const handleGoogle = async () => {
            try {
                //User Registration using google
                const data = await googleSignIn()
                // save user info in db if the user is new
                await saveUser(data?.user)
                router.push("/dashboard");
                toast.success("Signup Successful")
            } catch (err) {
                console.log(err)
            } finally {
                setLoading(false)
            }
        }


        return (
            <div className="flex items-center gap-6 justify-center min-h-screen w-screen p-4 overflow-hidden">

                {/* <div className="md:w-1/2 p-6  flex items-center justify-center bg-black/5 rounded-lg dark:bg-white/10">
                    <Lottie animationData={loginAnim} loop={false}></Lottie>
                </div> */}

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md "
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Register</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-3xl mx-auto py-4">

                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Username</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter your name"

                                                        type="text"
                                                        {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

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

                                    <div>
                                        <label className="block text-sm">Profile Image</label>
                                        <label className="flex items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer mt-1 ">
                                            {image ? (
                                                <Image width={300} height={200} src={image} alt="Profile Preview" className="w-10/12 h-full object-cover rounded-lg" />
                                            ) : (
                                                <div className="flex flex-col items-center text-gray-500">
                                                    <UploadCloud size={24} />
                                                    <span className="text-sm">Upload Image</span>
                                                </div>
                                            )}
                                            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                        </label>
                                    </div>

                                    <Button className="w-full" type="submit">Submit</Button>
                                </form>
                            </Form>

                            <div className="flex items-center gap-4">
                                <div className="flex-1 border-t border-neutral-300 dark:border-neutral-600"></div>
                                <p className="text-sm text-neutral-600 dark:text-neutral-300">
                                    New here?{" "}
                                    <Link href="/auth/login" className="text-black hover:underline">
                                        Sign in
                                    </Link>
                                </p>
                                <div className="flex-1 border-t border-neutral-300 dark:border-neutral-600"></div>
                            </div>

                            <div className="flex justify-center mt-4">
                                <Button onClick={handleGoogle} variant="outline" className="flex items-center w-full gap-2">
                                    <LogIn size={20} /> Sign in with Google
                                </Button>
                            </div>

                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        );
    }
