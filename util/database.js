const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db; // Be used in this file

const mongoConnect = (callback) => {
  MongoClient.connect(
    "mongodb+srv://osama:ZuC112F6FpLFrBhs@cluster0.wk4eo.mongodb.net/Node-MonogDB?retryWrites=true&w=majority"
  )
    .then((client) => {
      console.log("Connected TO MongoDB");
      _db = client.db();
      callback();
    })
    .catch((error) => {
      console.log(error);
      throw error;
    });
};

const getdb = () => {
  if (_db) {
    return _db;
  }
  throw "No Database Found!";
};

exports.mongoConnect = mongoConnect;
exports.getdb = getdb;
