// export type AppVariant = "web" | "desktop-default" | "desktop-store";

export const Platform = {
    variant: VARIANT,
    isDev: import.meta.env.DEV,
    isWeb: VARIANT === "web",
    isDesktop: VARIANT === "desktop-default" || VARIANT === "desktop-store",
    isDesktopStore: VARIANT === "desktop-store",
    isDesktopDefault: VARIANT === "desktop-default",
};
