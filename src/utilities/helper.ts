import slugify from "slugify";
import shajs from "sha.js";
import { TransactionResponse } from "ethers";

export function slugifyText(value: string) {

    return slugify(value, {
        replacement: '-',  // replace spaces with replacement character, defaults to `-`
        remove: undefined, // remove characters that match regex, defaults to `undefined`
        lower: false,      // convert to lower case, defaults to `false`
        strict: false,     // strip special characters except replacement, defaults to `false`
        locale: 'vi',      // language code of the locale to use
        trim: true        // trim leading and trailing replacement chars, defaults to `true`        
    })
}

export function generateUUID() {

    let d = new Date().getTime();

    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });

    return uuid;
}


export function addressShortener(address: string, length: number = 4) {
    return `${address.substr(0, length)}...${address.substr(address.length - length, address.length)}`;
}

export function formatNumber(value: number | string, decimal: number = 2) {
    return new Intl.NumberFormat('en-US', { maximumSignificantDigits: 6 }).format(Number(value));
}

export function nSuperScript(number: number) {

    const numberString = number.toString();
    const superscript = [ '⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹' ];
    return numberString.split('').map((char) => superscript[ parseInt(char) ]).join('');
}

export function nSubscript(number: number) {
    const numberString = number.toString();
    const subscript = [ '₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉' ];
    return numberString.split('').map((char) => subscript[ parseInt(char) ]).join('');
}

export function sSuperScript(letter: string) {

    const subscriptLetters = [ 'ᵃ', 'ᵇ', 'ᶜ', 'ᵈ', 'ᵉ', 'ᶠ', 'ᵍ', 'ʰ', 'ⁱ', 'ʲ', 'ᵏ', 'ˡ', 'ᵐ', 'ⁿ', 'ᵒ', 'ᵖ', 'ʳ', 'ˢ', 'ᵗ', 'ᵘ', 'ᵛ', 'ʷ', 'ˣ', 'ʸ', 'ᶻ' ];

    return letter.split('').map((char) => subscriptLetters[ parseInt(char) ]).join('');
}

export function sSubscript(letter: string) {
    const subscriptLetters = [ 'ₐ', 'ₑ', 'ᵢ', 'ⱼ', 'ₖ', 'ₗ', 'ₘ', 'ₙ', 'ₒ', 'ₚ', 'ᵣ', 'ₛ', 'ₜ', 'ᵤ', 'ᵥ', 'ₓ' ];
    return letter.split('').map((char) => subscriptLetters[ parseInt(char) ]).join('');
}

export function hashValue(value: string) {

    const utf8 = new TextEncoder().encode(value);
    const output = shajs('sha256').update(utf8).digest('hex');
    return output;
}

export function buildHashableString(value: string[]) {

    return value.join('|');
}

export function getMerkleableData(tx: TransactionResponse) {
    const nullish = '<*>'
    return buildHashableString([
        tx.hash,
        tx.nonce.toString(),
        tx.gasPrice.toString(),
        tx.gasLimit.toString(),
        tx.to ? tx.to : nullish,
        tx.value.toString(),
        tx.data ? tx.data : nullish,
        tx.chainId ? tx.chainId.toString() : nullish,
        tx.from ? tx.from : nullish,
        tx.type.toString(),
        tx.maxFeePerGas ? tx.maxFeePerGas.toString() : nullish,
        tx.maxPriorityFeePerGas ? tx.maxPriorityFeePerGas.toString() : nullish,
    ]);
}

export function EthTransactionToHashableString(leftTx: TransactionResponse, rightTx: TransactionResponse) {

    const leftNode = getMerkleableData(leftTx);
    const rightNode = getMerkleableData(rightTx);

    return buildHashableString([ leftNode, rightNode ]);
}

const alphabet = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase().split('');
export function getAlphaLetterIndex(num: number) {

    if (num < 26)
        return alphabet[ num ];

    return alphabet[ Math.floor(num / 26) - 1 ] + alphabet[ num % 26 ];
}