const utils = require('../src/utils');

describe('db return ohm', () => {
	test('returns Ohm object if exists', () => {
		expect(utils.getOhmById('1')).toBeDefined(); //There was a typo here, maybe on purpose?
	});

	test('returns empty object if doesn\'t exist', () => {
		expect(utils.getOhmById('1')).toMatchObject({});
	});

	test('has a valid history', () => {
		const ohm = utils.getOhmById('1');
		const statuses = ['CREATED', 'PREPARING', 'READY', 'IN_DELIVERY', 'DELIVERED', 'REFUSED']
		const isValidStatus = statuses.includes(ohm.history[0].state)
		expect(isValidStatus).toBe(true);
	});
});
