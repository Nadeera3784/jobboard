import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthLayout } from "../layouts/AuthLayout";
import { LoginPage } from "../pages/Auth/LoginPage";
import { HomePage } from "../pages/App/HomePage";
import { AppLayout } from "../layouts/AppLayout";
import { RegisterPage } from "../pages/Auth/RegisterPage";
import { ForgotPasswordPage } from "../pages/Auth/ForgotPasswordPage";
import { AdminLayout } from "../layouts/AdminLayout";
import { DashboardPage } from "../pages/Admin/DashboardPage";
import { CategoriesPage } from "../pages/Admin/Categories/CategoriesPage";
import { EditCategoryPage } from "../pages/Admin/Categories/EditCategoryPage";
import { LocationsPage } from "../pages/Admin/Locations/LocationsPage";
import { EditLocationPage } from "../pages/Admin/Locations/EditLocationPage";
import { UsersPage } from "../pages/Admin/Users/UsersPage";
import { EditUserPage } from "../pages/Admin/Users/EditUserPage";

import { TestPage } from "../pages/Admin/TestPage";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthLayout />}>
          <Route index element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
        </Route>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<HomePage />} />
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="categories/:id" element={<EditCategoryPage />}/>
          <Route path="locations" element={<LocationsPage />} />
          <Route path="locations/:id" element={<EditLocationPage />}/>
          <Route path="users" element={<UsersPage />} />
          <Route path="users/:id" element={<EditUserPage />}/>
          <Route path="test" element={<TestPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};