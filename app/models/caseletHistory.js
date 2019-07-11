module.exports = (sequelize, Sequelize) => {
    class CaseletHistory extends Sequelize.Model { }
    CaseletHistory.init({
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        caseletId: Sequelize.INTEGER,
        status: Sequelize.STRING,
        authorMid: Sequelize.STRING,
        adminMid: Sequelize.STRING,
        adminComment: Sequelize.TEXT,
        sendBackTime: Sequelize.DATE,
        submittedTime: Sequelize.DATE,
        approvedTime: Sequelize.DATE,
    },
        {
            timestamps: false,
            underscored: true,
            sequelize
        });
    return CaseletHistory;
}