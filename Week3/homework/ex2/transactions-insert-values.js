const util = require('util');
const mysql = require('mysql');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('config_secret.json'));

const connection = mysql.createConnection(config);

const execQuery = util.promisify(connection.query.bind(connection));

async function seedDatabase() {
  const insertToAccount = `
  INSERT INTO Account(Account_no, Balance)
   VALUES
  (101,5000.50),
  (102,8000),
  (2040,10400)
  `;
  const insertToAccount_Change = `
  INSERT INTO Account_changes(Change_number,Account_number, Amount,Changed_date,Remark)
   VALUES
  (20,101,50,"2020/10/12","travel cost"),
  (21,102,4000,"2020/11/21","salary"),
  (22,2040,10400,"2020/12/12","house payment")
  `;

  connection.connect();

  try {
    await execQuery(insertToAccount);
    await execQuery(insertToAccount_Change);
  } catch (error) {
    console.error(error);
    connection.end();
  }

  connection.end();
}

seedDatabase();
