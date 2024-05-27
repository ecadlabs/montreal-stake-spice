import BigNumber from "bignumber.js";

export const formatTez = (tez: number | BigNumber | null | undefined) => {
    if (tez === null || tez === undefined) {
        return "0";
    }
    const number = typeof tez === "number" ? tez : tez.toNumber();
    return number / 1000000.0;
}
