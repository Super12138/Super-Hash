export function isAndroidDevice() {
    const ua = navigator.userAgent || navigator.vendor;
    // const mobileRegex = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|windows phone|phone|webos|kindle|tablet/i;
    return ua.includes("android") || ua.includes("andro");
}
