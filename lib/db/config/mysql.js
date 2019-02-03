let mysqlconfig = {
	host: 'localhost',
	user: 'root',
	password: 'root',
	database: 'candidatesdb',
}

let poolConfig = {
	connectionLimmit: 90,
	host: 'localhost',
	user: 'root',
	password: 'root',
	database: mysqlconfig.database
};

module.exports.config = mysqlconfig;
module.exports.poolConfig = poolConfig;
