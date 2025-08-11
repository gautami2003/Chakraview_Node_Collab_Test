// const RedisClient = require('../configs/redis.config');
const { DB_MODELS } = require('../constants/models.constant');
const dbService = require('../services/db.service');
const { Sequelize } = require('sequelize');
const Op = Sequelize.Op;
// const redis = new RedisClient();
const axios = require('axios');
const { GOOGLE_DISTANCEMATRIX_URL } = require('../configs/env.config');

const pushDataToRedis = async (key, value, expirationTime = 150) => {
    // await redis.connect();
    if (await redis.set(key, value, expirationTime)) {
        // await redis.disconnect();
        return true
    } else {
        // await redis.disconnect();
        return false
    }
}

const getDataFromRedis = async (key) => {
    // await redis.connect();
    const value = await redis.get(key);
    // await redis.disconnect();
    return value
}

const deleteDataFromRedis = async (key) => {
    // await redis.connect();
    const deletedCount = await redis.del(key);
    // await redis.disconnect();

    return deletedCount > 0;
};

const getRoutesByDriverIDAndRouteType = async (routeType, DriverID) => {
    return await DB_MODELS[`${routeType.toUpperCase()}_ROUTE_MASTER`].findAndCountAll({
        attributes: ['SchoolID', [`${routeType}RouteID`, 'RouteID'], 'RouteName', 'StartTimeHour', 'StartTimeMinute', 'StartTimeAMPM'],
        include: [
            {
                model: DB_MODELS.SCHOOL_MASTER,
                attributes: ['SchoolName']
            }
        ],
        where: {
            DriverID: DriverID,
            isDeleted: 'N'
        },
        order: [['RouteName', 'ASC']],
    });
};

const getRoutesByBusOperatorIDSchoolIDAndRouteType = async (routeType, SchoolID, BusOperatorID) => {
    return await DB_MODELS[`${routeType.toUpperCase()}_ROUTE_MASTER`].findAndCountAll({
        attributes: [`${routeType}RouteID`, 'RouteName', 'StartLocation', 'DestinationLocation', 'StartTimeHour', 'StartTimeMinute', 'StartTimeAMPM', 'EndTimeHour', 'EndTimeMinute', 'EndTimeAMPM'],
        where: {
            SchoolID,
            BusOperatorID,
            isDeleted: 'N'
        },
        order: [['RouteName', 'ASC']],
        raw: true
    });
};

const formatTime = (hour, minute, ampm) => {
    if (hour === "00" && minute === "00") {
        return "";
    } else {
        const time = `${hour}:${minute} ${ampm}`;
        const date = new Date(`1970-01-01 ${time}`);
        date.setTime(date.getTime() - 30 * 60000);
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    }
};

const getDriverIdFromBusIncharge = async (MobileNumber, BusOperatorID) => {
    return await dbService.findOne(DB_MODELS.BUS_INCHARGE_MASTER, { MobileNumber, BusOperatorID, isDeleted: 'N' }, ['DriverID'])
};

const getInchargeDetailsByAttendantTypeID = async (BusOperatorID, DriverID, AttendantTypeID) => {
    return await dbService.findAll(DB_MODELS.BUS_INCHARGE_MASTER, { BusOperatorID: BusOperatorID, AttendantTypeID: AttendantTypeID, isBan: 'N', isDeleted: 'N', DriverID: { [Op.ne]: DriverID.DriverID } }, ['DriverName', 'MobileNumber'], true);
};

const processSchoolIncharge = async (section, name, number) => {
    const json = {};

    if (number !== "") {
        if (number.includes('-')) {
            const [code, phoneNumber] = number.split("-");
            number = code + phoneNumber;
        }
        json.Section = section;
        json.InchargeName = name;
        json.InchargeNumber = number;
    }

    return json;
};

const prepareStopaggesResponse = async (stoppages) => {
    const modifiedStoppageData = stoppages.map(data => ({
        StoppageID: data['StoppageID'],
        StopageName: data['StopageName']
    }));
    return modifiedStoppageData;
};

const travelDistance = async (FromLatitude, FromLongitude, ToLatitude, ToLongitude) => {
    const url = `${GOOGLE_DISTANCEMATRIX_URL}?origins=${FromLatitude},${FromLongitude}&destinations=${ToLatitude},${ToLongitude}&mode=driving&language=en-EN&sensor=false`;
    const response = await axios.get(url);
    const data = response.data;

    const status = data.status;

    if (status === 'OK') {
        return data.rows[0].elements[0].distance.value;
    } else {
        return false;
    }
};

const distance = async (lat1, lon1, lat2, lon2, unit) => {

    const theta = lon1 - lon2;
    let dist = Math.sin(deg2rad(lat1)) * Math.sin(deg2rad(lat2)) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.cos(deg2rad(theta));
    dist = Math.acos(dist);
    dist = rad2deg(dist);
    const miles = dist * 60 * 1.1515;
    unit = unit.toUpperCase();

    if (unit === "K") {
        return (Math.round(miles * 1.609344, 3));
    } else if (unit === "N") {
        return (Math.round(miles * 0.8684, 3));
    } else {
        return Math.round(miles, 3);
    }
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

function rad2deg(rad) {
    return rad * (180 / Math.PI);
}


module.exports = {
    getRoutesByDriverIDAndRouteType,
    getRoutesByBusOperatorIDSchoolIDAndRouteType,
    getDriverIdFromBusIncharge,
    formatTime,
    getInchargeDetailsByAttendantTypeID,
    processSchoolIncharge,
    prepareStopaggesResponse,
    pushDataToRedis,
    getDataFromRedis,
    travelDistance,
    deleteDataFromRedis,
    distance,
};