import axios from "axios";
import { getWebhooks } from "../MongoDB/Operations";

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

export async function NotifyWebhooks() {
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
        action: true,
      },
    };
    try {
      console.log(url);
      let response = await axios(options);
      console.log(response.status, response.statusText);
    } catch (error) {
      if (error instanceof Error) console.log(error.message);
    }
  });
}
