module.exports = (sequelize, DataTypes) => {
	return sequelize.define('messageAudit', {
		guild_id: {
			type: DataTypes.STRING,
			primaryKey: true,
			defaultValue: '000000000000000000',
		},
		edited_channel_id: {
			type: DataTypes.STRING,
			defaultValue: '000000000000000000',
		},
		deleted_channel_id: {
			type: DataTypes.STRING,
			defaultValue: '000000000000000000',
		},
	}, {
		timestamps: false,
	});
};