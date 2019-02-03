"use strict";

const http = require('http');
const https = require('https');
const fs = require('fs');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const handlers = require('./handlers');
const helper = require('./helper');

const server = {
	httpPort: process.env.PORT || 8080,
	httpsPort: 8081
};

server.httpServer = http.createServer((req, res) => {
	unifiedServer(req, res);
});

const httpsOptions = {
	key: fs.readFileSync('./https/key.pem'),
	cert: fs.readFileSync('./https/cert.pem')
};

server.httpsServer = https.createServer(httpsOptions, (req, res) => {
	unifiedServer(req, res);
});

let unifiedServer = (req, res) => {
	let parsedUrl = url.parse(req.url, true);
	let route = helper.getRoute(parsedUrl.pathname);
	let queryStringObject = parsedUrl.query;

	let decoder = new StringDecoder('utf-8');
	let buffer = '';
	req.on('data', (packet) => {
		buffer += decoder.write(packet);
	});
	req.on('end', () => {
		buffer += decoder.end();
		let data = {
			pathname: parsedUrl.pathname,
			method: req.method,
			headers: req.headers,
			queryStringObject: queryStringObject,
			reqBody: buffer
		};
		let handler = handlers.notFound;
		if(typeof server.router[route] != 'undefined') {
			handler = server.router[route];
		}
		res.setHeader('Content-Type', 'application/json');
		handler(data, (resData) => {
			process.nextTick(() => {
				res.writeHead(resData[0]);
				if(resData[1]) {
					res.end(resData[1]);
					return;
				}
				res.end();
			});
		});
	});
};


server.init = () => {
	server.httpServer.listen(server.httpPort, () => {
		console.log(`HTTP server listening on port ${server.httpPort}`);
	});
	server.httpsServer.listen(server.httpsPort, () => {
		console.log(`HTTPS server listening on port ${server.httpsPort}`);
	});
};

server.router = {
	'/api': handlers.home,
	'/api/candidates': handlers.handleCandidates,
	'/api/candidates/:id': handlers.handleCandidateById
}

module.exports = server;
