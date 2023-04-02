import { ObjectId } from "mongodb";

const validAssignments = ["HOMEWORK", "ESSAY"] as const;

type ValidAssignments = typeof validAssignments[number];

/**
 * Base assignment object
 *
 * @param assignmentType - The type of this assignment, can be one of "ValidAssignments".
 * @param deadline - The time this assignment will expire, is a javascript Date object.
 *
 */
export class Assignment {
  public _id: ObjectId;
  public expired: boolean;
  public assignmentType: ValidAssignments;
  public deadline: Date;

  protected constructor(assignmentType: ValidAssignments, deadline: Date) {
    if (validAssignments.indexOf(assignmentType) == -1) {
      throw new Error(
        `Tried to assign invalid value to variable in constructor ${assignmentType}`
      );
    } else {
      this.assignmentType = assignmentType;
    }
    this._id = new ObjectId();

    if (!deadline) {
      throw new Error("Request is missing deadline parameter");
    }

    this.deadline = deadline;
    this.expired =
      Date.now() >= deadline[Symbol.toPrimitive]("number") ? true : false;
  }
}

export class Homework extends Assignment {
  public subject: string;
  public pages: number[];

  public constructor(
    assignmentType: ValidAssignments,
    deadline: Date,
    subject: string,
    pages: string
  ) {
    if (!deadline) {
      throw new Error("Request is missing deadline parameter");
    }
    if (!subject) {
      throw new Error("Request is missing subject parameter");
    }
    if (!pages) {
      throw new Error("Request is missing pages parameter");
    }
    super(assignmentType, deadline);
    this.subject = subject;

    let pagesArray: number[] = [];
    pages.split(",").forEach((callback) => {
      pagesArray.push(parseInt(callback));
    });
    this.pages = pagesArray;
  }
}

export class Essay extends Assignment {
  public prompt: string;
  public genre: string;

  public constructor(
    assignmentType: ValidAssignments,
    deadline: Date,
    prompt: string,
    genre: string
  ) {
    if (!deadline) {
      throw new Error("Request is missing deadline parameter");
    }
    if (!prompt) {
      throw new Error("Request is missing prompt parameter");
    }
    if (!genre) {
      throw new Error("Request is missing genre parameter");
    }
    super(assignmentType, deadline);
    this.prompt = prompt;
    this.genre = genre;
  }
}

export class Webhook {
  public url: string;
  constructor(url: string) {
    this.url = url;
  }
}

export interface BookUpdate {
  guildId: string;
  subject: string;
  chapter: number;
  notify: boolean;
  deadline: string;
}
