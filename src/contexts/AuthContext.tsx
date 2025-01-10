import { createContext, ReactNode, useEffect, useState } from "react";
import supabase from "../config/supabase";
import { User } from "@supabase/supabase-js";
import { useNavigate } from "react-router";

const AuthContext = createContext<{ user?: User | null }>({
});
type Props = {
    children: ReactNode
}
export default function AuthContextProvider(porps: Props) {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();
    useEffect(() => {
        supabase.auth.onAuthStateChange((event, session) => {
            console.log({ event, session })
            if (!session?.user?.id) return navigate('/auth', { replace: true })
            setUser(session?.user || null);
            setLoading(false);
        });
    }, []);
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