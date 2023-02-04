import { Collection, InsertOneResult, Int32 } from "mongodb";
import { Assignment, Homework } from "../Classes/TasksInterfaces";
import { DatabaseClient } from "./DatabaseConnection";

export async function InsertAssignment(
  assignment: Assignment
): Promise<InsertOneResult> {
  let collection = DatabaseClient.collection("Default");
  switch (assignment.assingmentType) {
    case "HOMEWORK":
      collection = DatabaseClient.collection("Homework");
      break;

    case "ESSAY":
      collection = DatabaseClient.collection("Essay");
      break;

    default:
      return Promise.reject(
        new Error("Could not send assignment to database.")
      );
  }
  try {
    return await collection.insertOne(assignment);
  } catch (err) {
    return Promise.reject(new Error(err as any));
  }
}
