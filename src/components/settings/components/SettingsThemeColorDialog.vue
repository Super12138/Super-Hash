<script setup lang="ts">
import { watchDebounced } from "@vueuse/core";
import { setColorScheme } from "mdui";
import "mdui/components/dialog.js";
import type { Dialog } from "mdui/components/dialog.js";
import { ref, useTemplateRef } from "vue";
import { useI18n } from "vue-i18n";

import { useThemeColorStore } from "@/stores/settings/themeColor";

const { t } = useI18n();
const isOpen = defineModel<boolean>({ required: true });
const dialogRef = useTemplateRef<Dialog>("dialog");
const themeColorStore = useThemeColorStore();

const inputColor = ref<string>(themeColorStore.color);

const onClosed = () => {
    isOpen.value = false;
};

const onConfirm = () => {
    if (dialogRef.value) {
        dialogRef.value.open = false;
    }
    if (themeColorStore.color !== inputColor.value) {
        themeColorStore.setColor(inputColor.value);
    }
};

const onCancel = () => {
    if (dialogRef.value) {
        dialogRef.value.open = false;
    }
    if (themeColorStore.color !== inputColor.value) {
        setColorScheme(themeColorStore.color);
        inputColor.value = themeColorStore.color;
    }
};

const resetToDefault = () => {
    if (inputColor.value !== "#0f032b") {
        themeColorStore.$reset();
        inputColor.value = themeColorStore.color;
    }
};

watchDebounced(
    inputColor,
    (newColor) => {
        setColorScheme(newColor);
    },
    { debounce: 100, maxWait: 1_000 }
);
</script>

<template>
    <mdui-dialog
        :headline="t('settings.theme-color.dialog.headline')"
        :description="t('settings.theme-color.dialog.description')"
        :open="isOpen"
        close-on-overlay-click="false"
        @closed.self="onClosed()"
        ref="dialog"
    >
        <input type="color" v-model="inputColor" />
        <br />
        <mdui-button @click="resetToDefault()" full-width style="margin-top: 1rem">
            {{ t("settings.theme-color.dialog.reset") }}
        </mdui-button>
        <mdui-button slot="action" variant="text" @click="onCancel()">
            {{ t("cancel") }}
        </mdui-button>
        <mdui-button slot="action" variant="tonal" @click="onConfirm()">
            {{ t("confirm") }}
        </mdui-button>
    </mdui-dialog>
</template>

<style lang="css" scoped>
input {
    width: 100%;
}
</style>
