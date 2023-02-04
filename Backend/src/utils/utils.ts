export function EpochDateObjectParse(epochString: string) {
  let epochNumber = Number(epochString);
  return new Date(epochNumber);
}
