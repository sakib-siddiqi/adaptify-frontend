import supabase from "../../config/supabase";

const HomePage = () => {
    return (
        <div>
            Home
            <button onClick={()=>supabase.auth.signOut()} className="btn">
                Sign Out
            </button>
        </div>
    )
};

export default HomePage;
