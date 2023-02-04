import { Homework, Essay } from "../Classes/TasksInterfaces";
import { InsertAssignment } from "../MongoDB/Operations";
import { NotNullish } from "../Utils/Utils";

export async function handleAssignmentInsert(
  req: any,
  res: any
): Promise<void> {
  let assignmentObject: Homework | Essay;
  switch (req.body.assignmentType) {
    case "HOMEWORK":
      if (!NotNullish([req.body.subject, req.body.pages])) {
        throw new Error("Request body lacks parameters(subject or pages)");
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
        throw new Error("Request body lacks parameters(prompt or genre)");
      }
      assignmentObject = new Essay(
        req.body.assignmentType,
        req.body.deadline,
        req.body.prompt,
        req.body.genre
      );
      break;

    default:
      throw new Error(`assignmentType not found: ${req.body.assignmentType}`);
  }
  try {
    await InsertAssignment(assignmentObject);
    res.sendStatus(200);
  } catch (err) {
    throw err;
  }
}
