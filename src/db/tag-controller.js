const Mongodb = require('mongodb');
const MongoClient = Mongodb.MongoClient;
const assert = require('assert');

const NAME_DB = 'tags';
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
 * 插入tab
 */
const insertTag = function(tag) {
  return new Promise((reslove, reject) => {
    initDB((db, client) => {
      try {
        const collection = db.collection(NAME_DB);
        collection.insertMany([tag], (error, result) => {
          console.log('Inserted 1 tag into thie collection');
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
 * 通过用户id找到repo
 */
const queryRepoTagsByUserId = function(userId) {
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

/**
 * 通过id 更新标签的名称
 */
const updateRepoTagById = function(id, tag) {
  return new Promise((reslove, reject) => {
    initDB((db, client) => {
      try {
        const collection = db.collection(NAME_DB);
        collection.updateOne({_id: new Mongodb.ObjectID(id)}, {$set: {tag}}, (error, result) => {
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
 * 通过id 删除标签
 */
const deleteRepoTagById = function(id) {
  return new Promise((reslove, reject) => {
    initDB((db, client) => {
      try {
        const collection = db.collection(NAME_DB);
        collection.deleteMany({_id: new Mongodb.ObjectID(id)}, (error, result) => {
          if (error) {
            reject(error);
          } else {
            reslove(result);
          }
        });
      } catch (error) {
        reject(error);
      } finally {
        client.close();
      }
    });
  });
};

// const tag = {tagName: '很好', userId: 123123};
// insertTag(tag);

// (async() => {
//   const tags = await queryRepoTagsByUserId(123123);
//   console.log('query tags:', tags);
// })();

module.exports = {
  queryRepoTagsByUserId,
  insertTag,
  updateRepoTagById,
  deleteRepoTagById
};