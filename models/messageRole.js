module.exports = (sequelize, DataTypes) => {
	return sequelize.define('messageRole', {
		guild_id: {
			type: DataTypes.STRING,
			primaryKey: true,
			defaultValue: '000000000000000000',
		},
		text: {
			type: DataTypes.TEXT,
			primaryKey: true,
			defaultValue: 'isuppose',
		},
		role_id: {
			type: DataTypes.STRING,
			primaryKey: true,
			defaultValue: '000000000000000000',
		},
		channel_id: {
			type: DataTypes.STRING,
			defaultValue: '000000000000000000',
			allowNull: true,
		},
		is_strict: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
	}, {
		timestamps: false,
	});
};