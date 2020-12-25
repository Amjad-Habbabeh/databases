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
  const researchPapers_and_Thier_authors = `
    SELECT A.paper_id,count(A.author_id)
    FROM research_papers R 
    LEFT JOIN author_research_papers A
    ON A.paper_id = R.paper_id
    group by A.paper_id; `;

  const sumOf_female_researcher = `
    SELECT count(*) AS female_researcher FROM authors A
    JOIN author_research_papers R
    ON A.author_no = R.author_id
    WHERE gender='f' ;`;

  const averageOf_H_index_perUnive = `
    SELECT university,AVG(h_index)
    FROM authors
    GROUP BY university;
    `;
  const sumOf_researchPapers_perUnive = `
    SELECT university,count(R.paper_id) AS num_research_papers FROM authors A JOIN author_research_papers R
    ON A.author_no = R.author_id
    GROUP BY university;
    `;
  const minAndMax_Of_H_index_perUnive = `
    SELECT university,MAX(h_index),MIN(h_index)
    FROM authors
    GROUP BY university;
    `;

  connection.connect();
  execQuery(researchPapers_and_Thier_authors)
    .catch((err) => {
      throw err;
    })
    .then((results) => {
      console.log('research papers and the number of authors are:', results);
    });
  execQuery(sumOf_female_researcher)
    .catch((err) => {
      throw err;
    })
    .then((results) => {
      console.log(
        'the Sum of the research papers published by all female authors is:',
        results
      );
    });
  execQuery(averageOf_H_index_perUnive)
    .catch((err) => {
      throw err;
    })
    .then((results) => {
      console.log(
        'Average of the h-index of all authors per university is:',
        results
      );
    });
  execQuery(sumOf_researchPapers_perUnive)
    .catch((err) => {
      throw err;
    })
    .then((results) => {
      console.log(
        'Sum of the research papers of the authors per university is:',
        results
      );
    });
  execQuery(minAndMax_Of_H_index_perUnive)
    .catch((err) => {
      throw err;
    })
    .then((results) => {
      console.log(
        'Minimum and maximum of the h-index of all authors per university is:',
        results
      );
    });

  connection.end();
}

seedDatabase();
