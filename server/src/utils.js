const low = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');
const adapter = new FileAsync('db.json');
const config = require('../db.config.json');

const db = (async () => {
	const _db = await low(adapter);
	await _db.defaults(config).write();
	return _db;
})();

function getOhmById(id) {
	return getOhmByField('id', id);
}

async function getOhmByField(field, value) {
	const _db = await db;
	const ohm = _db.get('ohms').find({
		[field]: value
	}).value();
	return ohm;
}

module.exports = {
	getOhmById,
	getOhmByField
};
