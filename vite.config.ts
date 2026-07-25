import { exec } from "node:child_process";
import { rm } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath, URL } from "node:url";
import { promisify } from "node:util";

import vue from "@vitejs/plugin-vue";
import { defineConfig, Plugin, ResolvedConfig, UserConfig } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";
import { VitePWA } from "vite-plugin-pwa";
import vueDevTools from "vite-plugin-vue-devtools";

import packageJson from "./package.json";

const execPromise = promisify(exec);

const host = process.env.TAURI_DEV_HOST;

/**
 * 获取版本信息
 *
 * * 版本号：Git 提交计数
 * * 提交哈希：Git 短哈希
 *
 * @returns { versionCode: string, commitHash: string }
 */
const getVersionInfo = async () => {
    try {
        const { stdout: versionCode } = await execPromise("git rev-list --count HEAD");
        const { stdout: commitHash } = await execPromise("git rev-parse --short HEAD");
        return {
            versionCode: versionCode.trim(),
            commitHash: commitHash.trim(),
        };
    } catch (error) {
        console.error(`执行命令时发生错误: ${error}`);
        throw error;
    }
};

// https://vite.dev/config/
export default defineConfig(async ({ command, mode }) => {
    const { versionCode, commitHash } = await getVersionInfo();

    const baseConfig: UserConfig = {
        plugins: [
            vue({
                template: {
                    compilerOptions: {
                        // 所有以 mdui- 开头的标签名都是 mdui 组件
                        isCustomElement: (tag) => tag.startsWith("mdui-"),
                    },
                },
            }),
            vueDevTools(),
            createHtmlPlugin({
                minify: true,
            }),
            VitePWA({
                strategies: "injectManifest",
                srcDir: "src/pwa",
                filename: "sw.ts",
                registerType: "prompt",
                injectRegister: false,
                disable: mode === "desktop",

                pwaAssets: {
                    disabled: false,
                    config: true,
                },

                manifest: {
                    name: "Super Hash",
                    short_name: "Super Hash",
                    start_url: "/",
                    description: "一个快速、随时可用，且遵循 Material Design 3 的跨平台文件校验器",
                    lang: "zh",
                    theme_color: "#ffffff",
                    orientation: "any",
                    dir: "ltr",
                    categories: ["security"],
                    shortcuts: [
                        {
                            name: "Super Hash",
                            url: "index.html",
                            description: "Super Hash",
                        },
                    ],
                },

                injectManifest: {
                    globPatterns: ["**/*.{js,css,html,svg,png,ico}"],
                },

                devOptions: {
                    enabled: false,
                    navigateFallback: "index.html",
                    suppressWarnings: true,
                    type: "module",
                },
            }),
            IgnoreFilesPlugin("icon.png"),
        ],
        resolve: {
            alias: {
                "@": fileURLToPath(new URL("./src", import.meta.url)),
            },
        },
        build: {
            rolldownOptions: {
                output: {
                    manualChunks(id) {
                        if (id.includes("mdui")) {
                            return "mdui";
                        }
                        if (id.includes("vue")) {
                            return "vue";
                        }
                    },
                },
            },
        },
    };
    if (command === "serve") {
        return {
            ...baseConfig,
            // clearScreen: false,
            server: {
                port: 5173,
                strictPort: true,
                host: host || false,
                hmr: host
                    ? {
                          protocol: "ws",
                          host,
                          port: 1421,
                      }
                    : undefined,
                watch: {
                    ignored: ["**/src-tauri/**"],
                },
            },
            define: {
                VARIANT: JSON.stringify("web"),
                VERSION_NAME: JSON.stringify(packageJson.version),
                COMMIT_HASH: JSON.stringify(commitHash),
                VERSION_CODE: JSON.stringify(versionCode),
                BUILD_TIME: JSON.stringify(new Date().toISOString()),
            },
        };
    } else {
        const defaultVariable = {
            VERSION_NAME: JSON.stringify(packageJson.version),
            COMMIT_HASH: JSON.stringify(commitHash),
            VERSION_CODE: JSON.stringify(versionCode),
            BUILD_TIME: JSON.stringify(new Date().toISOString()),
        };

        switch (mode) {
            case "web":
                return {
                    ...baseConfig,
                    base: "/", // TODO: 后续评估是否要整合配置到baseConfig
                    define: {
                        VARIANT: JSON.stringify("web"),
                        ...defaultVariable,
                    },
                };
            case "desktop":
                return {
                    ...baseConfig,
                    base: "/",
                    define: {
                        VARIANT: JSON.stringify("desktop-default"),
                        ...defaultVariable,
                    },
                };
            case "store":
                return {
                    ...baseConfig,
                    base: "/",
                    define: {
                        VARIANT: JSON.stringify("desktop-store"),
                        ...defaultVariable,
                    },
                };
            default:
                return {
                    ...baseConfig,
                    base: "/",
                    define: {
                        VARIANT: JSON.stringify("web"),
                        ...defaultVariable,
                    },
                };
        }
    }
});

/**
 * Edit from: https://github.com/guangzan/vite-plugin-ignore-public/blob/main/src/index.ts
 * MIT License: https://github.com/guangzan/vite-plugin-ignore-public/blob/main/LICENSE
 *
 * @author guangzan
 * @author Super12138
 */
function IgnoreFilesPlugin(...files: string[]): Plugin {
    let config: ResolvedConfig;

    return {
        name: "vite-plugin-ignore-files",
        configResolved(_config) {
            config = _config;
        },
        // 不能使用buildEnd，因为buildEnd触发时还没有把构建产物写入到dist文件夹
        closeBundle() {
            for (const file of files) {
                rm(resolve(`${config.build.outDir}/${file}`), { recursive: true });
            }
        },
    };
}
