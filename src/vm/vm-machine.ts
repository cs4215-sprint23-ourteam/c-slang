import {
  allocateInHeap,
  debugGetHeap,
  debugGetStack,
  freeInHeap,
  getValueFromAddr,
  setValueToAddr
} from './mem-utils'
import { builtins, OpCodes } from './opcodes'
import { BaseType } from './types'
import { Instruction, Program } from './vm-compiler'

// values are stored in OS with highest percision (8 bytes),
// and casted when assigned into memory
let OS: number[] = []
let PC: number = 0
let ESP = 0
let EBP = 0
let INSTRS: Instruction[] = []
let instr: Instruction

// wrapper for testing
function popOS(): any {
  if (OS.length === 0) throw new Error('popping empty OS')
  return OS.pop()
}

const BUILTINS: { [code in builtins]: () => void } = {
  // malloc
  0: () => {
    OS.push(allocateInHeap(getValueFromAddr(EBP + BaseType.addr * 2, BaseType.int)))
  },
  // free
  1: () => {
    OS.push(freeInHeap(getValueFromAddr(EBP + BaseType.addr * 2, BaseType.addr)))
  },
  // printf
  2: () => {
    console.log('printf: ', getValueFromAddr(EBP + BaseType.addr * 2, BaseType.addr))
    OS.push(0)
  },
  // debug display stack and heap
  3: () => {}
}

// microcode
const M: { [code in OpCodes]: () => void } = {
  NOP: () => {},

  LDC: () => {
    if (instr.args === undefined || instr.args.length === 0) OS.push(-1)
    else {
      const op = instr.args[0] as number
      OS.push(op)
    }
  },

  ADD: () => {
    const op2 = popOS() as number
    const op1 = popOS() as number
    const size = instr.args![0]
    const scaleLeft = instr.args![1]
    OS.push(op1 * (1 + (size - 1) * scaleLeft) + op2 * (1 + (size - 1) * +!scaleLeft))
  },

  SUB: () => {
    const op2 = popOS() as number
    const op1 = popOS() as number
    const size = instr.args![0]
    const scaleLeft = instr.args![1]
    OS.push(op1 * (1 + (size - 1) * scaleLeft) - op2 * (1 + (size - 1) * +!scaleLeft))
  },

  MUL: () => {
    const op2 = popOS() as number
    const op1 = popOS() as number
    OS.push(op1 * op2)
  },

  DIV: () => {
    const op2 = popOS() as number
    const op1 = popOS() as number
    OS.push(op1 / op2)
  },

  MOD: () => {
    const op2 = popOS() as number
    const op1 = popOS() as number
    OS.push(op1 % op2)
  },

  INC: () => {
    // push two values, one to use and one to assign
    const op = (popOS() as number) + instr.args![1]
    OS.push((op + instr.args![0] * instr.args![1]) as number)
    OS.push(op)
  },

  DEC: () => {
    // push two values, one to use and one to assign
    const op = (popOS() as number) - instr.args![1]
    OS.push((op - instr.args![0] * instr.args![1]) as number)
    OS.push(op)
  },

  DEREF: () => {
    OS.push(getValueFromAddr(OS.pop()!, instr.args![0]))
  },

  REF: () => {
    OS.push(EBP + instr.args![0])
  },

  EQ: () => {
    const op2 = popOS() as number
    const op1 = popOS() as number
    OS.push(op1 === op2 ? 1 : 0)
  },

  NE: () => {
    const op2 = popOS() as number
    const op1 = popOS() as number
    OS.push(op1 !== op2 ? 1 : 0)
  },

  GEQ: () => {
    const op2 = popOS() as number
    const op1 = popOS() as number
    OS.push(op1 >= op2 ? 1 : 0)
  },

  GT: () => {
    const op2 = popOS() as number
    const op1 = popOS() as number
    OS.push(op1 > op2 ? 1 : 0)
  },

  LEQ: () => {
    const op2 = popOS() as number
    const op1 = popOS() as number
    OS.push(op1 <= op2 ? 1 : 0)
  },

  LT: () => {
    const op2 = popOS() as number
    const op1 = popOS() as number
    OS.push(op1 < op2 ? 1 : 0)
  },

  LEFT: () => {
    const op2 = popOS() as number
    const op1 = popOS() as number
    OS.push(op1 << op2)
  },

  RIGHT: () => {
    const op2 = popOS() as number
    const op1 = popOS() as number
    OS.push(op1 >> op2)
  },

  BAND: () => {
    const op2 = popOS() as number
    const op1 = popOS() as number
    OS.push(op1 & op2)
  },

  BOR: () => {
    const op2 = popOS() as number
    const op1 = popOS() as number
    OS.push(op1 | op2)
  },

  XOR: () => {
    const op2 = popOS() as number
    const op1 = popOS() as number
    OS.push(op1 ^ op2)
  },

  AND: () => {
    const op2 = popOS() as number
    const op1 = popOS() as number
    OS.push(op1 && op2 !== 0 ? 1 : 0)
  },

  OR: () => {
    const op2 = popOS() as number
    const op1 = popOS() as number
    OS.push(op1 || op2 !== 0 ? 1 : 0)
  },

  LDF: () => {
    OS.push(instr.args![0])
  },

  LD: () => OS.push(getValueFromAddr(EBP + instr.args![0], instr.args![1])),

  GOTO: () => (PC = instr.args![0] as number),

  ASSIGN: () => setValueToAddr(EBP + instr.args![0], instr.args![1], OS.slice(-1)[0]),

  EXS: () => {
    ESP += instr.args![0]
  },

  PUSH: () => {
    const size = instr.args![0]
    setValueToAddr(ESP, size, OS.pop()!)
    ESP += size
  },

  LDB: () => {
    OS.push(EBP)
  },

  ASGB: () => {
    EBP = OS.pop()!
  },

  LDS: () => {
    OS.push(ESP)
  },

  LDPC: () => {
    OS.push(PC)
  },

  ADD_ASSIGN: () => {
    const original = getValueFromAddr(instr.args![0], instr.args![1])
    setValueToAddr(instr.args![0], instr.args![1], original + OS.slice(-1)[0])
  },
  SUB_ASSIGN: () => {
    const original = getValueFromAddr(instr.args![0], instr.args![1])
    setValueToAddr(instr.args![0], instr.args![1], original - OS.slice(-1)[0])
  },
  MUL_ASSIGN: () => {
    const original = getValueFromAddr(instr.args![0], instr.args![1])
    setValueToAddr(instr.args![0], instr.args![1], original * OS.slice(-1)[0])
  },
  DIV_ASSIGN: () => {
    const original = getValueFromAddr(instr.args![0], instr.args![1])
    setValueToAddr(instr.args![0], instr.args![1], Math.floor(original / OS.slice(-1)[0]))
  },
  MOD_ASSIGN: () => {
    const original = getValueFromAddr(instr.args![0], instr.args![1])
    setValueToAddr(instr.args![0], instr.args![1], original % OS.slice(-1)[0])
  },
  LEFT_ASSIGN: () => {
    const original = getValueFromAddr(instr.args![0], instr.args![1])
    setValueToAddr(instr.args![0], instr.args![1], original << OS.slice(-1)[0])
  },
  RIGHT_ASSIGN: () => {
    const original = getValueFromAddr(instr.args![0], instr.args![1])
    setValueToAddr(instr.args![0], instr.args![1], original >> OS.slice(-1)[0])
  },
  XOR_ASSIGN: () => {
    const original = getValueFromAddr(instr.args![0], instr.args![1])
    setValueToAddr(instr.args![0], instr.args![1], original ^ OS.slice(-1)[0])
  },
  AND_ASSIGN: () => {
    const original = getValueFromAddr(instr.args![0], instr.args![1])
    setValueToAddr(instr.args![0], instr.args![1], original & OS.slice(-1)[0])
  },
  OR_ASSIGN: () => {
    const original = getValueFromAddr(instr.args![0], instr.args![1])
    setValueToAddr(instr.args![0], instr.args![1], original | OS.slice(-1)[0])
  },

  CALL: () => {
    // set return address
    setValueToAddr(EBP + BaseType.addr, BaseType.addr, PC)
    PC = OS.pop()!
  },

  CALLP: () => {
    BUILTINS[instr.args![0]]()
    M.RESET()
  },

  JOF: () => (PC = popOS() ? PC : instr.args![0]),

  POP: () => popOS(),

  RESET: () => {
    PC = getValueFromAddr(EBP + BaseType.addr, BaseType.addr)
    ESP = EBP
    EBP = getValueFromAddr(EBP, BaseType.addr)
  },

  BREAK: () => {
    while (INSTRS[PC++].opcode != OpCodes.BMARKER) {}
    popOS()
  },

  BMARKER: () => {},

  CONT: () => {
    while (INSTRS[PC++].opcode != OpCodes.CMARKER) {}
    popOS()
  },

  CMARKER: () => {},

  RET: () => {
    while (INSTRS[PC++].opcode != OpCodes.RMARKER) {}
  },

  RMARKER: () => {},

  DONE: () => {}
}

export function runWithProgram(p: Program): any {
  const ENTRY = p.entry
  INSTRS = p.instrs
  OS = []
  ESP = 0
  EBP = 0
  PC = ENTRY

  while (INSTRS[PC].opcode !== OpCodes.DONE) {
    instr = INSTRS[PC++]
    console.debug('\nrunning PC: ', PC - 1, ' instr: ', instr, EBP, ESP)
    M[instr.opcode]()
    console.debug('OS: ', OS)
    console.debug('stack: ', debugGetStack(ESP))
    console.debug('heap: ', debugGetHeap())
  }

  // main functions guarantee a return.
  const top = OS.slice(-1)[0]
  return top
}
