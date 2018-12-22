const dbmanager = require('./dbmanager');
const helper = require('./helper');

dbmanager.connect();
const handlers = {};
let disqualifiedCandidatesID = [];
let notAllowedResponse = [405, JSON.stringify({error: 'method not allowed'})];
let httpMethods = { get:'GET', post:'POST', put:'PUT', patch:'PATCH', delete:'DELETE' };
let errorResponse = { error: true };

handlers.home = (reqData, writeResponse) => {
	let resBody = { links: [] };
	resBody.links.push(helper.addHATEOASLink('self', 'api/', reqData.method, 'application/json'));
	resBody.links.push(helper.addHATEOASLink('candidates', 'api/candidates', httpMethods.get, 'application/json'));
	resBody.links.push(helper.addHATEOASLink('candidates', 'api/candidates', httpMethods.post, 'application/json'));
	resBody.links.push(helper.addHATEOASLink('candicate', 'api/candidates/:id', httpMethods.get, 'application/json'));
	resBody.links.push(helper.addHATEOASLink('candicate', 'api/candidates/:id', httpMethods.put, 'application/json'));
	resBody.links.push(helper.addHATEOASLink('candidate', 'api/candidates/:id', httpMethods.patch, 'application/json'));
	resBody.links.push(helper.addHATEOASLink('candidate', 'api/candidates/:id', httpMethods.delete, 'application/json'));
	writeResponse([200, JSON.stringify(resBody)]);
};

handlers.handleCandidateById = (reqData, writeResponse) => {
	let id = helper.getIDFromURL(reqData.pathname, 3);
	let resBody = { links: [] };
	switch (reqData.method) {
		case httpMethods.get:
			console.log(id);
			if(typeof id == 'number' && id > -1) {
				dbmanager.selectCandidateById(id)
					.then((row) => {
						if(row.length == 1) {
							resBody.links.push(helper.addHATEOASLink('self', 'api/candidates/:id', httpMethods.get, 'application/json'));
							resBody.links.push(helper.addHATEOASLink('candicate', 'api/candidates/:id', httpMethods.put, 'application/json'));
							resBody.links.push(helper.addHATEOASLink('candidate', 'api/candidates/:id', httpMethods.patch, 'application/json'));
							resBody.links.push(helper.addHATEOASLink('candidate', 'api/candidates/:id', httpMethods.delete, 'application/json'));
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
			break;
		case httpMethods.put:
			resBody.status = 'failed to update vote';
			if(!disqualifiedCandidatesID.includes(id)) {
				dbmanager.incrementVote(id)
					.then((changedRows) => {
						if(changedRows == 1) {
							resBody.status = 'vote added successfully';
							resBody.links.push(helper.addHATEOASLink('self', 'api/candidates/:id', httpMethods.put, 'application/json'));
							resBody.links.push(helper.addHATEOASLink('candidate', 'api/candidates/:id', httpMethods.patch, 'application/json'));
							resBody.links.push(helper.addHATEOASLink('candidate', 'api/candidates/:id', httpMethods.get, 'application/json'));
							resBody.links.push(helper.addHATEOASLink('candidate', 'api/candidates/:id', httpMethods.delete, 'application/json'));
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
			break;
		case httpMethods.patch:
			dbmanager.selectCandidateById(id)
				.then((row) => {
					if(row.length == 1) {
						let candidate = row[0];
						resBody.status = 'candidate disqualified';
						resBody.candidate = candidate;
						resBody.links.push(helper.addHATEOASLink('self', 'api/candidates/:id', httpMethods.patch, 'application/json'));
						resBody.links.push(helper.addHATEOASLink('candidate', 'api/candidates/:id', httpMethods.get, 'application/json'));
						resBody.links.push(helper.addHATEOASLink('candidate', 'api/candidates/:id', httpMethods.put, 'application/json'));
						resBody.links.push(helper.addHATEOASLink('candidate', 'api/candidates/:id', httpMethods.delete, 'application/json'));
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
			break;
		case httpMethods.delete:
			resBody.status = 'failed to delete candidate';
			resBody.reason = 'id does not exists';
			dbmanager.deleteCandidate(id)
				.then((affectedRows) => {
					if(affectedRows == 1) {
						writeResponse([204]);
					}
					else {
						errorResponse.error_message = 'id does not exists';
						errorResponse.candidateId = id;
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
			break;
		default:
				writeResponse(notAllowedResponse);
			break;
	}
};

handlers.handleCandidates = (reqData, writeResponse) => {
	let resBody = { links: [] };
	switch (reqData.method) {
		case httpMethods.get:
			dbmanager.getAllCandidates()
			.then((rows) => {
				resBody.result = rows;
				resBody.links.push(helper.addHATEOASLink('self', 'api/candidates', httpMethods.get, 'application/json'));
				resBody.links.push(helper.addHATEOASLink('candidates', 'api/candidates', httpMethods.post, 'application/json'));
				writeResponse([200, JSON.stringify(resBody)]);
			})
			.catch((err) => {
				errorResponse.error_message = 'internal server error';
				errorResponse.error_code = 10;
				writeResponse([500, JSON.stringify(errorResponse)]);
				console.log(err);
			});
			break;
		case httpMethods.post:
			let candidate = JSON.parse(normalise(reqData.reqBody));
			dbmanager.insertCandidate(candidate)
				.then((affectedRows) => {
					if(affectedRows == 1) {
						resBody.status = 'successfully added';
						resBody.candidate = candidate;
						resBody.links.push(helper.addHATEOASLink('self', 'api/candidates', httpMethods.post, 'application/json'));
						resBody.links.push(helper.addHATEOASLink('candidates', 'api/candidates', httpMethods.get, 'application/json'));
						writeResponse([201, JSON.stringify(resBody)]);
					}
					else {
						errorResponse.error_message = 'failed to add candidate';
						errorResponse.error_code = 11;
						writeResponse([200, JSON.stringify(errorResponse)]);
					}
				})
				.catch((err) => {
					errorResponse.error_message = `internal server error 
						failed to insert ${candidate}`;
					errorResponse.error_code = 12;
					writeResponse([500, JSON.stringify(errorResponse)]);
					console.log(err);
				});
			break;
		default:
			writeResponse(notAllowedResponse);
			break;
	}
};

handlers.notFound = (reqData, writeResponse) => {
	errorResponse.error_message = 'resource not found';
	errorResponse.error_code = 13;
	writeResponse([404, JSON.stringify(errorResponse)]);
};

let normalise = (data) => {
	if(data != 'undefined') {
		let pattern = /positionRunningFor/g;
		return(data.replace(pattern, 'position_running_for'));
	}
};

module.exports = handlers;
