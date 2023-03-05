import * as es from 'estree'

import { Context } from '../types'
import OpCodes from './opcodes'
import { Instruction, Program } from './vm-compiler'

// eventually this should be any[]
let OS: number[] = []
let PC: number = 0
let INSTRS: Instruction[] = []
let instr: Instruction

// microcode
const M: (() => void)[] = []

M[OpCodes.NOP] = () => PC++

M[OpCodes.LDC] = () => {
  const op = instr[1] as number
  PC++
  OS.push(op)
}

M[OpCodes.ADD] = () => {
  const op2 = OS.pop() as number
  const op1 = OS.pop() as number
  PC++
  OS.push(op1 + op2)
}

M[OpCodes.SUB] = () => {
  const op2 = OS.pop() as number
  const op1 = OS.pop() as number
  PC++
  OS.push(op1 - op2)
}

M[OpCodes.MUL] = () => {
  const op2 = OS.pop() as number
  const op1 = OS.pop() as number
  PC++
  OS.push(op1 * op2)
}

M[OpCodes.DIV] = () => {
  const op2 = OS.pop() as number
  const op1 = OS.pop() as number
  PC++
  OS.push(op1 / op2)
}

// TODO (feature - bottleneck):
// 1. run-time stack - function support
// 2. environments - prelude functions + declaration/assignment + scoping
// 3. heap
export function runWithProgram(p: Program, context: Context): any {
  const ENTRY = p[0]
  INSTRS = p[1]
  OS = []
  PC = ENTRY

  while (INSTRS[PC][0] !== OpCodes.DONE) {
    instr = INSTRS[PC]
    M[instr[0]]()
  }

  const top = OS.slice(-1)[0]
  return top
}
