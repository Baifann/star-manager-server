const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const NAME_DB = 'documents';
const URL_MONGODB = 'mongodb://127.0.0.1:27017';

MongoClient.connect(URL_MONGODB, (error, client) => {
  console.log('error===================', error);
  assert.equal(null, error);
  console.log('Connected successfully to server');
  const db = client.db(NAME_DB);

  insertDocuments(db, () => {
    indexCollection(db, () => {
      findDocuments(db, () => {
        client.close();
      });
    });
  });
});

const insertDocuments = function(db, callback) {
  const collection = db.collection(NAME_DB);
  collection.insertMany([{a: 1}, {a: 2}, {a: 3, b: 4}], (error, result) => {
    assert.equal(error, null);
    assert.equal(3, result.result.n);
    assert.equal(3, result.ops.length);
    console.log('Inserted 3 documents into thie collection');

    callback(result);
  });
};

const findDocuments = function(db, callback) {
  const collection = db.collection('documents');

  collection.find({}).toArray((error, docs) => {
    assert.equal(error, null);
    console.log('Found this following records');
    console.log(docs);
    callback(callback);
  });
};

const findDocumentBySpec = function(db, callback) {
  const collection = db.collection('documents');

  collection.find({'b': 4}).toArray((error, docs) => {
    assert.equal(error, null);
    console.log('Found the following records');
    console.log(docs);
    callback(docs);
  });
};

const updateDocument = function(db, callback) {
  const collection = db.collection('documents');

  collection.updateOne({a: 2}, {$set: {b: 4}}, (error, result) => {
    assert.equal(error, null);
    console.log('Updated the doucment width the field a equal to 2');
    callback(result);
  });
};

const removeDocument = function(db, callback) {
  const collection = db.collection('documents');

  collection.deleteOne({a: 3}, (error, result) => {
    assert.equal(error, null);

    console.log('Removed the document with the field a equal to 3');
    callback(result);
  });
};

const indexCollection = function(db, callback) {
  const collection = db.collection('documents');

  collection.createIndex({'a': 1}, null, (error, result) => {
    console.log(result);
    callback();
  });
};