import { OpCodes } from './opcodes'
import { Instruction, Program } from './vm-compiler'

// placeholder structures for instruction implementation
type Env = any[][]
type Stack = {
  tag: string
  addr?: number
  env?: Env
}

// eventually this should be any[]
let OS: any[] = []
let PC: number = 0
let RTS: Stack[] = []
let E: Env = [[], []]
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

  INC: () => {
    // push two values, one to use and one to assign
    const op = (OS.pop() as number) + 1
    OS.push((op + instr.args![0]) as number)
    OS.push(op)
  },

  DEC: () => {
    // push two values, one to use and one to assign
    const op = (OS.pop() as number) - 1
    OS.push((op - instr.args![0]) as number)
    OS.push(op)
  },

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

  LDF: () => {
    OS.push({
      tag: 'CLOSURE',
      arity: instr.args![0],
      addr: instr.args![1],
      env: E
    })
  },

  LD: () => OS.push(E[instr.args![0]][instr.args![1]]),

  GOTO: () => (PC = instr.args![0] as number),

  ASSIGN: () => (E[instr.args![0]][instr.args![1]] = OS.slice(-1)[0]),

  CALL: () => {
    const arity = instr.args![0]
    const args = []
    for (let i = arity - 1; i >= 0; i--) {
      args[i] = OS.pop()
    }
    const closure = OS.pop()
    RTS.push({
      tag: 'CALL_FRAME',
      addr: PC,
      env: E
    })
    E = [...closure.env!, args]
    PC = closure.addr!
  },

  JOF: () => (PC = OS.pop() ? PC : instr.args![0]),

  POP: () => OS.pop(),

  RESET: () => {
    const topFrame = RTS.pop() as Stack
    if (topFrame.tag == 'CALL_FRAME') {
      PC = topFrame.addr!
      E = topFrame.env!
    } else {
      PC--
    }
  },

  BREAK: () => {
    while (INSTRS[PC++].opcode != OpCodes.BMARKER) {}
  },

  BMARKER: () => {},

  CONT: () => {
    while (INSTRS[PC++].opcode != OpCodes.CMARKER) {}
  },

  CMARKER: () => {},

  RET: () => {
    while (INSTRS[PC++].opcode != OpCodes.RMARKER) {}
  },

  RMARKER: () => {},

  ENTER_SCOPE: () => {
    RTS.push({
      tag: 'BLOCK_FRAME',
      env: E
    })
    E.push([])
  },

  EXIT_SCOPE: () => {
    E = (RTS.pop() as Stack).env!
  },

  DONE: () => {}
}

export function runWithProgram(p: Program): any {
  const ENTRY = p.entry
  INSTRS = p.instrs
  OS = []
  PC = ENTRY
  RTS = []

  while (INSTRS[PC].opcode !== OpCodes.DONE) {
    instr = INSTRS[PC++]
    // console.log("running PC: ", PC - 1, " instr: ", instr)
    // console.log("OS: ", OS)
    // console.log("E: ", E)
    M[instr.opcode]()
  }

  // main functions guarantee a return.
  const top = OS.slice(-1)[0]
  return top
}
