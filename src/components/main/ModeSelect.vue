<script setup lang="ts">
import "mdui/components/menu-item.js";
import "mdui/components/select.js";
import { computed } from "vue";
import { useI18n } from "vue-i18n";

import { Modes, toMode } from "@/interfaces/Modes";

const props = defineProps<{ value: Modes }>();
defineEmits<{ (e: "change", value: Modes): void }>();

const { t } = useI18n();

const selectValue = computed(() => (props.value === Modes.Unselected ? "" : props.value));
</script>

<template>
    <div class="select">
        <span class="select-label">{{ t("mode.label") }}</span>
        <mdui-select
            :value="selectValue"
            @change="
                (e: CustomEvent<void> & Event) => {
                    $emit('change', toMode((e.target as HTMLSelectElement).value));
                }
            "
            :placeholder="t('mode.placeholder')"
            required
        >
            <mdui-menu-item value="Check">{{ t("mode.check") }}</mdui-menu-item>
            <mdui-menu-item value="Generate">{{ t("mode.generate") }}</mdui-menu-item>
        </mdui-select>
    </div>
</template>
