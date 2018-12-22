const http = require('http');
const url = require('url');
const handlers = require('./handlers');
const helper = require('./helper');

const server = {
	port: 8080
};

server.httpServer = http.createServer((req, res) => {
	let parsedUrl = url.parse(req.url, true);
	let route = helper.getRoute(parsedUrl.pathname);
	let queryStringObject = parsedUrl.query;

	let buffer = '';
	req.on('data', (packet) => {
		buffer += packet.toString();
	});
	req.on('end', () => {
		let data = {
			pathname: parsedUrl.pathname,
			method: req.method,
			headers: req.headers,
			queryStringObject: queryStringObject,
			reqBody: buffer
		};
		let handler = handlers.notFound;
		if(typeof server.router[route] !== 'undefined') {
			handler = server.router[route];
		}
		handler(data, (resData) => {
			res.setHeader('Content-Type', 'application/json');
			res.writeHead(resData[0]);
			if(resData[1] != 'undefined') {
				res.end(resData[1]);
			}
			else {
				res.end();
			}
		});
	});
});

server.init = () => {
	server.httpServer.listen(server.port, () => {
		console.log(`HTTP server listening on port ${server.port}`);
	});
};

server.router = {
	'/api': handlers.home,
	'/api/candidates': handlers.handleCandidates,
	'/api/candidates/:id': handlers.handleCandidateById
}

module.exports = server;
