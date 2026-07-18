<script setup lang="ts">
import "mdui/components/dialog.js";
import type { Dialog } from "mdui/components/dialog.js";
import { computed, useTemplateRef } from "vue";
import { useI18n } from "vue-i18n";

const { t, d, locale } = useI18n();

const isOpen = defineModel<boolean>({ required: true });
const dialogRef = useTemplateRef<Dialog>("dialog");

const props = defineProps<{
    fileName: string;
    fileMode: string;
    fileAlgorithm: string;
    fileStatus: string;
    addTime: number;
    hash: string | undefined;
    checkSum: string | undefined;
    showCompare: boolean;
    isCheckSumMatch: boolean;
}>();

defineEmits<{ (e: "copy-hash"): void }>();

const onClosed = () => {
    isOpen.value = false;
};

const onConfirm = () => {
    if (dialogRef.value) {
        dialogRef.value.open = false;
    }
};

const checksumStatusText = computed(() => {
    return props.isCheckSumMatch
        ? t("file-dialog.checksum-info.success")
        : t("file-dialog.checksum-info.failed");
});

const checksumStatusClass = computed(() => {
    return props.isCheckSumMatch ? "green" : "red";
});
</script>

<template>
    <mdui-dialog
        :headline="t('file-dialog.headline')"
        :open="isOpen"
        close-on-overlay-click="true"
        @closed.self="onClosed()"
        ref="dialog"
    >
        <div>
            <table class="mdui-table">
                <thead>
                    <tr>
                        <th scope="col">属性</th>
                        <th scope="col">值</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th colspan="2" scope="colgroup">
                            {{ t("file-dialog.basic-info.title") }}
                        </th>
                    </tr>
                    <tr>
                        <th scope="row">{{ t("file-dialog.basic-info.file-name") }}</th>
                        <td>{{ fileName }}</td>
                    </tr>
                    <tr>
                        <th scope="row">{{ t("file-dialog.basic-info.mode") }}</th>
                        <td>{{ fileMode }}</td>
                    </tr>
                    <tr>
                        <th scope="row">{{ t("file-dialog.basic-info.algorithm") }}</th>
                        <td>{{ fileAlgorithm }}</td>
                    </tr>
                    <tr>
                        <th scope="row">{{ t("file-dialog.basic-info.status") }}</th>
                        <td>{{ fileStatus }}</td>
                    </tr>
                    <tr>
                        <th scope="row">{{ t("file-dialog.basic-info.add-time") }}</th>
                        <td>{{ d(addTime, "long", locale) }}</td>
                    </tr>

                    <template v-if="hash !== undefined">
                        <tr>
                            <th colspan="2" scope="colgroup">
                                {{ t("file-dialog.checksum-info.headline") }}
                            </th>
                        </tr>
                        <tr>
                            <th scope="row">
                                {{ t("file-dialog.checksum-info.checksum-generate") }}
                            </th>
                            <td>
                                <mdui-tooltip :content="t('click-to-copy')" placement="bottom">
                                    <code @click="$emit('copy-hash')">{{ hash }}</code>
                                </mdui-tooltip>
                            </td>
                        </tr>
                        <tr v-if="checkSum?.trim() != ''">
                            <th scope="row">{{ t("file-dialog.checksum-info.checksum-user") }}</th>
                            <td>
                                <code @click="$emit('copy-hash')">{{ checkSum }}</code>
                            </td>
                        </tr>
                        <tr v-if="showCompare">
                            <th scope="row">
                                {{ t("file-dialog.checksum-info.verification-result") }}
                            </th>
                            <td>
                                <strong :class="checksumStatusClass">
                                    {{ checksumStatusText }}
                                </strong>
                            </td>
                        </tr>
                    </template>
                </tbody>
                <colgroup>
                    <col />
                    <col />
                </colgroup>
            </table>
        </div>
        <mdui-button slot="action" variant="tonal" @click="onConfirm()">
            {{ t("confirm") }}
        </mdui-button>
    </mdui-dialog>
</template>

<style lang="css" scoped>
.red {
    color: #d32f2f !important;
}

.green {
    color: #00c853 !important;
}

code {
    word-break: break-all;
    cursor: pointer;
}

.check-info {
    margin-top: 2rem;
}

table {
    width: 100%;
    overflow-x: auto;
    /* margin-top:2em; */
    /* margin-bottom:2em; */
    border: 0.0625rem solid rgb(var(--mdui-color-surface-variant));
    /* border-radius: var(--mdui-shape-corner-large); */
    border-collapse: collapse;
}

thead th {
    position: relative;
    vertical-align: middle;
    padding: 1.125rem 1rem;
    font-weight: var(--mdui-typescale-title-medium-weight);
    letter-spacing: var(--mdui-typescale-title-medium-tracking);
    line-height: var(--mdui-typescale-title-medium-line-height);
    color: rgb(var(--mdui-color-on-surface-variant));
    box-shadow: 0;
    border: 0.0625rem solid rgb(var(--mdui-color-surface-variant));
}

tbody td,
tbody th {
    padding: 0.875rem 1rem;
    border: 0.0625rem solid rgb(var(--mdui-color-surface-variant));
}

thead tr th {
    background-color: rgb(var(--mdui-color-secondary-container));
}
</style>
