const PATTERNS = {
    PHONE_1: {
        pattern: /^\+ (?: [0 - 9]●?) { 6, 14 } [0 - 9]$ /,   //pattern for +{10_digit_number} where + is required
        message: 'Phone number must include + and mobile number.'
    },
    PHONE_2: {
        pattern: /^[1-9]+[0-9]*$/,   //pattern for {10_digit_number} only
        message: 'Phone number must be 10 digit numbers only.'
    },
};

module.exports = {
    PATTERNS
};