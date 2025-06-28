import { BrowserRouter, Route, Routes } from "react-router";
import AuthLayout from "./layouts/auth.layout";
import MainLayout from "./layouts/main.layout";
import RootLayout from "./layouts/root.layout";
import CategoriesPage from "./pages/main/categories.page";
import UsersPage from "./pages/main/users.page";
import DevicesPage from "./pages/main/devices.page";
import ProvidersPage from "./pages/main/providers.page";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route path="/" element={<MainLayout />}>
            <Route path="/categories" element={<CategoriesPage />}></Route>
            <Route path="/users" element={<UsersPage />}></Route>
            <Route path="/devices" element={<DevicesPage />}></Route>
            <Route path="/providers" element={<ProvidersPage />}></Route>
          </Route>
          <Route path="/auth" element={<AuthLayout />}>
            <Route index path="login" element={"login"} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
