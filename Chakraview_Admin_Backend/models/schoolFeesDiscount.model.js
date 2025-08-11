const sequelize_connection = require('../configs/db-connection.config');
const { DataTypes } = require('sequelize');

const SchoolFeesDiscountModel = sequelize_connection.define('school_fees_discounts', {
    id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    school_id: {
        type: DataTypes.INTEGER
    },
    route_type: {
        type: DataTypes.ENUM('one_way', 'two_way')
    },
    discount: {
        type: DataTypes.INTEGER
    },
    pay_period: {
        type: DataTypes.ENUM('monthly', 'quarterly', 'quadrimester', 'semiAnnual', 'annual')
    },
}, {
    tableName: 'school_fees_discounts',
    timestamps: false
});


module.exports = SchoolFeesDiscountModel;