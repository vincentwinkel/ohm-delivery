const utils = require('../src/utils');

describe('db return ohm', () => {
	test('returns existing Ohm object', () => {
		expect(utils.getOhmById('1')).toBeDefined(); //There was a typo here, maybe on purpose?
	});

	test('returns empty object', () => {
		expect(utils.getOhmById('1')).toMatchObject({});
	});

	test('has a valid history', () => {
		const ohm = utils.getOhmById('1');
		const statuses = ['CREATED', 'PREPARING', 'READY', 'IN_DELIVERY', 'DELIVERED', 'REFUSED']
		const isValidStatus = statuses.includes(ohm.history[0].state)
		expect(isValidStatus).toBe(true);
	});
});

describe('db return status', () => {
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
	test('returns 1 next status as array', async () => {
		expect(await utils.getNextStatus('CREATED')).toEqual(expect.arrayContaining([{
			code: 'PREPARING'
		}]));
	});

	test('returns 2 next status as array', async () => {
		expect(await utils.getNextStatus('IN_DELIVERY')).toEqual(expect.arrayContaining([{
			code: 'DELIVERED'
		}, {
			code: 'REFUSED'
		}]));
	});

	test('returns empty array', async () => {
		expect(await utils.getNextStatus('FAKE_CODE')).toEqual(expect.arrayContaining([]));
	});
});
