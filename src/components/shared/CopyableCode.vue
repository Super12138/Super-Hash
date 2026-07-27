<script setup lang="ts">
import { useClipboard } from "@vueuse/core";
import { snackbar } from "mdui";
import { useI18n } from "vue-i18n";

const props = defineProps<{ code: string }>();

const { copy, isSupported } = useClipboard();
const { t } = useI18n();

const copyText = () => {
    if (!isSupported.value) {
        snackbar({ message: t("clipboard.not-supported") });
        return;
    }

    copy(props.code)
        .then(() => snackbar({ message: t("clipboard.copy-successful") }))
        .catch((e) => snackbar({ message: t("clipboard.copy-failed", { error: e }) }));
};
</script>

<template>
    <mdui-tooltip :content="t('click-to-copy')">
        <code @click="copyText">{{ code }}</code>
    </mdui-tooltip>
</template>

<style lang="css" scoped>
code {
    word-break: break-all;
    cursor: pointer;
}
</style>
