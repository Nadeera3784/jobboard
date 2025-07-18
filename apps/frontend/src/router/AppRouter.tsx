import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthLayout } from '../layouts/AuthLayout';
import { LoginPage } from '../pages/Auth/LoginPage';
import { HomePage } from '../pages/App/HomePage';
import { AppLayout } from '../layouts/AppLayout';
import { RegisterPage } from '../pages/Auth/RegisterPage';
import { ForgotPasswordPage } from '../pages/Auth/ForgotPasswordPage';
import { AdminLayout } from '../layouts/AdminLayout';
import { DashboardPage } from '../pages/Admin/DashboardPage';
import { CategoriesPage } from '../pages/Admin/Categories/CategoriesPage';
import { EditCategoryPage } from '../pages/Admin/Categories/EditCategoryPage';
import { LocationsPage } from '../pages/Admin/Locations/LocationsPage';
import { EditLocationPage } from '../pages/Admin/Locations/EditLocationPage';
import { UsersPage } from '../pages/Admin/Users/UsersPage';
import { EditUserPage } from '../pages/Admin/Users/EditUserPage';
import { SearchPage } from '../pages/App/SearchPage';
import { TestPage } from '../pages/Admin/TestPage';
import { SettingPage } from '../pages/Admin/SettingPage';
import { UserLayout } from '../layouts/UserLayout';
import { DashboardPage as UserDashboardPage } from '../pages/User/DashboardPage';
import { ApplicationPage as UserApplicationPage } from '../pages/User/ApplicationPage';
import { StatisticsPage as UserStatisticsPage } from '../pages/User/StatisticsPage';
import { SettingsPage as UserSettingsPage } from '../pages/User/SettingsPage';
import { CompanyLayout } from '../layouts/CompanyLayout';
import { DashboardPage as CompanyDashboardPage } from '../pages/Company/DashboardPage';
import { JobPage as CompanyJobPage } from '../pages/Company/Jobs/JobPage';
import { CreateJobPage as CompanyCreateJobPage } from '../pages/Company/Jobs/CreateJobPage';
import { EditJobPage as CompanyEditJobPage } from '../pages/Company/Jobs/EditJobPage';
import { JobApplicationsPage as CompanyJobApplicationsPage } from '../pages/Company/Jobs/JobApplicationsPage';
import { CompanySettingsPage } from '../pages/Company/SettingsPage';

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
          <Route path="search" element={<SearchPage />} />
        </Route>
        <Route path="/user" element={<UserLayout />}>
          <Route index element={<UserDashboardPage />} />
          <Route path="applications" element={<UserApplicationPage />} />
          <Route path="statistics" element={<UserStatisticsPage />} />
          <Route path="settings" element={<UserSettingsPage />} />
        </Route>
        <Route path="/company" element={<CompanyLayout />}>
          <Route index element={<CompanyDashboardPage />} />
          <Route path="jobs" element={<CompanyJobPage />} />
          <Route path="jobs/create" element={<CompanyCreateJobPage />} />
          <Route path="jobs/:id" element={<CompanyEditJobPage />} />
          <Route path="jobs/:id/applications" element={<CompanyJobApplicationsPage />} />
          <Route path="settings" element={<CompanySettingsPage />} />
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="categories/:id" element={<EditCategoryPage />} />
          <Route path="locations" element={<LocationsPage />} />
          <Route path="locations/:id" element={<EditLocationPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="users/:id" element={<EditUserPage />} />
          <Route path="settings" element={<SettingPage />} />
          <Route path="test" element={<TestPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
