const helper = require('./helper');

console.log('initialize hateoas');
let contentTypes = [
	'application/json',
	'application/xml',
	'text/html'
];

let httpMethods = { 
	get:'GET',
	post:'POST',
	put:'PUT',
	patch:'PATCH',
	delete:'DELETE'
};

let uri = [
	'api',
	'api/candidates',
	'api/candidates/:id',
];

let addHATEOASLink = (rel, uri, method, contentType = contentTypes[0]) => {
	let link = {
		rel,
		uri,
		method,
		contentType
	};
	return link;
};

const hateoas = {
	HOME: [
		addHATEOASLink('self', uri[0], httpMethods.get),
		addHATEOASLink('candidate', uri[1], httpMethods.get),
		addHATEOASLink('candidates', uri[2], httpMethods.get)
	],
	candidatesGET: [
		addHATEOASLink('self',  uri[2], httpMethods.get),
		addHATEOASLink('add', uri[1], httpMethods.post)
	],
	candidatesPOST: [
		addHATEOASLink('self', uri[1], httpMethods.post),
		addHATEOASLink('retrieve', uri[2], httpMethods.get)
	],
	candidateGET: [
		addHATEOASLink('self', uri[2], httpMethods.get),
		addHATEOASLink('vote', uri[2], httpMethods.put),
		addHATEOASLink('disqualify', uri[2], httpMethods.put),
		addHATEOASLink('delete', uri[2], httpMethods.delete)
	],
	candidatePUT: [
		addHATEOASLink('self', uri[2], httpMethods.put),
		addHATEOASLink('retrieve', uri[2], httpMethods.get),
		addHATEOASLink('disqualify', uri[2], httpMethods.put),
		addHATEOASLink('delete', uri[2], httpMethods.delete)
	],
	candidatePATCH: [
		addHATEOASLink('self', uri[2], httpMethods.patch),
		addHATEOASLink('vote', uri[2], httpMethods.put),
		addHATEOASLink('retrieve', uri[2], httpMethods.get),
		addHATEOASLink('delete', uri[2], httpMethods.delete)
	]
};

module.exports.hateoas = hateoas;
module.exports.httpMethods = httpMethods;
