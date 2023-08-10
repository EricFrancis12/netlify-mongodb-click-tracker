function isEmpty(any) {
    return any === null || any === undefined || any === '';
}

function randomIntBetween(min, max) {
    if (typeof min !== 'number' || typeof max !== 'number') return null;

    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatTime(timestamp) {
    const date = new Date(timestamp);

    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = String(date.getFullYear());
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${month}-${day}-${year}_${hours}_${minutes}_${seconds}`;
}

function camelCase(str) {
    if (typeof str !== 'string') str = str.toString();

    // Replace forward slashes and backslashes with underscores
    const replacedStr = str.replace(/[\/\\]/g, '_');

    // Remove invalid characters and convert to camelCase
    const cleanedStr = replacedStr.replace(/[^a-zA-Z0-9._\-]+(|$)/g, (match, p1) => p1.toUpperCase());

    // Make sure the first character is lowercase
    const camelCaseStr = cleanedStr.charAt(0).toLowerCase() + cleanedStr.slice(1);

    return camelCaseStr;
}

function makeCookieObj(cookieString) {
    if (isEmpty(cookieString)) return {};

    const cookiePairs = cookieString.split('; ');

    const cookieObject = {};
    for (const pair of cookiePairs) {
        const [key, value] = pair.split('=');
        cookieObject[key] = value;
    }

    return cookieObject;
}




module.exports = {
    isEmpty,
    randomIntBetween,
    formatTime,
    camelCase,
    makeCookieObj
}