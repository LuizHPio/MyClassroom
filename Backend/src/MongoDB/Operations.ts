import { InsertOneResult } from "mongodb";
import { Assignment, Webhook } from "../Classes/TasksInterfaces";
import { DatabaseClient } from "./DatabaseConnection";

export async function InsertAssignment(
  assignment: Assignment
): Promise<InsertOneResult> {
  let collection = DatabaseClient.collection("Default");
  switch (assignment.assignmentType) {
    case "HOMEWORK":
      collection = DatabaseClient.collection("Homework");
      break;

    case "ESSAY":
      collection = DatabaseClient.collection("Essay");
      break;

    default:
      return Promise.reject(new Error("Assignment type not found."));
  }
  try {
    return await collection.insertOne(assignment);
  } catch (err) {
    if (err instanceof Error) {
      return Promise.reject(new Error(err.message));
    } else return Promise.reject();
  }
}

export async function getWebhooks(): Promise<string[]> {
  let urlArray: string[] = [];
  let collection = DatabaseClient.collection("Webhooks");

  const cursor = collection.find();
  await cursor.forEach((myDoc) => {
    urlArray.push(myDoc.url);
  });

  return urlArray;
}

export async function WebhookCreation(webHookObject: Webhook) {
  let collection = DatabaseClient.collection("Webhooks");
  try {
    return await collection.insertOne(webHookObject);
  } catch (err) {
    if (err instanceof Error) {
      return Promise.reject(new Error(err.message));
    } else return Promise.reject();
  }
}
