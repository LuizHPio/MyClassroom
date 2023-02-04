import express from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import { RequestBody } from "./Classes/RequestsInterfaces";
import { Essay, Homework } from "./Classes/TasksInterfaces";
import { InsertAssignment } from "./MongoDB/Operations";

const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/assignments", async (req: RequestBody, res) => {
  let body = req.body;

  let epoch = Number(body.deadline);
  let date = new Date(epoch);
  body.deadline = date;

  if (body.assingmentType == "HOMEWORK") {
    let requestedHomework = body as Homework;
    await InsertAssignment(requestedHomework)
      .then(() => {
        res.sendStatus(200);
      })
      .catch((err) => {
        res.send(err);
      });
  } else if (body.assingmentType == "ESSAY") {
    let requestedHomework = body as Essay;
    await InsertAssignment(requestedHomework)
      .then(() => {
        res.sendStatus(200);
      })
      .catch((err) => {
        res.send(err);
      });
  } else {
    res.status(400).send("Non existent assignment type");
  }
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});
