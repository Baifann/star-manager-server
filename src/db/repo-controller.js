const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const NAME_DB = 'repos';
const URL_MONGODB = 'mongodb://127.0.0.1:27017';

const initDB = function(callback) {
  MongoClient.connect(URL_MONGODB, (error, client) => {
    console.log('error===================', error);
    assert.equal(null, error);
    console.log('Connected successfully to server');
    const db = client.db(NAME_DB);
    callback(db, client);
  });
};

/**
 * 将tag和repo插入
 * { repoId, tags, userId }
 */
const insertRepoTags = function(tag) {
  return new Promise((reslove, reject) => {
    initDB((db, client) => {
      try {
        const collection = db.collection(NAME_DB);
        collection.insertMany([tag], (error, result) => {
          console.log('Inserted 1 tag into this repo collection');
          reslove(result);
        });
      } catch (error) {
        reject(error);
      } finally {
        client.close();
      }
    });
  });
};

/**
 * 通过userId更新它的repo tags
 */
const updateRepoTags = function(tags, repoId, userId) {
  return new Promise((reslove, reject) => {
    initDB((db, client) => {
      try {
        const collection = db.collection(NAME_DB);
        collection.updateOne({userId: userId, repoId}, {$set: {tags}}, (error, result) => {
          reslove(result);
        });
      } catch (error) {
        reject(error);
      } finally {
        client.close();
      }
    });
  });
};

const queryReposByUserId = function(userId) {
  return new Promise((reslove, reject) => {
    initDB((db, client) => {
      try {
        const collection = db.collection(NAME_DB);
        collection.find({'userId': userId}).toArray((error, tags) => {
          assert.equal(error, null);
          console.log('Found this following records');
          console.log(tags);
          reslove(tags);
        });
      } catch (error) {
        reject(error);
      } finally {
        client.close();
      }
    });
  });
};

// const tag = {repeoId: '很好', tags: [{tag: '呵呵'}, {tag: '呵呵123'}], userId: 123123};
// insertRepoTags(tag);

// (async() => {
//   const repos = await queryReposByUserId(123123);
//   console.log('query repos:', repos);
// })();

module.exports = {
  insertRepoTags,
  queryReposByUserId,
  updateRepoTags
};