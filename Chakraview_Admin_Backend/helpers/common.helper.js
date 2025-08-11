const dbService = require('../services/db.service');
const { DB_MODELS } = require('../constants/models.constant');

const prepareResponse = async (data) => {
    const merged = {};

    for (const dictionary of data) {
        for (const key in dictionary) {
            if (dictionary.hasOwnProperty(key)) {
                merged[key] = dictionary[key];
            }
        }
    }
    return merged;
}

const prepareListResponse = async (data) => {
    let res = []
    for (const dictionary of data) {
        const merged = {};
        for (const key in dictionary) {
            if (dictionary.hasOwnProperty(key)) {
                merged[key] = dictionary[key];
            }
        }
        res.push(merged);
    }
    return res;
}

const getTimeZoneByBusOperatorID = async (BusOperatorID) => {
    try {
        // Find the BusOperator by BusOperatorID
        const busOperator = await dbService.findOne(DB_MODELS.BUS_OPERATOR_MASTER, { BusOperatorID }, ['TimeZone']);

        return busOperator.TimeZone;
    } catch (error) {
        await logError(req, res, 'commonHelper', 'getTimeZoneByBusOperatorID', error, {});
        console.error('Error:', error);
    }
}

const getCurrentDate = async (TimeZone) => {
    const currentDate = new Date().toLocaleDateString('en-US', {
        timeZone: TimeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });

    const [month, day, year] = currentDate.split('/');
    const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

    return formattedDate;
};

const generateRandomString = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}


const getMimeTypeFromBase64 = (base64String) => {
    const magicNumbers = {
        "/9j/": "image/jpeg",
        "iVBORw0KGgo=": "image/png",
        "R0lGODdh": "image/gif",
        "R0lGODlh": "image/gif",
        "BM": "image/bmp",
        "UklGR": "image/webp"
    };

    const signature = base64String.substring(0, 15);
    for (const key in magicNumbers) {
        if (signature.includes(key)) {
            return magicNumbers[key];
        }
    }
    return "unknown";
};

const getFileExtension = (mimeType) => {
    const extensions = {
        "image/jpeg": "jpg",
        "image/png": "png",
        "image/gif": "gif",
        "image/bmp": "bmp",
        "image/webp": "webp"
    };
    return extensions[mimeType] || "unknown";
};

// Example Usage
const base64Data = "iVBORw0KGgo..."; // Replace with actual Base64
const mimeType = getMimeTypeFromBase64(base64Data);
const extension = getFileExtension(mimeType);

console.log(`MIME Type: ${mimeType}, Extension: .${extension}`);


module.exports = {
    prepareResponse,
    prepareListResponse,
    getTimeZoneByBusOperatorID,
    getCurrentDate,
    generateRandomString,
    getMimeTypeFromBase64,
    getFileExtension
};