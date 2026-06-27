<script setup lang="ts">
import { relaunch } from "@tauri-apps/plugin-process";
import { check } from "@tauri-apps/plugin-updater";
import { useFetch } from "@vueuse/core";
import MarkdownIt from "markdown-it";
import { snackbar } from "mdui";
import { lt } from "semver";
import { onUnmounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";

import { UPDATE_URL } from "@/interfaces/constants";
import { DownloadStatus } from "@/interfaces/DownloadingStatus";
import type { GitHubRelease } from "@/interfaces/GitHubRelease";
import { useAutoUpdateStore } from "@/stores/settings/autoUpdate";

import RichDialog from "../shared/RichDialog.vue";
import UpdateProgressDialog from "./UpdateProgressDialog.vue";

const { t } = useI18n();
const markdownIt = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
});

const autoUpdateStore = useAutoUpdateStore();

const isUpdateDialogOpen = ref<boolean>(false);
const isProgressDialogOpen = ref<boolean>(false);
const updateContentHtml = ref<string>("");
const currentVersion = VERSION_NAME;
const newVersion = ref<string>("");

const downloadStatus = ref<DownloadStatus>(DownloadStatus.Fetching);
const downloadProgress = ref<number | undefined>(undefined);

const { isFetching, error, data, abort, execute } = useFetch(UPDATE_URL, {
    immediate: false,
    timeout: 5000,
});

watch(
    () => autoUpdateStore.enable,
    (enabled) => {
        if (enabled) execute();
        else if (isFetching.value) abort();
    },
    { immediate: true }
);

watch(data, (responseData) => {
    if (!responseData || !autoUpdateStore.enable) return;
    const releaseData = JSON.parse(responseData as string) as GitHubRelease;
    const remoteVer = releaseData.name;
    newVersion.value = releaseData.name;
    if (lt(VERSION_NAME, remoteVer)) {
        console.log("检测到新版本");
        // TODO: 不要直接用字符串切割
        const bodyParts = releaseData.body.split("# 🚀 更新内容");
        if (bodyParts !== undefined && bodyParts[1] !== undefined) {
            const mainPart = bodyParts[1].split("# ⬇️ 下载");
            const text = mainPart[0] ?? "";
            updateContentHtml.value = markdownIt.render(text);
            isUpdateDialogOpen.value = true;
        }
    } else {
        console.log("当前版本已是最新");
        snackbar({ message: t("update-dialog.check-update.latest") });
    }
});

watch(error, (err) => {
    if (!err || !autoUpdateStore.enable) return;
    if (err.name !== "AbortError") {
        console.error(err);
        snackbar({ message: t("update-dialog.check-update.error", { error: err }) });
    }
});

const downloadUpdate = async () => {
    try {
        downloadStatus.value = DownloadStatus.Fetching;
        isProgressDialogOpen.value = true;

        const update = await check();
        if (update) {
            console.log(`Tauri Updater：发现更新 ${update.version}`);
            let downloaded = 0;
            let totalSize = 0;
            downloadStatus.value = DownloadStatus.Started;

            await update.downloadAndInstall((event) => {
                switch (event.event) {
                    case "Started":
                        if (event.data.contentLength) {
                            totalSize = event.data.contentLength;
                            console.log(`Tauri Updater：文件大小 ${totalSize} 字节`);
                        }
                        downloadStatus.value = DownloadStatus.Downloading;
                        break;
                    case "Progress":
                        downloaded += event.data.chunkLength;
                        downloadProgress.value = totalSize > 0 ? downloaded / totalSize : 0;
                        break;
                    case "Finished":
                        downloadStatus.value = DownloadStatus.Finished;
                        break;
                }
            });

            console.log("Tauri Updater：更新包下载完成");
            await relaunch();
        }
    } catch (error) {
        downloadStatus.value = DownloadStatus.Error;
        downloadProgress.value = 0;
        console.error("Tauri Updater：更新失败", error);
        snackbar({ message: t("update-dialog.failed", { error: error }) });
    }
};

onUnmounted(() => {
    if (isFetching.value) abort();
});
</script>

<template>
    <RichDialog
        :headline="t('update-dialog.headline', { version: newVersion })"
        :description="t('update-dialog.description', { version: currentVersion })"
        v-model="isUpdateDialogOpen"
        :close-on-overlay-click="false"
        @confirm="downloadUpdate()"
    >
        <div v-html="updateContentHtml"></div>
    </RichDialog>
    <UpdateProgressDialog
        :progress="downloadProgress"
        :status="downloadStatus"
        v-model="isProgressDialogOpen"
    />
</template>
