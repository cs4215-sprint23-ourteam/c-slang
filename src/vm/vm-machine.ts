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

// wrapper for testing
function popOS(): any {
  if (OS.length === 0) throw new Error('popping empty OS')
  return OS.pop()
}

// microcode
const M: { [code in OpCodes]: () => void } = {
  NOP: () => {},

  LDC: () => {
    const op = instr.args![0] as number
    OS.push(op)
  },

  ADD: () => {
    const op2 = popOS() as number
    const op1 = popOS() as number
    OS.push(op1 + op2)
  },

  SUB: () => {
    const op2 = popOS() as number
    const op1 = popOS() as number
    OS.push(op1 - op2)
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
    const op = (popOS() as number) + 1
    OS.push((op + instr.args![0]) as number)
    OS.push(op)
  },

  DEC: () => {
    // push two values, one to use and one to assign
    const op = (popOS() as number) - 1
    OS.push((op - instr.args![0]) as number)
    OS.push(op)
  },

  DEREF: () => {
    // we should dereference the pointer here.
    const op = E[instr.args![0]][instr.args![1]] as number
    OS.push(E[Math.floor(op / 10)][op % 10])
  },

  REF: () => {
    // we should get the address here. for now we just push a dummy value
    OS.push((10 * instr.args![0] + instr.args![1]) as number)
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

  ADD_ASSIGN: () => (E[instr.args![0]][instr.args![1]] += OS.slice(-1)[0]),

  SUB_ASSIGN: () => (E[instr.args![0]][instr.args![1]] -= OS.slice(-1)[0]),

  MUL_ASSIGN: () => (E[instr.args![0]][instr.args![1]] *= OS.slice(-1)[0]),

  DIV_ASSIGN: () => (E[instr.args![0]][instr.args![1]] /= OS.slice(-1)[0]),

  MOD_ASSIGN: () => (E[instr.args![0]][instr.args![1]] %= OS.slice(-1)[0]),

  LEFT_ASSIGN: () => (E[instr.args![0]][instr.args![1]] <<= OS.slice(-1)[0]),

  RIGHT_ASSIGN: () => (E[instr.args![0]][instr.args![1]] >>= OS.slice(-1)[0]),

  XOR_ASSIGN: () => (E[instr.args![0]][instr.args![1]] ^= OS.slice(-1)[0]),

  AND_ASSIGN: () => (E[instr.args![0]][instr.args![1]] &= OS.slice(-1)[0]),

  OR_ASSIGN: () => (E[instr.args![0]][instr.args![1]] |= OS.slice(-1)[0]),

  CALL: () => {
    const arity = instr.args![0]
    const args = []
    for (let i = arity - 1; i >= 0; i--) {
      args[i] = popOS()
    }
    const closure = popOS()
    RTS.push({
      tag: 'CALL_FRAME',
      addr: PC,
      env: [...E]
    })
    E = [...closure.env!, args]
    PC = closure.addr!
  },

  JOF: () => (PC = popOS() ? PC : instr.args![0]),

  POP: () => popOS(),

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

  ENTER_SCOPE: () => {
    RTS.push({
      tag: 'BLOCK_FRAME',
      env: [...E]
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
    // console.log('running PC: ', PC - 1, ' instr: ', instr)
    M[instr.opcode]()
    // console.log('OS: ', OS)
    // console.log('E: ', E)
    // console.log('RTS: ', RTS, '\n')
  }

  // main functions guarantee a return.
  const top = OS.slice(-1)[0]
  return top
}
