import { ref, toValue, watchEffect, type MaybeRefOrGetter, type Ref } from "vue";

import type { FormattedTime } from "@/interfaces/FormattedTime";

/**
 * 判断一个字符串是否为空或者只包含空白字符
 *
 * @param str 要判断的字符串
 * @returns 是否为空或者只包含空白字符
 */
export function isBlankOrEmpty(str: number | string | null): boolean {
    return str === null || str.toString().trim() === "";
}

export function useBlankOrEmptyCheck(text: MaybeRefOrGetter<string | null>): Ref<boolean, boolean> {
    const state = ref<boolean>(false);
    watchEffect(() => {
        state.value = isBlankOrEmpty(toValue(text));
    });
    return state;
}

export function useNotBlankOrEmptyCheck(
    text: MaybeRefOrGetter<string | null>
): Ref<boolean, boolean> {
    const state = ref<boolean>(false);
    watchEffect(() => {
        state.value = !isBlankOrEmpty(toValue(text));
    });
    return state;
}

/*export const formatDate = (date: number): string => {
    let dateObj: Date = new Date(date);
    let year: number = dateObj.getFullYear();
    let month: string | number = dateObj.getMonth() + 1;
    let day: string | number = dateObj.getDate();
    let hour: string | number = dateObj.getHours();
    let minute: string | number = dateObj.getMinutes();
    let second: string | number = dateObj.getSeconds();
    if (month < 10) {
        month = `0${month}`;
    }
    if (day < 10) {
        day = `0${day}`;
    }
    if (hour < 10) {
        hour = `0${hour}`;
    }
    if (minute < 10) {
        minute = `0${minute}`;
    }
    if (second < 10) {
        second = `0${second}`;
    }
    // 返回格式化后的日期字符串
    return `${year} 年 ${month} 月 ${day} 日 ${hour}:${minute}:${second}`;
};*/

/**
 * 格式化时间
 *
 * @param seconds 传入的时间（单位：秒）
 * @returns 格式化的时间字符串；输出：`ss秒`，`mm分钟`，`hh 小时 mm 分钟 ss 秒`
 */
/*export const useFormatTime = (seconds: MaybeRefOrGetter<number>): Ref<string, string> => {
    const str = ref<string>("");
    watchEffect(() => {
        str.value = formatTime(toValue(seconds));
    });
    return str;
};*/

/**
 * 格式化时间
 *
 * @param seconds 传入的时间（单位：秒）
 * @returns 格式化后的时间数据，分别存储在`hours`、`minutes`、`seconds`中
 */
export const formatTime = (seconds: number): FormattedTime => {
    return {
        hours: Math.floor(seconds / 3600),
        minutes: Math.floor((seconds % 3600) / 60),
        seconds: Math.floor(seconds % 60),
    };
};
