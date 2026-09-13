import { defineConfig, minimal2023Preset } from "@vite-pwa/assets-generator/config";

export default defineConfig({
    headLinkOptions: {
        preset: "2023",
    },
    preset: {
        ...minimal2023Preset,
        png: {
            compressionLevel: 8,
            quality: 85,
        },
    },
    images: ["public/icon.png"], // 仅用于生成PWA图标，在构建时会自动删除它。请勿引用。
});
