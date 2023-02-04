import express from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import { RequestBody } from "./Classes/RequestsInterfaces";
import { Assignment, Essay, Homework } from "./Classes/TasksInterfaces";
import { InsertAssignment } from "./MongoDB/Operations";
import { EpochDateObjectParse, NotNullish } from "./Utils/Utils";
import { handleAssignmentInsert } from "./Handles/AssignmentsHandlers";

const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/assignments", async (req: RequestBody, res) => {
  let body = req.body;
  if (!NotNullish([req.body.deadline, req.body.assignmentType])) {
    res
      .status(400)
      .send("Request body lacks parameters(assignmentType or deadline)");
    return;
  }

  body.deadline = EpochDateObjectParse(body.deadline);

  try {
    await handleAssignmentInsert(req, res);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send(error.message);
    }
  }

  // if (body.assignmentType == "HOMEWORK") {
  //   let requestedHomework = body as Homework;
  // await InsertAssignment(requestedHomework)
  //   .then(() => {
  //     res.sendStatus(200);
  //   })
  //   .catch((err) => {
  //     res.send(err);
  //   });
  // } else if (body.assignmentType == "ESSAY") {
  //   let requestedHomework = body as Essay;
  //   await InsertAssignment(requestedHomework)
  //     .then(() => {
  //       res.sendStatus(200);
  //     })
  //     .catch((err) => {
  //       res.send(err);
  //     });
  // } else {
  //   res.status(400).send("Non existent assignment type");
  // }
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});
