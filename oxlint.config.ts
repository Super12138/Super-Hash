import { defineConfig } from "oxlint";

export default defineConfig({
    plugins: ["typescript", "unicorn", "oxc"],
    categories: {
        correctness: "warn",
    },
    rules: {},
    env: {
        builtin: true,
    },
});
