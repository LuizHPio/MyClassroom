import express from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import { RequestBody } from "./Classes/RequestsInterfaces";
import { Assignment, Essay, Homework } from "./Classes/TasksInterfaces";
import { getWebhooks, InsertAssignment } from "./MongoDB/Operations";
import {
  EpochDateObjectParse,
  NotifyWebhooks,
  NotNullish,
} from "./Utils/Utils";
import { handleAssignmentInsert } from "./Handles/AssignmentsHandlers";
import { HandleWebhook } from "./Handles/WebhookHandler";

const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/webhook", async (req: RequestBody, res) => {
  const payload = req.body;
  try {
    await HandleWebhook(payload, res);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    }
  }
});

app.post("/assignments", async (req: RequestBody, res) => {
  if (!NotNullish([req.body.deadline, req.body.assignmentType])) {
    res
      .status(400)
      .send("Request body lacks parameters(assignmentType or deadline)");
    return;
  }

  req.body.deadline = EpochDateObjectParse(req.body.deadline);

  try {
    await handleAssignmentInsert(req, res);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    }
  }
});

app.listen(3000, async () => {
  console.log("listening on port 3000");
});
