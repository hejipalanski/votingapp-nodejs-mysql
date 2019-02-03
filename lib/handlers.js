"use strict";

const dbmanager = require('./db/dbmanager');
const helper = require('./helper');
const hateoas = require('./hateos').hateoas;
const _candidateByIDMethodHandlers = require('../lib/controllers/candidateByIdController');
const _candidatesMethodHandlers = require('../lib/controllers/candidatesController');

const handlers = {};
let notAllowedResponse = [405, JSON.stringify({error: 'method not allowed'})];
let errorResponse = { error: true };

handlers.home = (reqData, writeResponse) => {
	hateoas.HOME[0].method = reqData.method;
	let resBody = hateoas.HOME;
	writeResponse((reqData.method !== 'DELETE') ? [200, JSON.stringify(resBody)] : notAllowedResponse);
};

handlers.handleCandidateById = (reqData, writeResponse) => {
	reqData.id = helper.getIDFromURL(reqData.pathname, 3);
	let resBody = {};
	if(reqData.method) {
		_candidateByIDMethodHandlers[reqData.method](reqData, resBody, writeResponse);
		return;
	}
	else {
		writeResponse(notAllowedResponse);
	}
};

handlers.handleCandidates = (reqData, writeResponse) => {
	let resBody = {};
	if(reqData.method) {
		_candidatesMethodHandlers[reqData.method](reqData, resBody, writeResponse);
		return;
	}
	writeResponse(notAllowedResponse);
};

handlers.notFound = (reqData, writeResponse) => {
	errorResponse.error_message = 'resource not found';
	errorResponse.error_code = 14;
	writeResponse([404, JSON.stringify(errorResponse)]);
};

module.exports = handlers;
