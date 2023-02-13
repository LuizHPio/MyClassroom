import { Homework, Essay } from "../Classes/TasksInterfaces";
import { InsertAssignment } from "../MongoDB/Operations";
import { NotifyWebhooks, NotNullish, scheduleMessage } from "../Utils/Utils";

export async function handleAssignmentInsert(
  req: any,
  res: any
): Promise<void> {
  let assignmentObject: Homework | Essay;
  switch (req.body.assignmentType) {
    case "HOMEWORK":
      if (!NotNullish([req.body.subject, req.body.pages])) {
        res.status(400).send({
          errorCode: "MISSING_PARAMS",
          message: "Request body is missing subject or pages parameters.",
        });
        return;
      }
      assignmentObject = new Homework(
        req.body.assignmentType,
        req.body.deadline,
        req.body.subject,
        req.body.pages
      );
      break;
    case "ESSAY":
      if (!NotNullish([req.body.prompt, req.body.genre])) {
        res.status(400).send({
          errorCode: "MISSING_PARAMS",
          message: "Request body is missing prompt or genre parameters.",
        });
        return;
      }
      assignmentObject = new Essay(
        req.body.assignmentType,
        req.body.deadline,
        req.body.prompt,
        req.body.genre
      );
      break;

    default:
      res.status(400).send({
        errorCode: "INVALID_ASSIGNMENT_TYPE",
        message: `assignmentType not found: ${req.body.assignmentType}`,
      });
      return;
  }
  try {
    await InsertAssignment(assignmentObject);
    scheduleMessage(assignmentObject);
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send({
      errorCode: "DB_ERROR",
      message: "Error inserting assignment into database.",
    });
  }
}
