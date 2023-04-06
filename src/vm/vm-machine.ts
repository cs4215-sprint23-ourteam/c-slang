import { Environment, Frame } from '../types'
import { OpCodes } from './opcodes'
import { Instruction, Program } from './vm-compiler'

// eventually this should be any[]
let OS: number[] = []
let PC: number = 0
let RTS: any[][] = [[], []]
const E: Environment = {
  id: 'global',
  name: 'global',
  tail: null,
  head: {}
}
let INSTRS: Instruction[] = []
let instr: Instruction

// microcode
const M: { [code in OpCodes]: () => void } = {
  NOP: () => {},

  LDC: () => {
    const op = instr.args![0] as number
    OS.push(op)
  },

  ADD: () => {
    const op2 = OS.pop() as number
    const op1 = OS.pop() as number
    OS.push(op1 + op2)
  },

  SUB: () => {
    const op2 = OS.pop() as number
    const op1 = OS.pop() as number
    OS.push(op1 - op2)
  },

  MUL: () => {
    const op2 = OS.pop() as number
    const op1 = OS.pop() as number
    OS.push(op1 * op2)
  },

  DIV: () => {
    const op2 = OS.pop() as number
    const op1 = OS.pop() as number
    OS.push(op1 / op2)
  },

  MOD: () => {
    const op2 = OS.pop() as number
    const op1 = OS.pop() as number
    OS.push(op1 % op2)
  },

  INC: () => OS.push((OS.pop() as number) + 1),

  DEC: () => OS.push((OS.pop() as number) - 1),

  EQ: () => {
    const op2 = OS.pop() as number
    const op1 = OS.pop() as number
    OS.push(op1 === op2 ? 1 : 0)
  },

  NE: () => {
    const op2 = OS.pop() as number
    const op1 = OS.pop() as number
    OS.push(op1 !== op2 ? 1 : 0)
  },

  GEQ: () => {
    const op2 = OS.pop() as number
    const op1 = OS.pop() as number
    OS.push(op1 >= op2 ? 1 : 0)
  },

  GT: () => {
    const op2 = OS.pop() as number
    const op1 = OS.pop() as number
    OS.push(op1 > op2 ? 1 : 0)
  },

  LEQ: () => {
    const op2 = OS.pop() as number
    const op1 = OS.pop() as number
    OS.push(op1 <= op2 ? 1 : 0)
  },

  LT: () => {
    const op2 = OS.pop() as number
    const op1 = OS.pop() as number
    OS.push(op1 < op2 ? 1 : 0)
  },

  LEFT: () => {
    const op2 = OS.pop() as number
    const op1 = OS.pop() as number
    OS.push(op1 << op2)
  },

  RIGHT: () => {
    const op2 = OS.pop() as number
    const op1 = OS.pop() as number
    OS.push(op1 >> op2)
  },

  BAND: () => {
    const op2 = OS.pop() as number
    const op1 = OS.pop() as number
    OS.push(op1 & op2)
  },

  BOR: () => {
    const op2 = OS.pop() as number
    const op1 = OS.pop() as number
    OS.push(op1 | op2)
  },

  XOR: () => {
    const op2 = OS.pop() as number
    const op1 = OS.pop() as number
    OS.push(op1 ^ op2)
  },

  AND: () => {
    const op2 = OS.pop() as number
    const op1 = OS.pop() as number
    OS.push(op1 && op2 !== 0 ? 1 : 0)
  },

  OR: () => {
    const op2 = OS.pop() as number
    const op1 = OS.pop() as number
    OS.push(op1 || op2 !== 0 ? 1 : 0)
  },

  RET: () => {},

  LDF: () => {},

  LD: () => {},

  GOTO: () => {
    // PC = instr.args![0] as number
  },

  ASSIGN: () => {},

  CALL: () => {},

  JOF: () => {},

  POP: () => {
    OS.pop()
  },

  RESET: () => {},

  DONE: () => {}
}

// TODO (feature - bottleneck):
// 1. run-time stack - function support
// 2. environments - prelude functions + declaration/assignment + scoping
// 3. heap
export function runWithProgram(p: Program): any {
  const ENTRY = p.entry
  INSTRS = p.instrs
  OS = []
  PC = ENTRY
  RTS = [[], []]

  while (INSTRS[PC].opcode !== OpCodes.DONE) {
    instr = INSTRS[PC++]
    M[instr.opcode]()
  }

  // currently returns the top-most value of the operand stack, but shouldn't
  // return anything
  const top = OS.slice(-1)[0]
  return top
}
