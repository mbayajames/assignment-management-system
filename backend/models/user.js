module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.ENUM('admin', 'student'),
            allowNull: false
        },
        role: {
            type: DataTypes>ENUM('admin', 'student')
            allowNull: false
        }
    }, {
        tableName: 'users',
        timestamps: true
    });

    return User;
};