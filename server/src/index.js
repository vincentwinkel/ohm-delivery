const shortid = require('shortid')
var express = require('express');
var app = express();
const bodyParser = require('body-parser');

const fs = require('fs');
fs.unlinkSync(`${__dirname}/../db.json`); //Be careful, it's only for DEV mode

const Utils = require('./utils');
app.use(bodyParser.json());

async function serve() {
	app.get('/ohms/:trackingId', async (req, res) => {
		const ohm = await Utils.getOhmByFields({
			trackingId: req.params.trackingId
		});
		if (!ohm) {
			res.status(404);
		}
		res.send(ohm);
	});

	app.put('/ohms/:trackingId/status', async (req, res) => {
		const ohm = await Utils.updateOhmStatus({
			trackingId: req.params.trackingId
		}, req.body.code, req.body.comment);
		if (!ohm) {
			res.status(404);
		}
		res.send(ohm);
	});

	app.listen(3000, () => console.log('listening on port 3000'));
}

serve();
