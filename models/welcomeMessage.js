module.exports = (sequelize, DataTypes) => {
	return sequelize.define('welcomeMessage', {
		guild_id: {
			type: DataTypes.STRING,
			primaryKey: true,
			defaultValue: '000000000000000000',
		},
		message: {
			type: DataTypes.TEXT,
			defaultValue: '{user} has joined {server}',
			allowNull: false,
		},
		channel_id: {
			type: DataTypes.STRING,
			defaultValue: '000000000000000000',
			allowNull: true,
		},
	}, {
		timestamps: false,
	});
};