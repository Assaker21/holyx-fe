import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import AuthLayout from "./layouts/auth.layout";
import MainLayout from "./layouts/main.layout";
import RootLayout from "./layouts/root.layout";
import CategoriesPage from "./pages/main/categories.page";
import UsersPage from "./pages/main/users.page";
import DevicesPage from "./pages/main/devices.page";
import ProvidersPage from "./pages/main/providers.page";
import LoginPage from "./pages/auth/login.page";
import { AuthProvider } from "./contexts/auth.context";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <AuthProvider>
              <RootLayout />
            </AuthProvider>
          }
        >
          <Route path="/" element={<MainLayout />}>
            <Route path="/" element={<Navigate to="/providers" />}></Route>
            <Route path="/categories" element={<CategoriesPage />}></Route>
            <Route path="/users" element={<UsersPage />}></Route>
            <Route path="/devices" element={<DevicesPage />}></Route>
            <Route path="/providers" element={<ProvidersPage />}></Route>
          </Route>
          <Route path="/auth" element={<AuthLayout />}>
            <Route index path="/auth/login" element={<LoginPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
