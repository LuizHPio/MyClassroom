import { Homework, Essay, Assignment } from "../Classes/TasksInterfaces";
import { InsertAssignment } from "../MongoDB/Operations";
import { scheduleMessage } from "../Utils/Utils";

export async function handleAssignmentInsert(
  req: any,
  res: any
): Promise<void> {
  let assignmentObject: any = {};
  if (!req.body.assignmentType) {
    res.status(400).send({
      errorCode: "MISSING_PARAMS",
      message: "Request body is missing subject or pages parameters.",
    });
  }
  switch (req.body.assignmentType) {
    case "HOMEWORK":
      try {
        assignmentObject = new Homework(
          req.body.assignmentType,
          req.body.deadline,
          req.body.subject,
          req.body.pages
        );
      } catch (error: any) {
        res.status(400).send(error.message);
        return;
      }

      break;
    case "ESSAY":
      try {
        assignmentObject = new Essay(
          req.body.assignmentType,
          req.body.deadline,
          req.body.prompt,
          req.body.genre
        );
      } catch (error: any) {
        res.status(400).send(error.message);
        return;
      }
      break;

    default:
      res.send({
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
