// services/distanceMessageLog.services.js
const { Op } = require("sequelize");
const { DB_MODELS } = require("../constants/models.constant");

const {
  NOTIFICATION_LOG_MODEL,
  SCHOOL_MASTER,
  DRIVER_ROUTE_TRANSACTION,
  BUS_INCHARGE_MASTER,
  PICKUP_ROUTE_MASTER,
  DROP_ROUTE_MASTER,
} = DB_MODELS;

const getAllNotificationReport = async (busOperatorId) => {
  if (!busOperatorId) throw new Error("Bus Operator ID is required");

  const rows = await NOTIFICATION_LOG_MODEL.findAll({
    // no where on BusOperatorID here (it doesn't exist on this table)
    attributes: { exclude: [] },
    include: [
      {
        model: SCHOOL_MASTER,
        as: "school_master",
        attributes: ["SchoolID", "SchoolName"],
        where: { BusOperatorID: busOperatorId }, // <-- filter by operator via School
        required: true,
      },
      { model: PICKUP_ROUTE_MASTER, as: "pickup_route", attributes: ["RouteName"] },
      { model: DROP_ROUTE_MASTER, as: "drop_route", attributes: ["RouteName"] },
       {
      model: DRIVER_ROUTE_TRANSACTION,
      as: "driver_route_transaction",
      include: [
        {
          model: BUS_INCHARGE_MASTER,
          as: "bus_incharge_master",
          attributes: ["DriverID", "DriverName"]
        }
      ]
    },
    ],
    order: [["DateTime", "DESC"]],
  });

  return rows;
};

module.exports = { getAllNotificationReport };