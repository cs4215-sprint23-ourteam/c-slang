type EnsureCorrectEnum<T extends { [K in Exclude<keyof T, number>]: K }> = true

// use string values for easier debugging, may change to numbers for looking cool
export enum OpCodes {
  NOP = 'NOP',
  LDC = 'LDC', // load value from arg into OS, [value]
  ADD = 'ADD',
  SUB = 'SUB',
  MUL = 'MUL',
  DIV = 'DIV',
  MOD = 'MOD',
  DEREF_ADDR = 'DEREF_ADDR',
  DEREF = 'DEREF', // ~=LD, load value into OS, value from stack, absolute addr from OS, [size]
  REF = 'REF', // load absolute address into OS, offset value from args, [offset]
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
  LDF = 'LDF', // load function address into OS, value from args, [value]
  LD = 'LD', // load value into OS, value from stack, [addr, size]
  LDA = 'LDA', // loads value into OS from a fixed address
  GOTO = 'GOTO',
  ASSIGN = 'ASSIGN', // assign to stack, value and offset popped from OS, [size]
  // should always push or exs before assign, otherwise ESP will not be correctly set, causing error when moving EBP
  PUSH = 'PUSH', // push to stack, ~=EXS+ASSIGN, value popped from OS, [size]
  EXS = 'EXS', // extend stack, just increase ESP, [size]
  LDB = 'LDB', // load EBP (ADDR) into OS
  ASGB = 'ASGB', // assign popped OS to EBP
  LDS = 'LDS', // load ESP into OS
  LDPC = 'LDPC', // load PC (ADDR) into OS
  CALL = 'CALL', // call function, addr from popped OS
  CALLP = 'CALLP', // builtin functions, id from arg. [builtinID]
  JOF = 'JOF', // jump on false, value from OS top, [addr]
  POP = 'POP', // POP OS
  RESET = 'RESET', // indicates the end of function calls
  BREAK = 'BREAK', // TODO can change to jump and remove all markers
  BMARKER = 'BMARKER',
  CONT = 'CONT',
  CMARKER = 'CMARKER',
  RET = 'RET',
  RMARKER = 'RMARKER', // marker for return
  DONE = 'DONE'
}

type _ = EnsureCorrectEnum<typeof OpCodes>

export enum builtins {
  malloc = 0,
  free = 1,
  print = 2,
  DEBUGDISPLAY = 3
}
