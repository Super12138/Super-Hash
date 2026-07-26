<script setup lang="ts">
import "@mdui/icons/upload-file--outlined.js";
import { useDropZone, useFileDialog } from "@vueuse/core";
import "mdui/components/card.js";
import { Teleport } from "vue";
import { useI18n } from "vue-i18n";

import { useFileInfo } from "@/utils/file";

import FadeOutInTransition from "../shared/FadeOutInTransition.vue";
import DragTip from "./DragTip.vue";

const props = defineProps<{ file: File | null }>();
const emit = defineEmits<{ (e: "changed", file: File): void }>();

const { t } = useI18n();
const fileInfo = useFileInfo(() => props.file);

// 拖拽文件
const { isOverDropZone } = useDropZone(() => document.body, {
    onDrop: (files: File[] | null) => {
        if (files !== null) {
            emit("changed", files[0]);
        }
    },
    multiple: false,
});

// 文件选择器
const { open, reset, onChange } = useFileDialog({ multiple: false });
onChange((files: FileList | null) => {
    if (files !== null) {
        emit("changed", files[0]);
        reset();
    }
});
</script>

<template>
    <mdui-card variant="outlined" clickable @click="open">
        <mdui-icon-upload-file--outlined></mdui-icon-upload-file--outlined>
        <p class="file-choose-title">{{ t("choose-file.label") }}</p>
        <small>{{ t("choose-file.helper") }}</small>
        <p class="file-info">{{ fileInfo }}</p>
    </mdui-card>

    <Teleport to="body">
        <FadeOutInTransition>
            <DragTip v-if="isOverDropZone" />
        </FadeOutInTransition>
    </Teleport>
</template>

<style lang="css" scoped>
.file-info {
    margin-top: 0.3rem;
    color: rgb(var(--mdui-color-on-surface-variant));
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: center;
    width: 100%;
    line-height: var(--mdui-typescale-label-medium-line-height) !important;
    font-size: var(--mdui-typescale-label-medium-size) !important;
    letter-spacing: var(--mdui-typescale-label-medium-tracking) !important;
    font-weight: var(--mdui-typescale-label-medium-weight) !important;
}

.file-choose-title {
    line-height: var(--mdui-typescale-body-large-line-height) !important;
    font-size: var(--mdui-typescale-body-large-size) !important;
    letter-spacing: var(--mdui-typescale-body-large-tracking) !important;
    font-weight: var(--mdui-typescale-body-large-weight) !important;
}

small {
    color: rgb(var(--mdui-color-on-surface-variant));
}

p {
    margin: 0;
}

mdui-icon-upload-file--outlined {
    font-size: var(--mdui-typescale-headline-large-size);
    display: block;
    margin-bottom: 0.5rem;
}

mdui-card {
    width: auto;
    max-width: 400px;
    height: auto;
    max-height: 200px;
    user-select: none;
    padding: 1rem 2.5rem 1rem 2.5rem;
    margin: 1rem auto 0.5rem auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
}
</style>
