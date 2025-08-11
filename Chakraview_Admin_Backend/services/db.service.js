const createOne = async (model, data) => {
    try {
        return model.create(data);
    } catch (error) {
        throw error;
    }
};

const createBulk = async (model, data) => {
    try {
        return model.bulkCreate(data);
    } catch (error) {
        throw error;
    }
};

const findOne = async (model, where, attributes = null, include = [], orderBy, orderDir, logData = false) => {
    try {
        let options = { where, include };

        if (attributes) { options.attributes = attributes; }

        if (orderBy && orderDir) {
            options.order = [
                [orderBy, orderDir],
            ];
        }

        if (logData) {
            console.log("================= NEW QUERY - findOne =========================");
            console.log("OPTIONS >>>>>", options);
            options.logging = console.log;
        }

        const responseData = await model.findOne(options);

        if (logData) {
            console.log("================= END QUERY - findOne =========================");
        }

        return responseData;
    } catch (error) {
        throw error;
    }
};

const findAll = async (model, where, attributes = null, raw = false, include = [], group = [], orderBy, orderDir, limit, page, logData = false) => {
    try {
        let options = { where, include, raw };

        if (attributes) { options.attributes = attributes; }

        if (group?.length) {
            options.group = group
        }

        if (orderBy && orderDir) {
            options.order = [
                [orderBy, orderDir],
            ];
        }

        if (limit) {
            options.limit = limit;

            if (page) {
                options.offset = page ? ((parseInt(options.limit) - 1) * limit) : 0
            }
        }

        if (logData) {
            console.log("================= NEW QUERY - findAll =========================");
            console.log("OPTIONS >>>>>", options);
            options.logging = console.log;
        }

        const responseData = await model.findAll(options);

        if (logData) {
            console.log("================= END QUERY - findAll =========================");
        }

        return responseData;
    } catch (error) {
        throw error;
    }
};

const update = async (model, data, where, logData = false) => {
    try {

        let options = {
            where,
        };

        if (logData) {
            console.log("================= NEW QUERY - update =========================");
            console.log("UPDATE DATA >>>>>", data);
            console.log("OPTIONS >>>>>", options);
            options.logging = console.log;
        }

        const responseData = await model.update(data, options);

        if (logData) {
            console.log("================= END QUERY - update =========================");
        }

        return responseData;
    } catch (error) {
        throw error;
    }
};

const deleteRecord = async (model, where, logData = false) => {
    try {

        let options = {
            where
        }

        if (logData) {
            console.log("================= NEW QUERY - deleteRecord =========================");
            console.log("OPTIONS >>>>>", options);
            options.logging = console.log;
        }

        let responseData = await model.destroy(options);

        if (logData) {
            console.log("================= END QUERY - deleteRecord =========================");
        }
        return responseData;
    } catch (e) {
        throw e;
    }
};

// Get single record using model query
const getOne = async (model, where, attributes = null, include = [], orderBy, logData = false) => {
    try {
        let options = { where, include };
        if (attributes) { options.attributes = attributes; }
        if (orderBy) {
            options.order = [
                orderBy
            ];
        }

        if (logData) {
            console.log("================= NEW QUERY - findOne =========================");
            console.log("OPTIONS >>>>>", options);
            options.logging = console.log;
        }
        // options.raw = true;
        // options.nest = true;
        let responseData = await model.findOne(options);
        responseData = JSON.stringify(responseData);
        responseData = JSON.parse(responseData);

        if (logData) {
            console.log("================= END QUERY - findOne =========================");
        }
        return responseData;
    } catch (error) {
        throw Error(error);
    }
};

module.exports = {
    createOne,
    createBulk,
    findOne,
    findAll,
    update,
    deleteRecord,
    getOne
};
