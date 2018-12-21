const mysql = require('mysql');
const mysqlconfig = require('./config/mysql');
const helper = require('./helper');
const dbmanager = {};

let conn = mysql.createConnection(mysqlconfig);
let sqlQueries = {
	selectAll: 'SELECT * FROM candidates',
	selectCandidateById: 'SELECT * FROM candidates WHERE id = ?',
	insertCandidate: 'INSERT INTO candidates SET ?',
	incrementVote: 'UPDATE candidates SET votes = votes + ?, last_modified = ? WHERE id = ?',
	deleteCandidate: 'DELETE FROM candidates WHERE id = ?'
};

dbmanager.connect = () => {
	conn.connect((err) => {
		if(!err) {
			console.log(`Connected to ${mysqlconfig.database}`);
		}
		else {
			console.log(err);
		}
	});
};

dbmanager.getAllCandidates = () => {
	let promise = new Promise((resolve, reject) => {
		console.log('select in db');
		conn.escape(sqlQueries.selectAll);
		conn.query(sqlQueries.selectAll, (err, rows, fields) => {
			if(err) {
				reject(err);
			}
			else {
				resolve(rows);
			}
		});
	});
	return promise;
};

dbmanager.selectCandidateById = (id) => {
	let promise = new Promise((resolve, reject) => {
		console.log(id);
		conn.query(sqlQueries.selectCandidateById, [ id ], (err, rows, fields) => {
			console.log(rows);
			if(err) {
				reject(err);
			}
			else {
				resolve(rows);
			}
		});
	});
	return promise;
};

dbmanager.insertCandidate = (candidate) => {
	let date = new Date().toISOString();
	candidate.date_created = date;
	candidate.last_modified = date;
	if(helper.validateCandidate(candidate)) {
		let promise = new Promise((resolve, reject) => {
			conn.query(sqlQueries.insertCandidate, candidate, (err, rows, fields) => {
				if(err) {
					reject(err);
				}
				else {
					resolve(rows.affectedRows);
				}
			});
		});
		return promise;
	}
	date = null;
	candidate = null;
};

dbmanager.incrementVote = (id) => {
	let promise = new Promise((resolve, reject) => {
		let date = new Date().toISOString();
		conn.query(sqlQueries.incrementVote, [ 1 , date, id], (err, rows, fields) => {
			if(err) {
				reject(err);
			}
			else {
				resolve(rows.changedRows);
			}
		});
	});
	return promise;
};

dbmanager.deleteCandidate = (id) => {
	let promise = new Promise((resolve, reject) => {
		conn.query(sqlQueries.deleteCandidate, [ id ], (err, rows, fields) => {
			if(err) {
				reject(err);
			}
			else {
				resolve(rows.affectedRows);
			}
		});
	});
	return promise;
};

module.exports = dbmanager;
