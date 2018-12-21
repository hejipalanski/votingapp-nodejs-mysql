use candidatesdb;

CREATE TABLE IF NOT EXISTS candidates(
	id INT UNSIGNED NOT NULL AUTO_INCREMENT,
	name VARCHAR(30) NULL,
	party VARCHAR(30) NULL,
	position_running_for VARCHAR(30) NULL,
	votes INT DEFAULT 0,
	date_created VARCHAR(30) DEFAULT '',
	last_modified VARCHAR(30) DEFAULT '',
	PRIMARY KEY(id))
ENGINE = InnoDB;

INSERT INTO candidates (name, party, position_running_for)
	VALUES ('bong go', 'PDP', 'senator'),
	('general bato', 'PDP', 'senator'),
	('bam aquino', 'LP', 'senator'),
	('ping lacson', 'INDEPENDENT', 'senator'),
	('jua ponce enrile', 'INDEPENDENT', 'senator'),
	('antonio trillanes', 'LP', 'senator');