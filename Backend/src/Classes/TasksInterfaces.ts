export interface Assignment {
  assingmentType: string;
  deadline: Date;
}

export interface Homework extends Assignment {
  subject: string;
  pages: string;
}

export interface Essay extends Assignment {
  prompt: string;
  genre: string;
}
