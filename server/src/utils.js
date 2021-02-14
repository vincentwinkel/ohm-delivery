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

async function getStatusCodes() {
	const _db = await db;
	//Get all states / status
	const states = _db.get('states').value();
	//Flatten the 2d array returning only status codes
	return states.reduce((arr, state) => arr.concat(state.map((status) => status.code)), []);
}

//The statuses are stored in db, then we can change their logic on the fly without restarting the server
async function getNextStatus(code) {
	const _db = await db;
	//Get all states / status
	const states = _db.get('states').value();
	//Get the current status
	const currentIndex = states.findIndex((state) => state.findIndex((status) => status.code === code) >= 0);
	//If some next status exists, return them. Return an empty array otherwise
	return (currentIndex >= states.length) ? [] : states[currentIndex + 1];
}

module.exports = {
	getOhmById,
	getOhmByField,
	getStatusCodes,
	getNextStatus
};
