import { Environment, Frame } from '../types'
import { OpCodes } from './opcodes'
import { Instruction, Program } from './vm-compiler'

// eventually this should be any[]
let OS: number[] = []
let PC: number = 0
let INSTRS: Instruction[] = []
let instr: Instruction

// microcode
const M: { [code in OpCodes]: () => void } = {
  NOP: () => PC++,

  LDC: () => {
    const op = instr.args![0] as number
    PC++
    OS.push(op)
  },

  ADD: () => {
    const op2 = OS.pop() as number
    const op1 = OS.pop() as number
    PC++
    OS.push(op1 + op2)
  },

  SUB: () => {
    const op2 = OS.pop() as number
    const op1 = OS.pop() as number
    PC++
    OS.push(op1 - op2)
  },

  MUL: () => {
    const op2 = OS.pop() as number
    const op1 = OS.pop() as number
    PC++
    OS.push(op1 * op2)
  },

  DIV: () => {
    const op2 = OS.pop() as number
    const op1 = OS.pop() as number
    PC++
    OS.push(op1 / op2)
  },

  RET: () => {
    PC++
  },

  LDF: () => {
    PC++
  },

  LDN: () => {
    PC++
  },

  GOTO: () => {
    PC++
  },

  ASSIGN: () => {
    PC++
  },

  RESET: () => {
    PC++
  },

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

  while (INSTRS[PC].opcode !== OpCodes.DONE) {
    instr = INSTRS[PC]
    M[instr.opcode]()
  }

  // currently returns the top-most value of the operand stack, but shouldn't
  // return anything
  const top = OS.slice(-1)[0]
  return top
}
