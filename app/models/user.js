module.exports = (sequelize, Sequelize) => {
    class User extends Sequelize.Model { }
    User.init({
        mid: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        role: {
            type: Sequelize.STRING,
            defaultValue: 'user'
        }
    },
        {
            timestamps: false,
            underscored: true,
            modelName: 'user',
            sequelize
        });
    return User;
}