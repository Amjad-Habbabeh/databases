const util = require('util');
const mysql = require('mysql');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('config_secret.json'));

const connection = mysql.createConnection(config);

const execQuery = util.promisify(connection.query.bind(connection));

async function seedDatabase() {
  connection.connect();

  try {
    await execQuery('BEGIN ');
    await execQuery(
      'UPDATE Account SET Balance = Balance-1000 WHERE Account_no = 101'
    );
    await execQuery(
      'UPDATE Account SET Balance = Balance+1000 WHERE Account_no = 102'
    );

    await execQuery(`
      INSERT INTO Account_changes(Change_number,Account_number, Amount,Changed_date,Remark)
      VALUES
     (23,101,1000,"2020/12/28","transfeer 1000");`);
    await execQuery(`
    INSERT INTO Account_changes(Change_number,Account_number, Amount,Changed_date,Remark)
    VALUES
   (24,102,1000,"2020/12/28","Dept 1000");
    `);

    await execQuery('COMMIT');
  } catch (error) {
    console.error(error);
    await execQuery('ROLLBACK');
    connection.end();
  }

  connection.end();
}

seedDatabase();
