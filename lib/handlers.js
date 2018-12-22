const dbmanager = require('./dbmanager');
const helper = require('./helper');

dbmanager.connect();
const handlers = {};
let candidates;
let disqualifiedCandidatesID = [];
let notAllowedResponse = [405, JSON.stringify({error: 'method not allowed'})];

handlers.addCandidate = (reqData, writeResponse) => {
	if(reqData.method == 'POST') {
		let candidate = JSON.parse(normalise(reqData.reqBody));
		dbmanager.insertCandidate(candidate)
			.then((affectedRows) => {
				if(affectedRows == 1) {
					writeResponse([201, JSON.stringify({
						status: 'successfully added',
						candidate: candidate
					})]);
				}
				else {
					throw new Error();
				}
			})
			.catch((err) => {
				writeResponse([200, JSON.stringify({
					status: `failed to insert ${candidate}`
				})]);
				console.log(err);
			});
	}
	else {
		writeResponse(notAllowedResponse);
	}
};

handlers.getCandidateById = (reqData, writeResponse) => {
	if(reqData.method == 'GET') {
		let id = helper.getIDFromURL(reqData.pathname, 3);
		console.log(id);
		if(typeof id == 'number' && id > -1) {
			dbmanager.selectCandidateById(id)
				.then((row) => {
					if(row.length == 1) {
						writeResponse([200, JSON.stringify(row[0])]);
					}
					else {
						writeResponse([200, JSON.stringify({
							status: 'id does not exists'
						})]);
					}
				})
				.catch((err) => {
					writeResponse([200, JSON.stringify({
						status: `failed to retrieved candidate with id ${candicateId}`
					})]);
					console.log(err);
				});
		}
	}
	else {
		writeResponse(notAllowedResponse);
	}
};

handlers.getAllCandidates = (reqData, writeResponse) => {
	if(reqData.method == 'GET') {
		dbmanager.getAllCandidates()
			.then((rows) => {
				writeResponse([200, JSON.stringify(rows)]);
				if(candidates == 'undefined') {
					candidates = rows;
				}
			})
			.catch((err) => {
				writeResponse([200, JSON.stringify([])]);
				console.log(err);
			});
	}
	else {
		writeResponse(notAllowedResponse);
	}
};

handlers.voteCandidateById = (reqData, writeResponse) => {
	let candidateId = helper.getIDFromURL(reqData.pathname, 3);
	if(reqData.method == 'PUT' && typeof candidateId == 'number' && candidateId > -1) {
		let resBody = {
			status: 'failed to update vote',
			candidateId: candidateId,
		};
		if(!disqualifiedCandidatesID.includes(candidateId)) {
			dbmanager.incrementVote(candidateId)
				.then((changedRows) => {
					if(changedRows == 1) {
						resBody.status = 'vote added';
						writeResponse([201, JSON.stringify(resBody)]);
					}
					else {
						resBody.reason = 'candidate does not exists';
						writeResponse([200, JSON.stringify(resBody)]);
					}
				})
				.catch((err) => {
					resBody.reason = err;
					writeResponse([500, JSON.stringify(resBody)]);
					console.log(err);
				});
		}
		else {
			resBody.reason = 'candidate is disqualified';
			writeResponse([200, JSON.stringify(resBody)]);
		}
	}
	else {
		writeResponse(notAllowedResponse);
	}
};

handlers.disqualifyCandidate = (reqData, writeResponse) => {
	let id = helper.getIDFromURL(reqData.pathname, 3);
	let disqCandidate = {};
	candidates.forEach(candidate => {
		if(candidate.id == id) {
			disqualifiedCandidatesID.push(candidate.id);
			disqCandidate = candidate;
			return;
		}
	});
	writeResponse([200, JSON.stringify({
		status: 'candidate disqualified',
		candidate: disqCandidate
	})]);
}

handlers.deleteCandidate = (reqData, writeResponse) => {
	let id = helper.getIDFromURL(reqData.pathname, 3);
	if(reqData.method == 'DELETE' && typeof id == 'number' && id > -1) {
		let resBody = {
			status: 'failed to delete candidate',
			candidateId: id,
			reason: 'id does not exists'
		};
		dbmanager.deleteCandidate(id)
			.then((affectedRows) => {
				if(affectedRows == 1) {
					writeResponse([204]);
				}
				else {
					writeResponse([200, JSON.stringify(resBody)]);
				}
			})
			.catch((err) => {
				resBody.reason = 'error occured';
				writeResponse([500, JSON.stringify(err)]);
				console.log(err);
			});
	}
	else {
		writeResponse(notAllowedResponse);
	}
};

handlers.notFound = (reqData, writeResponse) => {
	writeResponse(404, JSON.stringify({
		status: 'resource unavailable'
	}));
};

let normalise = (data) => {
	let pattern = /positionRunningFor/g;
	return(data.replace(pattern, 'position_running_for'));
};

module.exports = handlers;
