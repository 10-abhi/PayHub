"use client"
import {RecoilRoot} from "recoil";
import {SessionProvider} from "next-auth/react"
export const Providers = ({children}:{children: React.ReactNode})=>{
    console.log("provider component rendered")
    return <RecoilRoot>
        <SessionProvider>
           {children}
        </SessionProvider>
    </RecoilRoot>
}