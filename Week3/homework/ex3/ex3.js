var mysql = require('mysql');

const conn = mysql.createConnection({
  host: 'localhost',
  user: 'hyfuser',
  password: 'hyfpassword',
  database: 'new_world',
  multipleStatements: true,
});

async function queryDatabase() {
  function getPopulation(Country, name, code, cb) {
    conn.query(
      `SELECT Population FROM ${Country} WHERE Name = '${name}' and code = "${code}" `,
      function (err, result) {
        if (err) cb(err);
        if (result.length == 0) cb(new Error('Not found'));
        cb(result[0]);
      }
    );
  }
  getPopulation(
    'Country',
    `Italy' or 2 = 2;show databases;select*from country where name='syria`,
    `SRY or 2=2; show databases;`,

    console.log
  );
}

queryDatabase();
