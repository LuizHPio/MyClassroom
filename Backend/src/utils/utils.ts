import schedule from "node-schedule";
import axios from "axios";
import { Assignment, BookUpdate, Homework } from "../Classes/TasksInterfaces";
import { ExpireAssignment, getWebhooks } from "../MongoDB/Operations";
import { DatabaseClient } from "../MongoDB/DatabaseConnection";

export function EpochDateObjectParse(epochString: string) {
  let epochNumber = Number(epochString);
  return new Date(epochNumber);
}

export async function NotifyWebhooks(assignment: Assignment) {
  let urlArray: string[] = await getWebhooks();

  urlArray.forEach(async (url) => {
    let options = {
      method: "POST",
      url: url,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
      data: assignment,
    };
    try {
      let response = await axios(options);
    } catch (error) {
      console.error(error);
    }
  });
}

export function scheduleMessage(assignmentObject: Assignment) {
  const job = schedule.scheduleJob(assignmentObject.deadline, () => {
    ExpireAssignment(assignmentObject).catch((err) => console.error(err));
    NotifyWebhooks(assignmentObject);
  });
}

export function scheduleBookNotification(body: BookUpdate) {
  const job = schedule.scheduleJob(
    EpochDateObjectParse(body.deadline),
    async () => {
      let urlArray: string[] = await getWebhooks();

      urlArray.forEach(async (url) => {
        let options = {
          method: "POST",
          url: url,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
          },
          data: {
            assignmentType: "BOOK",
            subject: body.subject,
            chapter: body.chapter,
          },
        };
        try {
          let response = await axios(options);
        } catch (error) {
          console.error(error);
        }
      });
    }
  );
  return job;
}

export async function databaseJobImport() {
  let collection = DatabaseClient.collection("HOMEWORK");
  let homeworks = collection.find({ expired: false });

  let currentDate = new Date();
  currentDate.setHours(13, 0, 0, 0);
  let currentTimestamp = currentDate[Symbol.toPrimitive]("number");

  homeworks.forEach((homework) => {
    let expireDate = new Date(homework.deadline);
    let expireTimestamp = expireDate[Symbol.toPrimitive]("number");

    let homeworkHasExpired = !(currentTimestamp < expireTimestamp);

    if (homeworkHasExpired) {
      const filter = { _id: homework._id };
      const update = { $set: { expired: true } };
      collection.findOneAndUpdate(filter, update);
    } else {
      let pagesArray = homework.pages;
      let pagesString = "";

      for (let i = 0; i < pagesArray.length; i++) {
        const e = pagesArray[i];
        if (i == pagesArray.length - 1) {
          pagesString += e.toString();
        } else {
          pagesString += e.toString() + ",";
        }
      }

      let assignment = new Homework(
        "HOMEWORK",
        homework.deadline,
        homework.subject,
        pagesString
      );
      scheduleMessage(assignment);
    }
  });
}
