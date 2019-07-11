module.exports = (sequelize, Sequelize) => {
    class ActivityLog extends Sequelize.Model { }
    ActivityLog.init({
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        event: Sequelize.STRING,
        userMid: Sequelize.STRING,
        caseletId: Sequelize.INTEGER
    },
        {
            timestamps: true,
            createdAt: 'eventTime',
            updatedAt: false,
            underscored: true,
            sequelize
        });
    return ActivityLog;
}