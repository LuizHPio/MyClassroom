import { InsertOneResult } from "mongodb";
import { Assignment, BookUpdate, Webhook } from "../Classes/TasksInterfaces";
import { DatabaseClient } from "./DatabaseConnection";

export async function InsertAssignment(
  assignment: Assignment
): Promise<InsertOneResult> {
  let collection = DatabaseClient.collection("HOMEWORK");
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

export async function ExpireAssignment(assignment: Assignment) {
  let collection = DatabaseClient.collection(assignment.assignmentType);
  try {
    const filter = {
      _id: assignment._id,
    };

    const update = { $set: { expired: true } };

    await collection.updateOne(filter, update);
  } catch (err) {
    if (err instanceof Error) {
      return Promise.reject(new Error(err.message));
    } else return Promise.reject();
  }
}

export async function UpdateBook(update: BookUpdate) {
  let collection = DatabaseClient.collection("GUILDS");
  try {
    let document = await collection.findOne({
      guildId: update.guildId,
      "books.subject": update.subject,
    });
    if (document) {
      //Se já existe
      return collection.updateOne(
        { guildId: update.guildId, "books.subject": update.subject },
        { $set: { "books.$.chapter": update.chapter } },
        { upsert: true }
      );
    } else {
      // Se não existe
      return collection.updateOne(
        { guildId: update.guildId, "books.subject": { $ne: update.subject } },
        {
          $addToSet: {
            books: { subject: update.subject, chapter: update.chapter },
          },
        },
        { upsert: true }
      );
    }

    //Cria
    // return collection.updateOne(
    //   { guildId: update.guildId },
    //   {
    //     $set: { books: [{ subject: update.subject, chapter: update.chapter }] },
    //   },
    //   { upsert: true }
    // );
  } catch (err) {
    console.error(err);
  }
}
