# votingapp-nodejs-mysql
This is a demo project I made which implements ReSTFUL API's in NODE JS.

1. Set up the database. Follow db-setup.txt
2. Initialize a new project with npm

FILES............................DESCRIPTION
./lib/config/mysql.js...........-contains database configuration.
./lib/sql/candidateTable.sql....- databse schema.
./lib/dbmanager.js..............- establishes connesction to database. It contains low level database queries.
./lib/server.js.................- http server, routes http requests to proper request handlers.
./lib/helper.js.................- contains helper functions.
db-setup.txt....................- instructions to setup databse.
app.js..........................- main entry point.

API's...........................METHOD.......DESCRIPTION
/api/candidates/add.............POST........- end point to add new candidate
/api/candidates/all.............GET.........- end point to retrieve candidate
/api/candidates/:id.............GET.........- end point to retrieve candidate by id
/api/candidates/:id/vote........PUT.........- end point to vote for a candidate by id
/api/candidates/:id/disqualify..PUT.........- end point to disqualify a candidate by id
/api/candidates/:id/remove......DELETE......- end point to delete a candidate by id

API's v2........................METHOD.......DESCRIPTION
/api/candidates.................POST.........-add new candidate
/api/candidates.................GET..........-retrieve all candidates
/api/candidates/:id............	GET..........-end point to retrieve candidate by id
/api/candidates/:id.............PUT..........-end point to vote for a candidate by id
/api/candidates/:id.............PATCH........-end point to disqualify a candidate by id
/api/candidates/:id.............DELETE.......-end point to delete a candidate by id
