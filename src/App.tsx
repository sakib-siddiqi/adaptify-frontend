import { Navigate, Outlet, Route, Routes } from "react-router";
import "./tailwind.css";
import HomePage from "./pages/home";
import SignInPage from "./pages/auth/sign-in";
import SignUpPage from "./pages/auth/sign-up";
import { QueryClient, QueryClientProvider } from "react-query";
import AuthContextProvider from "./contexts/AuthContext";
import EmailConfirmationPage from "./pages/auth/email-confirm";

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<AuthContextProvider><Outlet /></AuthContextProvider>}>
          <Route index Component={HomePage} />
        </Route>
        <Route path="/auth">
          <Route index element={<Navigate to="/auth/sign-in" />} />
          <Route path="sign-in" Component={SignInPage} />
          <Route path="sign-up" Component={SignUpPage} />
          <Route path="email-verification" Component={EmailConfirmationPage} />
        </Route>
      </Routes>
    </QueryClientProvider>
  )
}

export default App
