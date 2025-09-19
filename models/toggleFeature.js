module.exports = (sequelize, DataTypes) => {
	return sequelize.define('toggleFeature', {
		guild_id: {
			type: DataTypes.STRING,
			defaultValue: '000000000000000000',
			primaryKey: true,
		},
		feature: {
			type: DataTypes.TEXT,
			defaultValue: 'feature',
			allowNull: false,
			primaryKey: true,
		},
		enabled: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
			allowNull: false,
		},
	}, {
		timestamps: false,
	});
};