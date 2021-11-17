const sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('entire.db', () => {
  db.on('trace', function (item) {
    console.log('TRACE: ', item);
  });
});

db.serialize(function() {

  try {
    db.run(`
      CREATE TABLE if not exists invoice (
        invoice_number INTEGER PRIMARY KEY AUTOINCREMENT,
        reg VARCHAR,
        make VARCHAR,
        model VARCHAR,
        order_number VARCHAR,
        job_summary VARCHAR NOT NULL,
        total_amount DECIMAL NOT NULL,
        date_created VARCHAR
      )
    `);

    db.run(`
      CREATE TABLE if not exists item (
        description VARCHAR,
        amount DECIMAL,
        quantitiy SMALLINT,
        invoice_number INTEGER,
        FOREIGN KEY(invoice_number) REFERENCES invoice(invoice_number)
      )
    `);
  } catch (err) {
    console.error('Failed to create DBs: ', err);
  }

});

exports.closeDb = () => {
  console.log('Closing DB connection...')
  db.close();
};

exports.insert = ({
  table,
  reg,
  make,
  model,
  order_number,
  job_summary,
  total_amount, // calculate this
  date_created,
  callback = () => { console.warn('No callback function provided')},
} = {}) => {

  db.run(`INSERT INTO "${table}" (reg,make,model,order_number,job_summary,total_amount ,date_created) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      reg,
      make,
      model,
      order_number,
      job_summary,
      total_amount,
      date_created || Date.now(),
    ],
    callback
  );

};

db.on('trace', trace => {console.log('trace', trace)});
