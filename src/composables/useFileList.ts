import { ref } from "vue";

import { FileItem } from "@/components/file/FileItem";
import type { Algorithms } from "@/interfaces/Algorithms";
import { FileStatus } from "@/interfaces/FileStatus";
import type { Modes } from "@/interfaces/Modes";

export function useFileList() {
    const fileList = ref<FileItem[]>([]);

    function addFile(file: File) {
        const fileIItem = new FileItem(Date.now(), file.name);
        const last = fileList.value.at(-1);

        if (fileList.value.length > 0 && last.status === FileStatus.Waiting) {
            fileList.value[fileList.value.length - 1] = fileIItem;
        } else {
            fileList.value.push(fileIItem);
        }
    }

    function getCurrentFile(): FileItem {
        return fileList.value.at(-1);
    }

    function setCurrentFileStartCompute(algorithm: Algorithms, mode: Modes, checkSum?: string) {
        const file = getCurrentFile();

        if (!file) return;

        file.status = FileStatus.Computing;
        file.algorithm = algorithm;
        file.mode = mode;
        file.checkSum = checkSum;
        file.progress = undefined;
    }

    function updateProgress(progress: number, estimatedRemainingTime: number) {
        const file = getCurrentFile();

        if (!file) return;

        file.progress = progress;
        file.estimetedTime = estimatedRemainingTime;
    }

    function finishCompute(hash: string) {
        const file = getCurrentFile();

        if (!file) return;

        file.status = FileStatus.Finished;
        file.hash = hash;
    }

    return {
        fileList,
        addFile,
        getCurrentFile,
        setCurrentFileStartCompute,
        updateProgress,
        finishCompute,
    };
}
