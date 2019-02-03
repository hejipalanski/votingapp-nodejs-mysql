"use-strict"

const dbmanager = require('../db/dbmanager');
const hateoas = require('../hateos').hateoas;
const disqualifiedCandidatesID = require('../model/disqualifiedCandidates');

let errorResponse = { error: true };
let _candidateByIDMethodHandlers = {};

_candidateByIDMethodHandlers.GET = (reqData, resBody, writeResponse) => {
	if(reqData.id > -1) {
		resBody.links = hateoas.candidateGET;
		dbmanager.selectCandidateById(reqData.id)
			.then((row) => {
				if(row.length == 1) {
					resBody.candidate = row[0];
					writeResponse([200, JSON.stringify(resBody)]);
				}
				else {
					errorResponse.error_message = 'id does not exists';
					errorResponse.error_code = 1;
					writeResponse([200, JSON.stringify(errorResponse)]);
				}
		})
		.catch((err) => {
			errorResponse.error_message = `failed to retrieved candidate with id ${id}`;
			errorResponse.error_code = 2;
			writeResponse([200, JSON.stringify(errorResponse)]);
			console.log(err);
		});
	}
};

_candidateByIDMethodHandlers.PUT = (reqData, resBody, writeResponse) => {
	resBody.status = 'failed to update vote';
	if(!disqualifiedCandidatesID.includes(reqData.id)) {
		dbmanager.incrementVote(reqData.id)
		.then((changedRows) => {
			if(changedRows == 1) {
				resBody.status = 'vote added successfully';
				resBody.links = hateoas.candidatePUT;
				writeResponse([201, JSON.stringify(resBody)]);
			}
			else {
				errorResponse.error_message = 'candidate does not exists';
				errorResponse.error_code = 3;
				writeResponse([200, JSON.stringify(errorResponse)]);
			}
		})
		.catch((err) => {
			errorResponse.error_message = err;
			errorResponse.error_code = 4;
			writeResponse([500, JSON.stringify(errorResponse)]);
			console.log(err);
		});
	}
	else {
		errorResponse.error_message = 'candidate is disqualified';
		errorResponse.error_code = 5;
		writeResponse([200, JSON.stringify(errorResponse)]);
	}
};

_candidateByIDMethodHandlers.PATCH = (reqData, resBody, writeResponse) => {
	dbmanager.selectCandidateById(reqData.id)
	.then((row) => {
		if(row.length == 1) {
			let candidate = row[0];
			resBody.status = 'candidate disqualified';
			resBody.candidate = candidate;
			resBody.links = hateoas.candidatePATCH;
			disqualifiedCandidatesID.push(candidate.id);
			writeResponse([200, JSON.stringify(resBody)]);
		}
		else {
			errorResponse.error_message = 'id does not exists';
			errorResponse.error_code = 6;
			writeResponse([200, JSON.stringify(errorResponse)]);
		}
	})
	.catch((err) => {
		errorResponse.error_message = 'internal server error occured'
		errorResponse.error_code = 7;
		writeResponse([500, JSON.stringify(errorResponse)]);
		console.log(err);
	});
};

_candidateByIDMethodHandlers.DELETE = (reqData, writeResponse) => {
	resBody.status = 'failed to delete candidate';
	resBody.reason = 'id does not exists';
	dbmanager.deleteCandidate(reqData.id)
	.then((affectedRows) => {
		if(affectedRows == 1) {
			writeResponse([204]);
		}
		else {
			errorResponse.error_message = 'id does not exists';
			errorResponse.candidateId = reqData.id;
			errorResponse.error_code = 8;
			writeResponse([200, JSON.stringify(errorResponse)]);
		}
	})
	.catch((err) => {
		errorResponse.error_message = 'internal server error';
		errorResponse.error_code = 9;
		writeResponse([500, JSON.stringify(errorResponse)]);
		console.log(err);
	});
};

module.exports = _candidateByIDMethodHandlers;
