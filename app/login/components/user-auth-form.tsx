"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/app/components/shadn/icons"
import { createClient } from "@/app/utils/suppabase/server"
import { useContext, useRef, useState } from "react"

import { Session, User } from "@supabase/supabase-js"
import { cookies } from "@/app/page"


interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> { }

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
    const supabase = createClient()
    const [isLoading, setIsLoading] = React.useState<boolean>(false)

    const [email, setEmail] = useState<string>();
    const [pass, setPass] = useState<string>();

    const [user, setUser] = useState<User | null>();
    const [session, setSession] = useState<Session | null>();

    async function Login() {

        if (email && pass) {
            setIsLoading(true);

            console.log("ahoj");
            const { data } = await supabase.auth.signInWithPassword(
                {
                    email: email,
                    password: pass,

                }
            );

            console.log(data);


            setUser(data.user);
            setSession(data.session);

            setIsLoading(false);

            if (data.session) {
                cookies.set("user", data.user);
                window.location.href = '/dashboard';
            }
        }
    }


    return (
        <div className={cn("grid gap-6", className)} {...props}>
            <form onSubmit={(event) => { event.preventDefault(); Login(); }}>
                <div className="grid gap-2">
                    <div className="grid gap-1">

                        <Label className="sr-only" htmlFor="email">
                            Email
                        </Label>
                        <Input
                            id="email"
                            placeholder="name@example.com"
                            type="email"
                            value={email}
                            onInput={(e) => { setEmail(e.currentTarget.value) }}
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect="off"
                            disabled={isLoading}
                        />

                        <Label className="sr-only" htmlFor="password" >
                            Password
                        </Label>
                        <Input
                            onChange={(e) => { setPass(e.target.value) }}
                            value={pass}
                            id="password"
                            placeholder="password"
                            type="password"
                            autoCapitalize="none"
                            autoComplete="password"
                            autoCorrect="off"
                            disabled={isLoading}
                        />


                    </div>
                    <Button disabled={isLoading} onClick={() => { Login() }}>
                        {isLoading && (
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Log In with Email
                    </Button>
                </div>
            </form>
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                    </span>
                </div>
            </div>
            <Button variant="outline" type="button" disabled={isLoading}>
                {isLoading ? (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Icons.gitHub className="mr-2 h-4 w-4" />
                )}{" "}
                GitHub
            </Button>

            <>{user?.id}</>
            <>{session?.access_token}</>
        </div>
    )
}