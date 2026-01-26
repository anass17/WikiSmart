import { type RouteConfig, index, route  } from "@react-router/dev/routes";
import PageLayout from "./layout/PageLayout";

export default [
    index("routes/home.tsx"),

    route("", "layout/AuthLayout.tsx", [
        route("register", "routes/auth/register.tsx"),
        route("login", "routes/auth/login.tsx"),
        route("logout", "routes/auth/logout.tsx"),
    ]),

    route("", "layout/PageLayout.tsx", [

        route("ingest", "routes/action/ingest.tsx"),
        route("history", "routes/action/history.tsx"),


        route("quizzes", "routes/quiz/quizzes.tsx"),
        route("quiz/:id", "routes/quiz/quiz.tsx"),
        route("attempt/:id", "routes/quiz/attempt.tsx"),


        route("user/dashboard", "routes/dashboard/user_dashboard.tsx"),
        route("dashboard", "routes/dashboard/admin_dashboard.tsx")
    ])

] satisfies RouteConfig;
