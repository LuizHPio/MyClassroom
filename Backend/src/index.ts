import express from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import { RequestBody } from "./Classes/RequestsInterfaces";
import {
  Assignment,
  BookUpdate,
  Essay,
  Homework,
} from "./Classes/TasksInterfaces";
import { getWebhooks, InsertAssignment } from "./MongoDB/Operations";
import {
  EpochDateObjectParse,
  NotifyWebhooks,
  NotNullish,
  scheduleBookNotification,
} from "./Utils/Utils";
import { handleAssignmentInsert } from "./Handles/AssignmentsHandlers";
import { HandleWebhook } from "./Handles/WebhookHandler";
import { HandleBookUpdate } from "./Handles/BookHandler";

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

app.post("/books", async (req: RequestBody, res) => {
  // let literal = {
  //   guildId: "680512375937695787",
  //   subject: "portuguese",
  //   chapter: 24,
  //   notify: true,
  //   deadline: 3129031823,
  // } as unknown;
  // let object = literal as BookUpdate;
  let funcbody = req.body as BookUpdate;
  HandleBookUpdate(funcbody, res);
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
