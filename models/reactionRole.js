module.exports = (sequelize, DataTypes) => {
	return sequelize.define('reactionRole', {
		guild_id: {
			type: DataTypes.STRING,
			primaryKey: true,
			defaultValue: '000000000000000000',
		},
		message_id: {
			type: DataTypes.STRING,
			defaultValue: '000000000000000000',
			primaryKey: true,
		},
		channel_id: {
			type: DataTypes.STRING,
			defaultValue: '000000000000000000',
			primaryKey: true,
		},
		emoji_id: {
			type: DataTypes.STRING,
			defaultValue: '000000000000000000',
			primaryKey: true,
		},
		role_id: {
			type: DataTypes.STRING,
			defaultValue: '000000000000000000',
		},
	}, {
		timestamps: false,
	});
};