const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
const db = require('./db');
const collection = 'city';

app.post('/', (req, res) => {
  const createRecord = {
    city_id: '50000',
    name: 'Masyaf',
    country_code: 'SYR',
    district: 'Hama',
    population: '40000',
  };
  db.getDB()
    .collection(collection)
    .insertOne(createRecord, (err, result) => {
      if (err) console.log(err);
      else res.json({ result: result, document: result.ops[0] });
    });
});

app.put('/:id', (req, res) => {
  const _id = req.params.id;
  db.getDB()
    .collection(collection)
    .findOneAndUpdate(
      { _id: db.getPrimaryKey(_id) },
      { $set: { population: 80000 } },
      { returnOrginal: false },
      (err, result) => {
        if (err) console.log(err);
        else res.json(result);
      }
    );
});


app.get('/:id', (req, res) => {
  // if the valeu = city Name or the country_code the search will happen
  const Value = req.params.id;
  db.getDB()
    .collection(collection)
    .find({ $or: [{ name: Value }, { country_code: Value }] })
    .toArray((err, document) => {
      if (err) console.log(err);
      else {
        console.log(document);
        res.json(document);
      }
    });
});

app.delete('/:id', (req, res) => {
  const id = req.params.id;
  db.getDB()
    .collection(collection)
    .findOneAndDelete({ _id: db.getPrimaryKey(id) }, (err, result) => {
      if (err) console.log(err);
      else res.json(result);
    });
});

db.connect((err) => {
  if (err) {
    console.log('unable to connect to databases ');
    process.exit(1);
  } else {
    app.listen(3000, () => {
      console.log('connecting to database , app listening to port 3000');
    });
  }
});
