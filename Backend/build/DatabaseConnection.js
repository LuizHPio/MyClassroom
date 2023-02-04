"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const uri = "mongodb+srv://privateApiConnection:flvPD1xrTo8timic@cluster0.zxkreqk.mongodb.net/?retryWrites=true&w=majority";
const client = new mongodb_1.MongoClient(uri, {
    serverApi: mongodb_1.ServerApiVersion.v1,
});
client.connect();
const database = client.db("MyClassroom");
const Homework = database.collection("Homework");
const Essay = database.collection("Essay");
module.exports = {
    Homework,
    Essay,
};
