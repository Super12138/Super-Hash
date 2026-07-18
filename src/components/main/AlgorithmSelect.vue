<script setup lang="ts">
import "mdui/components/menu-item.js";
import "mdui/components/select.js";
import { computed, watch } from "vue";
import { useI18n } from "vue-i18n";

import { Algorithms, toAlgorithm } from "@/interfaces/Algorithms";

const props = defineProps<{ value: Algorithms }>();
defineEmits<{ (e: "change", value: Algorithms): void }>();

const { t } = useI18n();

const selectValue = computed(() => (props.value == Algorithms.Unselected ? "" : props.value));
</script>

<template>
    <div class="select">
        <span class="select-label">{{ t("algorithm.label") }}</span>
        <mdui-select
            :value="selectValue"
            @change="
                (e: CustomEvent<void> & Event) => {
                    $emit('change', toAlgorithm((e.target as HTMLSelectElement).value));
                }
            "
            :placeholder="t('algorithm.placeholder')"
            required
        >
            <mdui-menu-item :value="Algorithms.MD5">MD5</mdui-menu-item>
            <mdui-menu-item :value="Algorithms.SHA1">SHA1</mdui-menu-item>
            <mdui-menu-item :value="Algorithms.SHA3">SHA3</mdui-menu-item>
            <mdui-menu-item :value="Algorithms.SHA256">SHA256</mdui-menu-item>
            <mdui-menu-item :value="Algorithms.SHA384">SHA384</mdui-menu-item>
            <mdui-menu-item :value="Algorithms.SHA512">SHA512</mdui-menu-item>
        </mdui-select>
    </div>
</template>
