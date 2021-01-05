const util = require('util');
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'hyfuser',
  password: 'hyfpassword',
  database: 'userdb',
});

const execQuery = util.promisify(connection.query.bind(connection));

async function seedDatabase() {
  const CREATE_Authors_TABLE = `
    CREATE TABLE IF NOT EXISTS Authors (
      author_no int Primary Key,
      author_name varchar(50), 
      university varchar(50),
      date_of_birth datetime,
       h_index int,
        gender ENUM('f','m')
    );`;

  const Add_COLUMN = `
    ALTER TABLE Authors
    ADD collaborator int ,
    ADD FOREIGN KEY (Collaborator) REFERENCES Authors(author_no);
    `;
  connection.connect();

  try {
    // call the function that returns promise
    await execQuery(CREATE_Authors_TABLE);
    await execQuery(Add_COLUMN);
  } catch (error) {
    console.error(error);
    connection.end();
  }

  connection.end();
}

seedDatabase();
