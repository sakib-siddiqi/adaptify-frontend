import { Navigate, Outlet, Route, Routes } from "react-router";
import "./tailwind.css";
import HomePage from "./pages/home";
import SignInPage from "./pages/auth/sign-in";
import SignUpPage from "./pages/auth/sign-up";
import { QueryClient, QueryClientProvider } from "react-query";
import AuthContextProvider from "./contexts/AuthContext";
import EmailConfirmationPage from "./pages/auth/email-confirm";
import MainLayout from "./components/layouts/main";
import EditProfilePage from "./pages/profile/edit";
import ProfilePage from "./pages/profile";
import AdminLayout from "./components/layouts/admin";
import DocumentsPage from "./pages/admin/documents";
import AdminPayments from "./pages/admin/payments";

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<AuthContextProvider><MainLayout><Outlet /></MainLayout></AuthContextProvider>}>
          <Route index Component={HomePage} />
          <Route path="profile">
            <Route index Component={ProfilePage} />
            <Route path="edit" Component={EditProfilePage} />
          </Route>
        </Route>
        <Route path="/admin" element={<AuthContextProvider><AdminLayout><Outlet /></AdminLayout></AuthContextProvider>}>
          <Route index Component={AdminPayments} />
          <Route path="documents">
            <Route index Component={DocumentsPage} />
          </Route>
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
