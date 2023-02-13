import { MongoClient, ServerApiVersion } from "mongodb";
require("dotenv").config({ path: "../.env" });

const uri = `mongodb+srv://privateApiConnection:${process.env.MONGODBPASSWORD}@cluster0.zxkreqk.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  serverApi: ServerApiVersion.v1,
});

client.connect();
export const DatabaseClient = client.db("MyClassroom");
