"use strict";

const helper = {};

helper.getRoute = (requrl) => {
	let idPattern = /\/\d+/g;
	let queryStringPattern = /\?.+/g;
	let route = requrl.replace(idPattern, '/:id');
	route = route.replace(queryStringPattern, '');
	return route;
};

helper.getIDFromURL = (requrl, index) => {
	try {
		let splittedURL = requrl.split('/');
		return parseInt(splittedURL[index]);
	}
	catch(error) {
		return -1;
	}
};

let isObject = (candidate) => {
	if(typeof candidate == 'object') {
		return true;
	}
	return false;
};

let isPropertiesValid = (candidate) => {
	let candidateProperties = Object.getOwnPropertyNames(candidate);
	if(candidateProperties.length < 1) {
		return false;
	}
	let standardCandidateProperties = [ 'name', 'party', 'position_running_for', 'votes', 'date_created', 'last_modified' ];
	for(let prop of candidateProperties) {
		if(!standardCandidateProperties.includes(prop)) {
			return false;
		}
	}
	return true;
};

helper.isSchemaValid = (candidate) => {
	if(isObject(candidate)) {
		if(isPropertiesValid(candidate)) {
			return true;
		}
	}
	return false;
};

module.exports = helper;
