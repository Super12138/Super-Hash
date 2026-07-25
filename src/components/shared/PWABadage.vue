<script setup lang="ts">
// import { snackbar } from 'mdui';
import "mdui/components/circular-progress.js";
import "mdui/components/snackbar.js";
import { useRegisterSW } from "virtual:pwa-register/vue";
import { ref } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

// check for updates every hour
const period = 60 * 60 * 1000;

const swInstalling = ref(false);
const swActivated = ref(false);

/**
 * This function will register a periodic sync check every hour, you can modify the interval as needed.
 */
function registerPeriodicSync(swUrl: string, r: ServiceWorkerRegistration) {
    console.log("registerPeriodicSync", swUrl, r);
    if (period <= 0) return;

    setInterval(async () => {
        if ("onLine" in navigator && !navigator.onLine) return;

        const resp = await fetch(swUrl, {
            cache: "no-store",
            headers: {
                cache: "no-store",
                "cache-control": "no-cache",
            },
        });

        if (resp?.status === 200) await r.update();
    }, period);
}

const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW({
    immediate: true,
    onRegisteredSW(swScriptUrl, registration) {
        // console.log("Start SW register: ", swScriptUrl, registration);
        if (period <= 0) return;
        if (registration?.active?.state === "activated") {
            swActivated.value = true;
            // console.log("Service worker activated", swScriptUrl, registration);
            registerPeriodicSync(swScriptUrl, registration);
        } else if (registration?.installing) {
            // console.log("Service worker installing", swScriptUrl, registration);
            swInstalling.value = true;
            registration.installing.addEventListener("statechange", (e) => {
                const sw = e.target as ServiceWorker;
                if (sw.state === "activated") {
                    swActivated.value = true;
                    swInstalling.value = false;
                    // console.log("Service worker activated", swScriptUrl, registration);
                    registerPeriodicSync(swScriptUrl, registration);
                }
            });
        }
    },
    /* onOfflineReady() {
        snackbar({
            message: "Super Hash 已准备好在离线环境下运行",
        });
    },
    onNeedRefresh() {
        snackbar({
            message: "Super Hash 有新版本",
            action: "立即更新",
            onActionClick: () => updateServiceWorker(true),
        });
    }, */
});
</script>

<template>
    <mdui-snackbar :open="offlineReady">{{ t("pwa.offline-ready") }}</mdui-snackbar>
    <mdui-snackbar :open="swInstalling" auto-close-delay="0">
        {{ t("pwa.installing") }}
    </mdui-snackbar>
    <mdui-snackbar :open="needRefresh">
        {{ t("pwa.new-version.tip") }}
        <mdui-button slot="action" variant="text" @click="updateServiceWorker(true)">
            {{ t("pwa.new-version.action") }}
        </mdui-button>
    </mdui-snackbar>
</template>
