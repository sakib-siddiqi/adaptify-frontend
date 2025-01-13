import { createContext, ReactNode, useEffect, useState } from "react";
import supabase from "../config/supabase";
import { User } from "@supabase/supabase-js";
import { useLocation, useNavigate } from "react-router";

export const AuthContext = createContext<{ user?: User | null }>({
});

type Props = {
    children: ReactNode
}
export default function AuthContextProvider(porps: Props) {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();
    const { pathname } = useLocation()
    useEffect(() => {
        supabase.auth.onAuthStateChange((_, session) => {
            console.log(session?.user?.app_metadata)
            if (!session?.user?.id) return navigate('/auth', { replace: true })
            setUser(session?.user || null);
            setLoading(false);
        });
    }, []);
    useEffect(() => {
        if(['/profile'].includes(pathname)) return;
        supabase.auth.getUser().then((value) => {
            if (value.data.user?.app_metadata?.role === 'ADMIN') {
                navigate('/admin', { replace: true })
            }
        })
    }, [pathname])
    if (loading) return (
        <div className="flex justify-center items-center">
            <div className="loader"></div>
        </div>
    )
    return (
        <AuthContext.Provider value={{ user: user }}>
            {porps.children}
        </AuthContext.Provider>
    )
}