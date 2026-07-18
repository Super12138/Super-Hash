import { acceptHMRUpdate, defineStore } from "pinia";
import { computed, ref } from "vue";

import { Algorithms } from "@/interfaces/Algorithms";
import { Modes } from "@/interfaces/Modes";
import { useFileNotBlankCheck } from "@/utils/file";
import { useNotBlankOrEmptyCheck } from "@/utils/text";

export const useFileConfigurationStore = defineStore("fileConfiguration", () => {
    // file
    const file = ref<File | null>(null);
    const hasFile = useFileNotBlankCheck(file);
    function setFile(newFile: File) {
        file.value = newFile;
    }

    // mode
    const mode = ref<Modes>(Modes.Unselected);
    const isModeValid = computed(() => mode.value !== Modes.Unselected);
    function setMode(newMode: Modes) {
        mode.value = newMode;
    }

    // algorithm
    const algorithm = ref<Algorithms>(Algorithms.Unselected);
    const isAlgorithmValid = computed(() => algorithm.value !== Algorithms.Unselected);
    function setAlgorithm(newAlgorithm: Algorithms) {
        algorithm.value = newAlgorithm;
    }

    // checkSum
    const checkSum = ref<string>("");
    const isCheckSumValid = useNotBlankOrEmptyCheck(checkSum);
    function setCheckSum(newCheckSum: string) {
        checkSum.value = newCheckSum;
    }

    function $reset() {
        file.value = null;
        mode.value = Modes.Unselected;
        algorithm.value = Algorithms.Unselected;
        checkSum.value = "";
    }

    return {
        // file
        file,
        hasFile,
        setFile,
        // mode
        mode,
        isModeValid,
        setMode,
        // algorithm
        algorithm,
        isAlgorithmValid,
        setAlgorithm,
        // checkSum
        checkSum,
        isCheckSumValid,
        setCheckSum,
        $reset,
    };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useFileConfigurationStore, import.meta.hot));
}
