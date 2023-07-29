import { useEffect } from "react";
import customToast from "@/toast";


export const handleNetworkError = (error: any) => {
    let hasError = false;
    if (!window.navigator.onLine) {
        // internet is not working
        hasError = true;
        return customToast({
            message: "Internet connection is not available",
            icon: "error",
        });
    } else if (isNetworkError(error)) {
        hasError = true;
        return customToast({
            message: "Server is not available",
            icon: "error",
        });
    }
    return hasError;
};

export const isEmpty = (arg: any) => {
    if (arg == null) {
        return true;
    } else if (typeof arg === "undefined") {
        return true;
    } else if (arg.length === 0) {
        return true;
    } else if (typeof arg === "object" && Object.keys(arg).length === 0) {
        return true;
    }
    return false;
};

export function useEffectAsync(effect: any, inputs: any) {
    useEffect(() => {
        effect();
    }, inputs);
}

export const any = (iterable: any) => {
    for (const e of iterable) {
        if (e) return true;
    }
    return false;
};

export const all = (iterable: any) => {
    for (const e of iterable) {
        if (!e) return false;
    }
    return true;
};

export const anyEmpty = (iterable: any) => {
    for (const e of iterable) {
        if (isEmpty(e)) return true;
    }
    return false;
};

export const allEmpty = (iterable: any) => {
    for (const e of iterable) {
        if (!isEmpty(e)) return false;
    }
    return true;
};

// round number to 2 decimal places
export const roundDecimal = (number: number) => {
    return Math.round(number * 100) / 100;
};

export const replaceWithIndex = (array: any, index: number, element: any) => {
    array.splice(index, 1, element);
    return array;
};


export const randomHash = (length = 24) => {
    const characters =
        "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+/";
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        );
    }
    return result;
};

export function isNetworkError(err: any) {
    return !!err.isAxiosError && !err.response;
}


export const leaf = (css: string, prefix: string): string => {
    let str = "";

    if (!css) {
        return str;
    }

    const newArr = css?.split(" ") || [];

    // loop newArr and add prefix to each item
    for (let i = 0; i <= newArr.length; i++) {
        // check if value is empty
        if (!newArr[i]) {
            continue;
        }

        if (newArr[i].startsWith(prefix)) {
            str += newArr[i].trim();
        }
    }
    return str;
};

export function base64Checker(word: string) {
    const base64 =
        "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let checker = true;

    for (let i = 0; i < word.length; i++) {
        if (base64.indexOf(word[i]) === -1) {
            checker = false;
        }
    }

    return checker;
}

export const setAuthed = () => {
    window.localStorage.setItem("isAuthed", "true");
};

export const getAuthed = () => {
    return window.localStorage.getItem("isAuthed")?.toString();
};

export const clearAuth = () => {
    window.localStorage.removeItem("isAuthed");
};
