interface TimeTable {
  math: string[];
  portuguese: string[];
  physics: string[];
  biology: string[];
  spanish: string[];
}

interface WeekDays {
  monday: number;
  tuesday: number;
  wednesday: number;
  thursday: number;
  friday: number;
}

const dayOfTheWeekNumber: WeekDays = {
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
};

const subjectTimeTable: TimeTable = {
  math: ["monday", "tuesday", "thursday"],
  portuguese: ["monday"],
  physics: ["monday", "tuesday", "wednesday"],
  biology: ["monday", "wednesday"],
  spanish: ["friday"],
};

export function getSubjectClosestDay(subject: string) {
  let subjectDays: string[] = subjectTimeTable[subject as keyof TimeTable];
  let subjectDaysNumbers: number[] = [];
  const todaysDate = new Date();
  todaysDate.setHours(13, 0, 0, 0);

  subjectDays.forEach((callback) => {
    subjectDaysNumbers.push(dayOfTheWeekNumber[callback as keyof WeekDays]);
  });

  let todaysWeekDay = todaysDate.getDay();
  let closestDayNumber = -1;
  for (let i = 0; i < subjectDaysNumbers.length; i++) {
    const subjectDay = subjectDaysNumbers[i];
    if (i == subjectDaysNumbers.length - 1)
      closestDayNumber = subjectDaysNumbers[0];
    if (subjectDay > todaysWeekDay) {
      closestDayNumber = subjectDay;
      break;
    }
  }
  for (const key in dayOfTheWeekNumber) {
    if (Object.prototype.hasOwnProperty.call(dayOfTheWeekNumber, key)) {
      const dayOfWeek = dayOfTheWeekNumber[key as keyof WeekDays];
      if (dayOfWeek == closestDayNumber) key; // KEY É O DIA DA SEMANA EM NOME NORMAL
    }
  }
  if (closestDayNumber < 0) throw new Error("negative weekday");

  let difference = closestDayNumber - todaysWeekDay;
  if (todaysWeekDay < closestDayNumber) {
    return (
      todaysDate[Symbol.toPrimitive]("number") +
      (difference - 1) * 1000 * 60 * 60 * 24
    );
  } else {
    return (
      todaysDate[Symbol.toPrimitive]("number") +
      (6 - difference) * 1000 * 60 * 60 * 24
    );
  }
}
