import { defineConfig } from "oxfmt";

export default defineConfig({
  semi: true,
  singleQuote: false,
  printWidth: 100,
  tabWidth: 2,
  singleAttributePerLine: false,
  sortPackageJson: true,
  sortImports: {
    partitionByComment: true,
  },
  trailingComma: "es5",
});
