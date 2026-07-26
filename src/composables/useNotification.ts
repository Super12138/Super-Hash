import {
    isPermissionGranted,
    requestPermission,
    sendNotification,
} from "@tauri-apps/plugin-notification";
import { createEventHook, useSupported } from "@vueuse/core";

export interface NotificationOptions {
    title?: string;
    body?: string;
    dir?: "auto" | "ltr" | "rtl";
    icon?: string;
    lang?: string;
    tag?: string;
}

export function useNotification() {
    const isSupported = useSupported(() => "Notification" in window);
    function isPermissionDenied() {
        return Notification.permission === "denied";
    }
    async function permissionGranted() {
        if (import.meta.env.TAURI_ENV_PLATFORM) {
            console.log("in tauri");

            return await isPermissionGranted();
        }

        return (
            isSupported.value &&
            "permission" in Notification &&
            Notification.permission === "granted"
        );
    }

    const { on: onClick, trigger: clickTrigger } = createEventHook<Event>();

    async function getPermission() {
        if (import.meta.env.TAURI_ENV_PLATFORM) {
            const permission = await requestPermission();
            return permission === "granted";
        } else {
            if (Notification.permission !== "denied") {
                // 如果权限被用户明确拒绝就不再获取了
                console.log("permission not granted, try to get");
                try {
                    const result = await Notification.requestPermission();
                    return result === "granted";
                } catch (e) {
                    console.error(e);
                    return false;
                }
            } else {
                return false;
            }
        }
    }

    function sendOneNotification(options: NotificationOptions) {
        if (import.meta.env.TAURI_ENV_PLATFORM) {
            console.log("in Tauri env, send by tauri api");

            sendNotification({
                title: options.title,
                body: options.body,
                icon: options.icon,
            });
        } else {
            console.log("in browser env, send by web api");
            new Notification(options.title, {
                body: options.body,
                lang: options.lang,
                dir: options.dir,
                tag: options.tag,
                icon: options.icon,
            }).onclick = clickTrigger;
        }
    }

    async function send(options: NotificationOptions) {
        console.log("permission.value", permissionGranted());
        if (!isSupported.value) return;
        if (await permissionGranted()) {
            console.log("permission granted");
            sendOneNotification(options);
        } else {
            console.log("permission not granted");
            if (await getPermission()) {
                sendOneNotification(options);
            }
        }
    }

    return {
        isSupported,
        isPermissionDenied,
        permissionGranted,
        getPermission,
        send,
        onClick,
    };
}
