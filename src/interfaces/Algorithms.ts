export enum Algorithms {
    Unselected = "Unselected",
    MD5 = "MD5",
    SHA1 = "SHA1",
    SHA3 = "SHA3",
    SHA256 = "SHA256",
    SHA384 = "SHA384",
    SHA512 = "SHA512",
}

export function toAlgorithm(algo: string): Algorithms {
    if (Object.values(Algorithms).includes(algo as Algorithms)) {
        return algo as Algorithms;
    }
    return Algorithms.Unselected;
}
