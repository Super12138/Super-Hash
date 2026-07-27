<script setup lang="ts">
import "mdui/components/dialog.js";
import type { Dialog } from "mdui/components/dialog.js";
import "mdui/components/divider.js";
import { computed, useTemplateRef } from "vue";
import { useI18n } from "vue-i18n";

import CopyableCode from "@/components/shared/CopyableCode.vue";
import { OPEN_SOURCE_LIBRARIES } from "@/interfaces/constants";
import { Platform } from "@/interfaces/Platform";

const isDialogOpen = defineModel<boolean>({ required: true });
const dialogRef = useTemplateRef<Dialog>("dialog");

const { t } = useI18n();

const onClosed = () => {
    isDialogOpen.value = false;
};

const onConfirm = () => {
    if (dialogRef.value) {
        dialogRef.value.open = false;
    }
};

const version = computed(() => {
    return `${VERSION_NAME}-${VARIANT}-${COMMIT_HASH} (${VERSION_CODE})${Platform.isDesktopStore ? " [store]" : ""}`;
});

const buildTime = BUILD_TIME;
</script>

<template>
    <mdui-dialog
        :headline="t('settings.about.label')"
        :open="isDialogOpen"
        close-on-overlay-click="true"
        @closed.self="onClosed()"
        ref="dialog"
        style="text-align: center"
    >
        <img width="120px" height="120px" src="../../../assets/icon.webp" />
        <h2 style="margin-top: 10px; margin-bottom: 5px">Super Hash</h2>

        <p style="margin-top: 5px">
            {{ t("settings.about.dialog.version") }}
            <CopyableCode :code="version" />
            <br />
            {{ t("settings.about.dialog.build-time") }}
            <CopyableCode :code="buildTime" />
        </p>

        <p style="margin-top: 1.5rem">
            {{ t("settings.about.dialog.source-code.prefix") }}
            <a target="_blank" href="https://github.com/Super12138/Super-Hash/">GitHub</a>
            {{ t("settings.about.dialog.source-code.suffix") }}
            <br />
            {{ t("settings.about.dialog.author.prefix") }}
            <a target="_blank" href="https://github.com/Super12138/">Super12138</a>
            {{ t("settings.about.dialog.author.suffix") }}
        </p>
        <img width="35%" src="../../../assets/gpl.svg" />
        <p>{{ t("settings.about.dialog.licence") }}</p>

        <mdui-divider></mdui-divider>

        <p>
            {{ t("settings.about.dialog.open-source-libraries") }}
            <br />
            <template v-for="library in OPEN_SOURCE_LIBRARIES" :key="library.name">
                <a target="_blank" :href="library.url">{{ library.name }}</a>
                <br />
            </template>
        </p>
        <p>
            {{ t("settings.about.dialog.thanks") }}
            <br />
            <a target="_blank" href="https://icon.kitchen/">IconKitchen</a>
        </p>

        <mdui-button slot="action" variant="tonal" @click="onConfirm()">
            {{ t("confirm") }}
        </mdui-button>
    </mdui-dialog>
</template>
