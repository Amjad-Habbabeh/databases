const util = require('util');
const mysql = require('mysql');
const fs=require('fs');
const config=JSON.parse(fs.readFileSync("config_secret.json"))

const connection = mysql.createConnection({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database
});

const execQuery = util.promisify(connection.query.bind(connection));

async function seedDatabase() {
  const CREATE_Research_Papers_TABLE = `
    CREATE TABLE IF NOT EXISTS Research_Papers (
      paper_id int Primary Key,
      paper_title varchar(50), 
      conference varchar(50),
      publish_date datetime
    );`;

// the realation between Authors table and research_papers table is M-M so i need to creat a bridge table :
    const  CREATE_Author_Research_Papers_TABLE = `
    CREATE TABLE IF NOT EXISTS Author_Research_Papers (
      
      author_id int not null,
      paper_id int not null,
      CONSTRAINT FK_paper FOREIGN KEY (paper_id) REFERENCES Research_Papers(paper_id),
      CONSTRAINT FK_author FOREIGN KEY (author_id) REFERENCES Authors(author_no),
      primary key(paper_id, author_id)
    ); ` ;

    

    const author_records=[
      [1,'Amjad','Homs','1985-1-06',20,'m',null],
      [2,'Ali','Homs','1988-1-06',23,'m',null],
      [3,'Kareem','Harward','1950-1-06',60,'m',null],[4,'Faten','Cairo','1995-1-06',20,'f',null],[5,'Koky','Damascus','1985-1-06',24,'f',null],[6,'Medina','Banjloka','1985-1-06',10,'f',null],[7,'Danjal','Alkmaar','1995-1-06',20,'m',null],[8,'Sam','Amsterdam','1975-1-06',35,'m',null],[9,'Amjad','Horn','1985-1-06',23,'m',null],[10,'Noor','Homs','1983-1-06',20,'F',null],[11,'Hassan','Allepo','1982-1-06',5,'m',null],[12,'Ali','Damascus','1987-1-06',30,'m',null],[13,'Amena','Hama','1996-1-06',10,'f',null],[14,'Alex','Amsterdam','2000-1-06',5,'m',null],
      [15,'Sara','Harward','1987-1-06',20,'f',null]
    ];

    const research_records=[
      [122,'Human Behavior',null,'2003-02-03'],[123,'Action anthropology',null,'2017-10-03'],
      [124,'Bioinformatics',null,'2000-10-03'],[125,'Acropolis',null,'2020-10-03'],
      [126,'Cave art',null,'2009-10-03'],[127,'Clovis culture',null,'2020-10-03'],
      [128,'Eoliths',null,'2003-10-03'],[129,'History of Anthropology',null,'2004-10-03'],
      [130,'Iron age',null,'2014-10-03'],[131,'Childhood',null,09/11/2015],
      [132,'Egalitarian societies',null,'2014-10-03'],[133,'Gypsies',null,'2001-10-03'],
      [134,'Inuit',null,'2016-10-03'],[135,'Labor',null,'2011-10-03'],
      [136,'Maasai',null,'1999-10-03'],[137,'Onas',null,'2019-10-03'],
      [138,'Quechua',null,'2019-05-14'],[139,'Structuralism',null,'2019-05-14'],
      [140,'Zande',null,'2018-05-14'],[141,'Extinction',null,'2017-05-14'],
      [142,'Extinct',null,'2017-05-14'],
      [143,'Fossils',null,'2019-11-21'],[144,'India and evolution',null,'2015-11-21'],
      [145,'Mass extinctions',null,'2019-11-21'],[146,'Homo habilis',null,'2013-11-21'],
      [147,'Animal language',null,'2020-11-21'],[148,'Culture',null,'2018-11-21'],
      [149,'Memes',null,'2018-11-21'],[150,'Types of language',null,'2012-11-21'],
      [151,'Washoe',null,'2008-11-21'],[152,'Graves',null,'1963-11-21']
    ];
    
    const authors_research_records=[[1,122],[2,123],[1,123],[2,124],[3,122],[4,123],[5,125],[6,125],[7,128],[1,127],[7,126],[8,129],[9,129],[10,130],[11,132],[12,131],[13,132],[14,133],[15,134],[6,135],[1,135],[1,136],[13,137],[11,138],[12,140],[12,139],[11,141],[5,142],[2,142],[6,143],[7,144],[8,145],[9,146],[8,147],[8,148],[3,149],[9,143],[10,142],[11,145],[13,141],[12,152],[3,150],[15,151]]
    const INSERT_collaborators=`
    UPDATE Authors 
    SET collaborator= 
    CASE author_no
            WHEN 1 THEN 6
            WHEN 2 THEN 4
            WHEN 3 THEN 1
            WHEN 5 THEN 2
            WHEN 9 THEN 7
            WHEN 13 THEN 11
       END
WHERE  author_no IN (1, 2, 3, 5, 9, 13);
    `
    
  connection.connect();

  try {
    // call the function that returns promise
    await execQuery( CREATE_Research_Papers_TABLE );
    await execQuery(CREATE_Author_Research_Papers_TABLE );
    author_records.forEach(async (record)=>{
      await execQuery('INSERT INTO Authors VALUES (?)', [record]);
    });

    research_records.forEach(async record=>{
      await execQuery('INSERT INTO Research_Papers VALUES (?)', [record]);
      });

      authors_research_records.forEach(async record=>{
        await execQuery('INSERT INTO author_research_papers VALUES (?)',[record]);
      })

     await execQuery(INSERT_collaborators); 
    //  await execQuery(INSERT_research_papers); 

  } catch (error) {
    console.error(error);
    connection.end();
  }

  connection.end();
}

seedDatabase();
