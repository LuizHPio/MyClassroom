import { BookUpdate } from "../Classes/TasksInterfaces";
import { UpdateBook } from "../MongoDB/Operations";
import { scheduleBookNotification } from "../Utils/Utils";

export async function HandleBookUpdate(body: BookUpdate, res: any) {
  try {
    await UpdateBook(body);
    if (body.notify) scheduleBookNotification(body);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).send({
      errorCode: "DB_ERROR",
      message: "Error inserting assignment into database.",
    });
  }
}
