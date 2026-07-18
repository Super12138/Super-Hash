export enum Modes {
    Unselected = "Unselected",
    Check = "Check",
    Generate = "Generate",
}

export function toMode(mode: string): Modes {
    if (Object.values(Modes).includes(mode as Modes)) {
        return mode as Modes;
    }
    return Modes.Unselected;
}
