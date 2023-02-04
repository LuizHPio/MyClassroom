"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseClient = void 0;
const mongodb_1 = require("mongodb");
const uri = "mongodb+srv://privateApiConnection:flvPD1xrTo8timic@cluster0.zxkreqk.mongodb.net/?retryWrites=true&w=majority";
const client = new mongodb_1.MongoClient(uri, {
    serverApi: mongodb_1.ServerApiVersion.v1,
});
client.connect();
exports.DatabaseClient = client.db("MyClassroom");
