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
	return getOhmByFields({
		id
	});
}

async function getOhmByFields(filters, _db) {
	_db = _db || await db; //Avoiding duplicate nested calls
	const ohm = _db.get('ohms').find(filters).value();
	if (ohm) {
		//Attach the next available statuses
		const nextStatuses = await getNextStateByStatus(ohm.status);
		const nextEditableStatuses = (nextStatuses || []).filter((status) => status.editable);
		ohm.nextStatuses = nextEditableStatuses;
	}
	return ohm;
}

async function updateOhmStatus(filters, statusCode, comment) {
	const _db = await db;
	let ohm = await getOhmByFields(filters, _db);
	//If OHM exists and new status can be set
	const nextStatus = ohm.nextStatuses.find((status) => status.editable && status.code === statusCode);

	if ((ohm) && (nextStatus)) {
		ohm.status = statusCode;
		//Set optional comment
		if (nextStatus.commentable) {
			ohm.comment = comment;
		}
		delete ohm.nextStatuses;
		//Add in history
		ohm.history.push({
			state: statusCode,
			at: `${~~(Date.now() / 1000)}` //Cast like in db.config.js
		});
		_db.write();
	}
	//Update result
	return getOhmByFields(filters, _db);
}

//The statuses are stored in db, then we can change their logic on the fly without restarting the server
async function getStatusCodes() {
	const _db = await db;
	//Get all states / status
	const states = _db.get('states').value();
	//Flatten the 2d array returning only status codes
	return states.reduce((arr, state) => arr.concat(state.map((status) => status.code)), []);
}

async function getNextStateByStatus(statusCode) {
	const _db = await db;
	//Get all states / status
	const states = _db.get('states').value();
	//Get the current status
	const currentIndex = states.findIndex((state) => state.findIndex((status) => status.code === statusCode) >= 0);
	//If some next status exists, return them. Return an empty array otherwise
	return (currentIndex >= states.length || currentIndex < 0) ? [] : states[currentIndex + 1];
}

module.exports = {
	getOhmById,
	getOhmByFields,
	updateOhmStatus,
	getStatusCodes,
	getNextStateByStatus
};
