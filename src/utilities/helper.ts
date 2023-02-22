import slugify from "slugify";

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


    //format number : 200 -> 200.00 , 200.1 -> 200.10 , 1000000 -> 1,000,000
    return new Intl.NumberFormat('en-US', { maximumSignificantDigits: 6 }).format(Number(value));
}