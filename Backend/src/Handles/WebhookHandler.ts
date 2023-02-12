import { Webhook } from "../Classes/TasksInterfaces";
import { WebhookCreation } from "../MongoDB/Operations";

export async function HandleWebhook(payload: any, res: any) {
  let url = payload.url.match(
    /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}[\.\:][a-zA-Z0-9()]{1,6}\b\/?$/
  );

  if (!payload.url) {
    res.status(400).send({
      errorCode: "MISSING_PARAMS",
      message: "Request body is missing URL parameter.",
    });
    return;
  }

  if (!url) {
    res.status(400).send({
      errorCode: "INVALID_PARAMS",
      message: "URL parameter provided is not a url.",
    });
    return;
  }

  const webHookObject = new Webhook(`${url}/webhook`);

  try {
    await WebhookCreation(webHookObject);
    res.sendStatus(200);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    }
  }
}
