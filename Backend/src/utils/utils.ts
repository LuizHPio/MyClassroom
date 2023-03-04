import schedule from "node-schedule";
import axios from "axios";
import { Assignment, BookUpdate } from "../Classes/TasksInterfaces";
import { ExpireAssignment, getWebhooks } from "../MongoDB/Operations";

export function EpochDateObjectParse(epochString: string) {
  let epochNumber = Number(epochString);
  return new Date(epochNumber);
}

export function NotNullish(variable: any[]): boolean {
  let notNullElements: boolean[] = [];
  for (let i = 0; i < variable.length; i++) {
    const element = variable[i];
    notNullElements.push(element !== null && element !== undefined);
  }
  return notNullElements.every(Boolean);
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
