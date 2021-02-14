const fs = require('fs');
fs.unlinkSync(`${__dirname}/../db.json`); //Be careful, we should use a specific db.test.json file

const utils = require('../src/utils');

describe('db return ohm', () => {
	test('returns existing Ohm object', async () => {
		expect(await utils.getOhmById('0')).toBeDefined(); //There was a typo here, maybe on purpose?
	});

	test('returns undefined', async () => {
		expect(await utils.getOhmById('9999')).toBeUndefined();
	});

	test('has a valid history', async () => {
		const ohm = await utils.getOhmById('1');
		const statuses = await utils.getStatusCodes();
		const isValidStatus = statuses.includes(ohm.history[0].state)
		expect(isValidStatus).toBe(true);
	});
});

describe('db update ohm', () => {
	test('returns updated Ohm object', async () => {
		expect((await utils.updateOhmStatus({
			id: '0'
		}, 'DELIVERED')).status).toEqual('DELIVERED');
	});
	test('returns non-updated Ohm object', async () => {
		expect((await utils.updateOhmStatus({
			id: '0'
		}, 'IN_DELIVERY')).status).toEqual('DELIVERED');
	});
});

describe('db return state / status', () => {
	test('returns all available status codes', async () => {
		expect(await utils.getStatusCodes()).toEqual(expect.arrayContaining([
			'CREATED',
			'PREPARING',
			'READY',
			'IN_DELIVERY',
			'DELIVERED',
			'REFUSED'
		]));
	});

	test('returns 1 next state as array', async () => {
		expect((await utils.getNextStateByStatus('CREATED')).length).toEqual(1);
	});

	test('returns 2 next state as array', async () => {
		expect((await utils.getNextStateByStatus('IN_DELIVERY')).length).toEqual(2);
	});

	test('returns empty array', async () => {
		expect((await utils.getNextStateByStatus('FAKE_CODE')).length).toEqual(0);
	});
});
