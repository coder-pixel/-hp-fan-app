import type { AppRoute } from "@/routes/routeMeta";
import Index from "@/pages/common/Index";
import AboutPage from "@/pages/common/AboutPage";
import QuizPlayPage from "@/pages/common/QuizPlayPage";
import QuizzesPage from "@/pages/common/QuizzesPage";
import ThisOrThatPage from "@/pages/common/ThisOrThatPage";
import LoginPage from "@/pages/public/LoginPage";
import DashboardPage from "@/pages/protected/user-module/DashboardPage";
import SavedPage from "@/pages/protected/user-module/SavedPage";
import SettingsPage from "@/pages/protected/user-module/SettingsPage";
import ProfilePage from "@/pages/protected/user-module/ProfilePage";

/**
 * Application route table — single place to register paths and access level.
 * Add new routes here; keep `path` aligned with your page components’ links.
 */
export const appRoutes: AppRoute[] = [
  // common
  { path: "/", component: Index, type: "common" },
  { path: "/about", component: AboutPage, type: "common" },
  { path: "/quiz/:id", component: QuizPlayPage, type: "common" },
  { path: "/quizzes", component: QuizzesPage, type: "common" },
  { path: "/this-or-that", component: ThisOrThatPage, type: "common" },

  // public
  { path: "/login", component: LoginPage, type: "public", guestOnly: true },

  // protected (user module)
  { path: "/dashboard", component: DashboardPage, type: "protected" },
  { path: "/saved", component: SavedPage, type: "protected" },
  { path: "/settings", component: SettingsPage, type: "protected" },
  { path: "/profile", component: ProfilePage, type: "protected" },
];

export function loadAppRoutes(): AppRoute[] {
  return appRoutes;
}
