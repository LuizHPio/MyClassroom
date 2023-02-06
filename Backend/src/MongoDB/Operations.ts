import { Collection, InsertOneResult, Int32 } from "mongodb";
import { Assignment, Homework } from "../Classes/TasksInterfaces";
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
      return Promise.reject(
        new Error("Could not send assignment to database.")
      );
  }
  try {
    return await collection.insertOne(assignment);
  } catch (err) {
    if (err instanceof Error) {
      return Promise.reject(new Error(err.message));
    } else return Promise.reject();
  }
}
