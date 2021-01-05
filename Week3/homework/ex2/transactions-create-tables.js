const util = require('util');
const mysql = require('mysql');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('config_secret.json'));

const connection = mysql.createConnection(config);

const execQuery = util.promisify(connection.query.bind(connection));

async function seedDatabase() {
  const createAccountTable = `
  CREATE TABLE IF NOT EXISTS Account (
    Account_no INT PRIMARY KEY,
    Balance FLOAT
  );`;
  const createAccountChangeTable = `
  CREATE TABLE IF NOT EXISTS Account_changes (
    Change_number INT PRIMARY KEY , 
    Account_number INT,
    Amount FLOAT,
    Changed_date DATE,
    Remark varchar(100),
    CONSTRAINT FOREIGN KEY (Account_number) REFERENCES Account(Account_no)
  );`;

  connection.connect();

  try {
    await execQuery(createAccountTable);
    await execQuery(createAccountChangeTable);
  } catch (error) {
    console.error(error);
    connection.end();
  }

  connection.end();
}

seedDatabase();
