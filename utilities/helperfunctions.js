
function Capitalize(text) {
    const capitalizedText = (text && text.length > 0) ? (text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()) : text;
    return capitalizedText;
}

function UpperCase(text) {
    const alteredText = (text && text.length > 0) ? text.toUpperCase() : text;
    return alteredText;
}

function LowerCase(text) {
    const alteredText = (text && text.length > 0) ? text.toLowerCase() : text;
    return alteredText;
}

module.exports = {
    Capitalize: Capitalize,
    UpperCase: UpperCase,
    LowerCase: LowerCase,
};
