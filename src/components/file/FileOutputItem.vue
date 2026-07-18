<script setup lang="ts">
import { useClipboard, useWebNotification } from "@vueuse/core";
import { snackbar } from "mdui";
import "mdui/components/card.js";
import "mdui/components/circular-progress.js";
import "mdui/components/list-item.js";
import "mdui/components/tooltip.js";
import { computed, ref, Teleport, watch } from "vue";
import { useI18n } from "vue-i18n";

import { Algorithms } from "@/interfaces/Algorithms";
import { NOTIFICATION_TAG } from "@/interfaces/constants";
import { FileStatus } from "@/interfaces/FileStatus";
import { Modes } from "@/interfaces/Modes";
import { useAutoCopyStore } from "@/stores/settings/autoCopy";
import { useSystemNotificationStore } from "@/stores/settings/systemNotification";
import { formatTime } from "@/utils/text.ts";

import FileDialog from "./FileDialog.vue";
import type { FileItem } from "./FileItem";

const props = defineProps<{ fileItem: FileItem }>();

const { t } = useI18n();
const isDialogOpen = ref<boolean>(false);
const isChecksumMatch = ref<boolean>(false);

const autoCopyStore = useAutoCopyStore();
const systemNotificationStore = useSystemNotificationStore();

const { copy, copied, isSupported: isClipboardSupported } = useClipboard();
const {
    isSupported: isNotifcationSupported,
    permissionGranted,
    show: showNotification,
} = useWebNotification();

const shouldShowCompare = computed(() => {
    return (
        props.fileItem.mode === Modes.Check &&
        props.fileItem.checkSum !== undefined &&
        props.fileItem.hash !== undefined
    );
});

const copyHash = () => {
    if (!isClipboardSupported.value) {
        snackbar({ message: t("clipboard.not-supported") });
        return;
    }
    if (props.fileItem.hash !== undefined) {
        copy(props.fileItem.hash);
        if (copied.value) {
            snackbar({ message: t("clipboard.copy-successful") });
        } else {
            snackbar({ message: t("clipboard.copy-failed") });
        }
    }
};

const estimatedTime = computed(() => {
    const { hours, minutes, seconds } = formatTime(props.fileItem.estimetedTime);

    if (hours > 0) {
        return t("time.hours-minutes-seconds", { hours, minutes, seconds });
    } else if (minutes > 0) {
        return t("time.minutes-seconds", { minutes, seconds });
    } else {
        return t("time.seconds", { seconds });
    }
});

const statusText = computed(() => {
    switch (props.fileItem.status) {
        case FileStatus.Waiting:
            return t("status.waiting");

        case FileStatus.Computing:
            return `${t("status.computing-estimated")}${estimatedTime.value}`;

        case FileStatus.Finished:
            return t("status.finish");

        case FileStatus.Error:
            return t("status.error");

        case FileStatus.Canceled:
            return t("status.canceled");

        default:
            return t("status.unknown");
    }
});

const modeText = computed(() => {
    switch (props.fileItem.mode) {
        case Modes.Check:
            return t("mode.check");
        case Modes.Generate:
            return t("mode.generate");
        case Modes.Unselected:
            return t("unselected");
    }
});

const algorithmText = computed(() =>
    props.fileItem.algorithm === Algorithms.Unselected ? t("unselected") : props.fileItem.algorithm
);

watch(
    () => props.fileItem.hash,
    () => {
        if (shouldShowCompare.value) {
            // showCompare 的值里已经计算了 hash 和 checkSum 一定不为空，因此下方使用非空断言
            isChecksumMatch.value =
                props.fileItem.hash!.trim().toLocaleLowerCase() ===
                props.fileItem.checkSum!.trim().toLowerCase();
        }
        if (autoCopyStore.enable) copyHash();
        if (systemNotificationStore.enable) {
            if (isNotifcationSupported.value && permissionGranted.value) {
                showNotification({
                    title: t("notification.hash-generated"),
                    dir: "auto",
                    lang: "zh",
                    renotify: true,
                    tag: NOTIFICATION_TAG,
                });
            } else {
                snackbar({
                    message: t("notification.not-supported"),
                });
            }
        }
    }
);
</script>

<template>
    <mdui-list-item
        :headline="fileItem.name"
        :description="statusText"
        @click="isDialogOpen = true"
    >
        <mdui-circular-progress
            :value="fileItem.progress"
            min="0"
            max="1"
            slot="end-icon"
        ></mdui-circular-progress>
    </mdui-list-item>

    <Teleport to="body">
        <FileDialog
            :fileName="fileItem.name"
            :fileMode="modeText"
            :fileAlgorithm="algorithmText"
            :fileStatus="statusText"
            :addTime="fileItem.addTime"
            :hash="fileItem.hash"
            :checkSum="fileItem.checkSum"
            :showCompare="shouldShowCompare"
            :isCheckSumMatch="isChecksumMatch"
            v-model="isDialogOpen"
            @copy-hash="copyHash()"
        />
    </Teleport>
</template>
