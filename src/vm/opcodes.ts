type EnsureCorrectEnum<T extends { [K in Exclude<keyof T, number>]: K }> = true

// use string values for easier debugging, may change to numbers for looking cool
export enum OpCodes {
  NOP = 'NOP',
  LDC = 'LDC', // integer
  ADD = 'ADD',
  SUB = 'SUB',
  MUL = 'MUL',
  DIV = 'DIV',
  RET = 'RET',
  LDF = 'LDF', // function
  LDN = 'LDN', // name
  GOTO = 'GOTO',
  ASSIGN = 'ASSIGN',
  RESET = 'RESET',
  DONE = 'DONE'
}

type _ = EnsureCorrectEnum<typeof OpCodes>
