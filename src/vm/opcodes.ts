type EnsureCorrectEnum<T extends { [K in Exclude<keyof T, number>]: K }> = true

// use string values for easier debugging, may change to numbers for looking cool
export enum OpCodes {
  DONE = 'DONE',
  ASSIGN = 'ASSIGN',
  LDF = 'LDF',
  GOTO = 'GOTO',
  LDC = 'LDC',
  RESET = 'RESET'
}

type _ = EnsureCorrectEnum<typeof OpCodes>
