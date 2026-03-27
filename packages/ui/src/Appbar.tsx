import { Button } from "./button.tsx";

interface AppbarProps {
    user?: {
        name?: string | null;
    },
    onSignin: any,
    onSignout: any
}

export const Appbar = ({
    user,
    onSignin,
    onSignout
}: AppbarProps) => {
    return <div className="flex justify-between items-center px-6 py-4">
        <div className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">
            PayHub
        </div>
        <div className="flex items-center gap-4">
            {user && <span className="text-sm text-slate-400">Hey, {user.name || "User"}</span>}
            <Button onClick={user ? onSignout : onSignin}>{user ? "Logout" : "Login"}</Button>
        </div>
    </div>
}