type EnsureCorrectEnum<T extends { [K in Exclude<keyof T, number>]: K }> = true

// use string values for easier debugging, may change to numbers for looking cool
export enum OpCodes {
  NOP = 'NOP',
  LDC = 'LDC', // integer
  ADD = 'ADD',
  SUB = 'SUB',
  MUL = 'MUL',
  DIV = 'DIV',
  MOD = 'MOD',
  INC = 'INC',
  DEC = 'DEC',
  EQ = 'EQ',
  NE = 'NE',
  GEQ = 'GEQ',
  GT = 'GT',
  LEQ = 'LEQ',
  LT = 'LT',
  LEFT = 'LEFT', // left shift
  RIGHT = 'RIGHT', // right shift
  BAND = 'BAND', // bitwise and
  BOR = 'BOR', // bitwise or
  XOR = 'XOR',
  AND = 'AND', // logical and
  OR = 'OR', // logical or
  RET = 'RET',
  LDF = 'LDF', // function
  LD = 'LD', // name
  GOTO = 'GOTO',
  ASSIGN = 'ASSIGN',
  CALL = 'CALL',
  JOF = 'JOF',
  POP = 'POP',
  RESET = 'RESET',
  ENTER_SCOPE = 'ENTER_SCOPE',
  EXIT_SCOPE = 'EXIT_SCOPE',
  DONE = 'DONE'
}

type _ = EnsureCorrectEnum<typeof OpCodes>
