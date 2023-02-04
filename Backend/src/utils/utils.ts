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
