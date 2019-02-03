"use-strict"

const dbmanager = require('../db/dbmanager');
const helper = require('../helper');
const hateoas = require('../hateos').hateoas;

let errorResponse = { error: true };
let _candidatesMethodHandlers = {};

_candidatesMethodHandlers.GET = (reqData, resBody, writeResponse) => {
	dbmanager.getAllCandidates()
	.then((rows) => {
		resBody.result = rows;
		resBody.links = hateoas.candidatesGET;
		writeResponse([200, JSON.stringify(resBody), start]);
	})
	.catch((err) => {
		errorResponse.error_message = 'internal server error';
		errorResponse.error_code = 10;
		writeResponse([500, JSON.stringify(errorResponse), start]);
		console.log(err);
	});
};

_candidatesMethodHandlers.POST = (reqData, resBody, writeResponse) => {
	let candidate;
	try {
		candidate = JSON.parse(normalise(reqData.reqBody));
	} catch (error) {
		candidate = {};
	}
	if(helper.isSchemaValid(candidate)) {
		dbmanager.insertCandidate(candidate)
		.then((affectedRows) => {
			if(affectedRows == 1) {
				resBody.status = 'successfully added';
				resBody.candidate = candidate;
				resBody.links = hateoas.candidatesPOST;
				writeResponse([201, JSON.stringify(resBody), start]);
			}
			else {
				errorResponse.error_message = 'failed to add candidate';
				errorResponse.error_code = 11;
				writeResponse([200, JSON.stringify(errorResponse), start]);
			}
		})
		.catch((err) => {
			errorResponse.error_message = `internal server error failed to insert ${candidate}`;
			errorResponse.error_code = 12;
			writeResponse([500, JSON.stringify(errorResponse), start]);
			console.log(err);
		});
	}
	else {
		errorResponse.error_message = 'invalid schema';
		errorResponse.error_code = 13;
		writeResponse([200, JSON.stringify(errorResponse), start]);
	}
};

let normalise = (data) => {
	if(data) {
		let pattern = /positionRunningFor/g;
		return(data.replace(pattern, 'position_running_for'));
	}
};

module.exports = _candidatesMethodHandlers;
