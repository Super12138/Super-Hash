import { acceptHMRUpdate, defineStore } from "pinia";
import { ref } from "vue";

const DURATION = 200;

// gpt
const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export const useDrawerStore = defineStore("drawer", () => {
    const isOutputDrawerOpen = ref(false);
    const isSettingsDrawerOpen = ref(false);

    const toggleOutputDrawer = async () => {
        if (isSettingsDrawerOpen.value) {
            isSettingsDrawerOpen.value = false;
            await sleep(DURATION);
            isOutputDrawerOpen.value = true;
            return;
        }

        isOutputDrawerOpen.value = !isOutputDrawerOpen.value;
    };

    const toggleSettingsDrawer = async () => {
        if (isOutputDrawerOpen.value) {
            isOutputDrawerOpen.value = false;

            await sleep(DURATION);

            isSettingsDrawerOpen.value = true;
            return;
        }
        isSettingsDrawerOpen.value = !isSettingsDrawerOpen.value;
    };

    const openOnlyOutputDrawer = async () => {
        if (isSettingsDrawerOpen.value) {
            isSettingsDrawerOpen.value = false;
            await sleep(DURATION);
            isOutputDrawerOpen.value = true;
        }
        isOutputDrawerOpen.value = true;
    };

    return {
        isOutputDrawerOpen,
        isSettingsDrawerOpen,
        toggleOutputDrawer,
        toggleSettingsDrawer,
        openOnlyOutputDrawer,
    };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useDrawerStore, import.meta.hot));
}
