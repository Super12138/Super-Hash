<script setup lang="ts">
import "mdui/components/button.js";
import { useI18n } from "vue-i18n";

defineProps<{ disabled: boolean }>();
defineEmits<{ (e: "click"): void }>();

const { t } = useI18n();
</script>

<template>
    <mdui-button full-width :disabled="disabled" @click="$emit('click')">
        {{ t("check-btn-label") }}
    </mdui-button>
</template>
