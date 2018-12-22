const helper = {};

helper.getRoute = (requrl) => {
	let pattern = /\/(?:[1-9][0-9]{3}|[1-9][0-9]{2}|[1-9][0-9]|[1-9])$|\/(?:[1-9][0-9]{3}|[1-9][0-9]{2}|[1-9][0-9]|[1-9])\//g;
	let route = requrl.replace(pattern, '/:id');
	console.log(`ROUTE: ${route}`);
	return(route);
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

helper.addHATEOASLink = (rel, uri, method, contentType) => {
	let link = {
		rel,
		uri,
		method,
		contentType
	};
	return link;
};

let isNotUndefined = (candidate) => {
	if(candidate != null || typeof candidate != 'undefined') {
		return true;
	}
	return false;
};

let validateProperties = (candidate) => {
	let standardCandidateProperties = [ 'name', 'party', 'position_running_for',
		'votes', 'date_created', 'last_modified' ];
	let candidateProperties = Object.getOwnPropertyNames(candidate);
	candidateProperties.forEach(prop => {
		if(!standardCandidateProperties.includes(prop)) {
			return false;
		}
	});
	return true;
};

helper.validateCandidate = (candidate) => {
	if(isNotUndefined(candidate)) {
		if(validateProperties(candidate)) {	return true; }
	}
	return false;
};

module.exports = helper;
