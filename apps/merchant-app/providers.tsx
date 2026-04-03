"use client"
import {RecoilRoot} from "recoil"
import {SessionProvider} from "next-auth/react"

export  const Providers = ({children}:{children:React.ReactNode})=>{
    return (
        // @ts-ignore - Recoil type definitions are incompatible with React 19 types
        <RecoilRoot>
            <SessionProvider>
                {children}
            </SessionProvider>
        </RecoilRoot>
    );
}