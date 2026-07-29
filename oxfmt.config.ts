import { defineConfig } from "oxfmt";

export default defineConfig({
    semi: true,
    singleQuote: false,
    printWidth: 100,
    tabWidth: 4,
    singleAttributePerLine: false,
    sortPackageJson: true,
    sortImports: {
        partitionByComment: true,
    },
    ignorePatterns: [
        ".tauri/",
        "index.html",
        "pnpm-lock.yaml",
        "src/assets/gpl.svg",
        "README.md",
        "README_EN.md",
    ],
    trailingComma: "es5",
});
