<script setup lang="ts">
import "@mdui/icons/notifications-active--outlined.js";
import { isTauri } from "@tauri-apps/api/core";
import { snackbar } from "mdui";
import "mdui/components/list-item.js";
import "mdui/components/switch.js";
import { watch } from "vue";
import { useI18n } from "vue-i18n";

import { useNotification } from "@/composables/useNotification";
import { NOTIFICATION_TAG } from "@/interfaces/constants";

const props = defineProps<{
    checked: boolean;
}>();

defineEmits<{
    (e: "change", value: boolean): void;
}>();

const { t } = useI18n();

const { isSupported, isPermissionDenied, send } = useNotification();

const sendTestNotification = () => {
    if (!isSupported.value) {
        snackbar({ message: t("notification.not-supported") });
        return;
    }
    if (!isTauri()) {
        if (isPermissionDenied()) {
            snackbar({ message: t("notification.permission-denied") });
            return;
        }
    }
    send({
        title: t("notification.test-title"),
        dir: "auto",
        lang: "zh",
        tag: NOTIFICATION_TAG,
    });
};

// 可能需要在确定一次以后再也不显示弹窗
/* watch(
    permissionGranted,
    (granted) => {
        if (!granted) {
            alert({
                headline: t("tip"),
                description: t("settings.system-notification.permission-info"),
            });
        }
    },
    { immediate: true },
); */

watch(
    () => props.checked,
    (enabled) => {
        if (enabled) sendTestNotification();
    }
);
</script>

<template>
    <mdui-list-item
        :headline="t('settings.system-notification.label')"
        :description="t('settings.system-notification.description')"
        @click.self="if (isSupported && !isPermissionDenied()) $emit('change', !checked);"
    >
        <mdui-icon-notifications-active--outlined
            slot="icon"
        ></mdui-icon-notifications-active--outlined>
        <mdui-switch
            slot="end-icon"
            :checked="checked"
            @change.self="
                (e: CustomEvent<void> & Event) => {
                    if (e.target && 'checked' in e.target) {
                        if (isSupported) {
                            $emit('change', (e.target as HTMLInputElement).checked);
                        }
                    }
                }
            "
        ></mdui-switch>
    </mdui-list-item>
    <mdui-button v-if="checked" variant="tonal" full-width @click="sendTestNotification">
        {{ t("settings.system-notification.button") }}
    </mdui-button>
</template>
