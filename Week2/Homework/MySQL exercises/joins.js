const util = require('util');
const mysql = require('mysql');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('config_secret.json'));

const connection = mysql.createConnection({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database,
});

const execQuery = util.promisify(connection.query.bind(connection));

async function seedDatabase() {
  const names_Authors_and_Collaborators = `
  
    SELECT A.author_name , B.author_name AS collaborator_name FROM authors A     
    LEFT JOIN authors B 
    ON A.collaborator=B.author_no ;`;

  // the relation between Authors table and research_papers table is M-M so i need to creat a bridge table :
  const Authors_and_their_pubished_paper_title = `
    SELECT A.*,R.paper_title
  FROM authors A left join author_research_papers B on A.author_no=B.author_id
  LEFT JOIN research_papers R
  ON B.paper_id=R.paper_id `;

  connection.connect();

  try {
    const res = await execQuery(names_Authors_and_Collaborators);
    console.log('names_Authors_and_Collaborators', res);

    const res2 = await execQuery(Authors_and_their_pubished_paper_title);
    console.log('Authors_and_their_pubished_paper_title:', res2);
  } catch (error) {
    console.error(error);
    connection.end();
  }
  connection.end();
}

seedDatabase();
