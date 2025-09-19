module.exports = (sequelize, DataTypes) => {
	return sequelize.define('joinRole', {
		guild_id: {
			type: DataTypes.STRING,
			primaryKey: true,
			defaultValue: '000000000000000000',
		},
		role_id: {
			type: DataTypes.STRING,
			primaryKey: true,
			defaultValue: '000000000000000000',
		},
	}, {
		timestamps: false,
	});
};