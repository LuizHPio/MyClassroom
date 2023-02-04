import express from "express";
import bodyParser from "body-parser";
import helmet from "helmet";

const app = express();

app.use(helmet());
app.use(bodyParser.json());

app.listen(3000, () => {
  console.log("listening on port 3000");
});
