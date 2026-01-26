import { type RouteConfig, index } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    { path: "register", file: "routes/register.tsx"},
    { path: "login", file: "routes/login.tsx" },
    { path: "actions", file: "routes/action.tsx" },
    { path: "quizzes", file: "routes/quizzes.tsx" },
    { path: "quiz/:id", file: "routes/quiz.tsx" },
    { path: "attempt/:id", file: "routes/attempt.tsx" },
    { path: "history", file: "routes/history.tsx" },
    { path: "logout", file: "routes/logout.tsx" },
] satisfies RouteConfig;
