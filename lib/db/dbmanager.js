"use strict";

const pool = require('./connection-pool');
const helper = require('../helper');
const dbmanager = {};

let sqlQueries = {
	selectAll: 'SELECT * FROM candidates',
	selectCandidateById: 'SELECT * FROM candidates WHERE id = ?',
	insertCandidate: 'INSERT INTO candidates SET ?',
	incrementVote: 'UPDATE candidates SET votes = votes + ?, last_modified = ? WHERE id = ?',
	deleteCandidate: 'DELETE FROM candidates WHERE id = ?'
};

let promise;

dbmanager.getAllCandidates = () => {
	promise = new Promise((resolve, reject) => {
		pool.getConnection((err, conn) => {
			if(!err) {
				console.log(conn.threadId);
				conn.escape(sqlQueries.selectAll);
				conn.query(sqlQueries.selectAll, (err, rows, fields) => {
				conn.release();
					if(err) {
						reject(err);
					}
					else {
						resolve(rows);
					}
				});
			}
			else {
				conn.release();
				console.log('DB not connected');
			}
		});
	});
	return promise;
};

dbmanager.selectCandidateById = (id) => {
	promise = new Promise((resolve, reject) => {
		pool.getConnection((err, conn) => {
			if(!err) {
				conn.query(sqlQueries.selectCandidateById, [ id ], (err, rows, fields) => {
					conn.release();
					if(!err) {
						resolve(rows);
					}
					else {
						reject(err);
					}
				});
			}
			else {
				conn.release();
				console.log(err);
			}
		});
	});
	return promise;
};

dbmanager.insertCandidate = (candidate) => {
	if(helper.isSchemaValid(candidate)) {
		promise = new Promise((resolve, reject) => {
			pool.getConnection((err, conn) => {
				if(!err) {
					let date = new Date().toISOString();
					candidate.date_created = date;
					candidate.last_modified = date;
					conn.query(sqlQueries.insertCandidate, candidate, (err, rows, fields) => {
						conn.release();
						if(!err) {
							resolve(rows.affectedRows);
						}
						else {
							reject(err);
						}
					});
				}
				else {
					conn.release();
					console.log(err);
				}
			});
		});
		return promise;
	}
};

dbmanager.incrementVote = (id) => {
	promise = new Promise((resolve, reject) => {
		let date = new Date().toISOString();
		pool.getConnection((err, conn) => {
			if(!err) {
				conn.query(sqlQueries.incrementVote, [ 1 , date, id], (err, rows, fields) => {
					conn.release();
					if(err) {
						reject(err);
					}
					else {
						resolve(rows.changedRows);
					}
				});
			}
			else {
				conn.release();
				console.log(err);
			}
		});
	});
	return promise;
};

dbmanager.deleteCandidate = (id) => {
	promise = new Promise((resolve, reject) => {
		pool.getConnection((err, conn) => {
			if(!err) {
				conn.query(sqlQueries.deleteCandidate, [ id ], (err, rows, fields) => {
					conn.release();
					if(err) {
						reject(err);
					}
					else {
						resolve(rows.affectedRows);
					}
				});
			}
			else{
				conn.release();
				console.log(err);
			}
		});
	});
	return promise;
};

module.exports = dbmanager;
