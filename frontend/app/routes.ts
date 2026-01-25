import { type RouteConfig, index } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    { path: "register", file: "routes/register.tsx"},
    { path: "login", file: "routes/login.tsx" },
    { path: "actions", file: "routes/action.tsx" },
    { path: "quizzes", file: "routes/quizzes.tsx" },
] satisfies RouteConfig;
