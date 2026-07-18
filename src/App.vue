<script setup lang="ts">
/*
    顺序：
    导入
        MDUI 组件
        MDUI 图标
        自定义组件
        Vue 导入
        自定义函数导入
    代码
        事件绑定以及 Props
        自己写的代码
        生命周期钩子
*/

import { useWebWorker } from "@vueuse/core";
import { setColorScheme } from "mdui";
import "mdui/components/layout-main.js";
import "mdui/components/layout.js";
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";

import FileOutputDrawer from "./components/file/FileOutputDrawer.vue";
import AlgorithmDropdown from "./components/main/AlgorithmSelect.vue";
import CheckButton from "./components/main/CheckButton.vue";
import CheckSumInput from "./components/main/CheckSumInput.vue";
import FileSelector from "./components/main/FileSelector.vue";
import HashTopBar from "./components/main/HashTopBar.vue";
import ModeDropdown from "./components/main/ModeSelect.vue";
import SettingsDrawer from "./components/settings/SettingsDrawer.vue";
import PWABadage from "./components/shared/PWABadage.vue";
import SimpleDialog from "./components/shared/SimpleDialog.vue";
import UpdateDialog from "./components/update/UpdateDialog.vue";
import { useFileList } from "./composables/useFileList.ts";
import { Algorithms } from "./interfaces/Algorithms";
import { Modes, toMode } from "./interfaces/Modes";
import { Platform } from "./interfaces/Platform.ts";
import type { MainPostData, ProgressInfo, WorkerPostData } from "./interfaces/WorkerMessage";
import { WorkerResult } from "./interfaces/WorkerResults";
import { useCacheSizeStore } from "./stores/settings/cacheSize";
import { useThemeColorStore } from "./stores/settings/themeColor";
import { useFileConfigurationStore } from "./stores/ui/file-configuration";

const {
    fileList,
    addFile,
    getCurrentFile,
    setCurrentFileStartCompute,
    updateProgress,
    finishCompute,
} = useFileList();
const openTipDialog = ref(false);
const tipString = ref("");

const { t } = useI18n();

// Web Worker
const fileWorker = new Worker(new URL("worker/FileWorker.ts", import.meta.url), { type: "module" });
const { data: workerData, post, terminate } = useWebWorker(fileWorker);

// 各种 Store
const fileConfig = useFileConfigurationStore();
const themeColor = useThemeColorStore();
const cacheSize = useCacheSizeStore();

const openFileOutputDrawer = ref(false);
const openSettingsDrawer = ref(false);

const enablePWA = Platform.isWeb || Platform.isDev;
const enableUpdateDialog = Platform.isDesktopDefault || Platform.isDev;

const isCheckMode = computed(() => fileConfig.mode === Modes.Check);

const toggleFileDrawer = () => {
    openFileOutputDrawer.value = !openFileOutputDrawer.value;
    if (openSettingsDrawer.value) {
        openSettingsDrawer.value = false;
    }
};

const toggleSettingsDrawer = () => {
    openSettingsDrawer.value = !openSettingsDrawer.value;
    if (openFileOutputDrawer.value) {
        openFileOutputDrawer.value = false;
    }
};

const openOnlyFileDrawer = () => {
    openFileOutputDrawer.value = true;
    if (openSettingsDrawer.value) {
        openSettingsDrawer.value = false;
    }
};

const processFile = (file: File) => {
    addFile(file);
    fileConfig.setFile(file);
};

const calculateHash = () => {
    if (!fileConfig.hasFile) {
        tipString.value = t("errors.no-file");
        openTipDialog.value = true;
        return;
    }
    if (!fileConfig.isAlgorithmValid) {
        tipString.value = t("errors.no-algorithm");
        openTipDialog.value = true;
        return;
    }
    if (!fileConfig.isModeValid) {
        tipString.value = t("errors.no-mode");
        openTipDialog.value = true;
        return;
    }
    if (isCheckMode.value) {
        if (!fileConfig.isCheckSumValid) {
            tipString.value = t("errors.no-checksum");
            openTipDialog.value = true;
            return;
        }
    }

    if (!getCurrentFile()) return;
    setCurrentFileStartCompute(fileConfig.algorithm, fileConfig.mode, fileConfig.checkSum);

    openOnlyFileDrawer();

    const msg: MainPostData = {
        file: fileConfig.file!,
        algorithm: fileConfig.algorithm,
        chunkSize: cacheSize.size,
    };

    post(msg);

    fileConfig.$reset();
};

watch(workerData, (workerResult: WorkerPostData) => {
    //if (!workerResult) return;
    switch (workerResult.type) {
        case WorkerResult.Progress:
            const data = workerResult.data as ProgressInfo;
            updateProgress(data.progress, data.estimatedRemainingTime);
            break;

        case WorkerResult.Result:
            finishCompute(workerResult.data.toString());
            break;

        default:
            break;
    }
});

themeColor.$subscribe(
    (mutation, state) => {
        setColorScheme(state.color);
    },
    { immediate: true }
);

onMounted(() => {
    document.body.classList.add("ready");
});

onUnmounted(() => {
    terminate();
});
</script>

<template>
    <mdui-layout>
        <nav>
            <HashTopBar
                @toggle-output="toggleFileDrawer()"
                @toggle-settings="toggleSettingsDrawer()"
            />
        </nav>

        <mdui-layout-main class="container">
            <main>
                <FileSelector :file="fileConfig.file" @changed="processFile" />
                <div class="options-container">
                    <AlgorithmDropdown
                        :value="fileConfig.algorithm"
                        @change="
                            (value: Algorithms) => {
                                fileConfig.setAlgorithm(value);
                            }
                        "
                    />
                    <ModeDropdown
                        :value="fileConfig.mode"
                        @change="
                            (value: Modes) => {
                                fileConfig.setMode(value);
                            }
                        "
                    />
                </div>
                <CheckSumInput
                    :value="fileConfig.checkSum"
                    :enabled="isCheckMode"
                    @input="
                        (value: string) => {
                            fileConfig.setCheckSum(value);
                        }
                    "
                />
                <CheckButton @click="calculateHash()" />
            </main>
        </mdui-layout-main>
    </mdui-layout>
    <aside>
        <FileOutputDrawer :file-list="fileList" v-model="openFileOutputDrawer" />
    </aside>
    <aside>
        <SettingsDrawer v-model="openSettingsDrawer" />
    </aside>

    <SimpleDialog
        v-model="openTipDialog"
        :headline="t('error')"
        :description="tipString"
        :enable-cancel-button="false"
        :close-on-overlay-click="true"
    />

    <PWABadage v-if="enablePWA" />
    <UpdateDialog v-if="enableUpdateDialog" />
</template>

<style lang="css">
mdui-layout {
    height: 100vh;
}

/* 网格布局 */
.container {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    margin-right: auto;
    margin-left: auto;
    padding-right: 8px;
    padding-left: 8px;
}

.container::after {
    display: table;
    clear: both;
    content: "";
}

.container {
    width: 90%;
    padding-left: 5% !important;
    padding-right: 5% !important;
}

@media (min-width: 600px) {
    .container {
        width: 94%;
        padding-left: 3% !important;
        padding-right: 3% !important;
    }
}

.options-container {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    margin-bottom: 1rem;
    margin-top: 2rem;
}

@media (max-width: 500px) {
    .options-container {
        flex-direction: column;
        /* gap: 10px; */
    }
}
</style>
