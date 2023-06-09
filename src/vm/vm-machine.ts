import {
  allocateInHeap,
  clearMemory,
  debugGetHeap,
  debugGetStack,
  freeInHeap,
  getValueFromAddr,
  HEAP_MANAGER,
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
const stdout: any[] = []

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
  // print
  2: () => {
    const msg = `print: ${getValueFromAddr(EBP + BaseType.addr * 2, BaseType.int)}`
    console.debug(msg)
    stdout.push(msg)
    OS.push(0)
  },
  // debug display stack and heap
  3: () => {
    stdout.push(`debug stack`)
    stdout.push(debugGetStack(ESP))
    stdout.push(`debug heap`)
    stdout.push(debugGetHeap())
    console.debug(`debug stack: `, debugGetStack(ESP))
    console.debug(`debug heap: `, debugGetHeap())
    OS.push(0)
  }
}

// microcode
const M: { [code in OpCodes]: () => void } = {
  NOP: () => {},

  LDC: () => {
    // would prefer to push undefined because
    // 1. compiler always guarantees LDC instructions are created with args
    // 2. easier on testing - this undefined should never be loaded. if you load a -1
    //    and do some math operations on it you might (erroneously) get right results
    // 3. cleaner - only keep lines 58 and 59
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

  // ideally this instruction should not exist. every time we load something, we should
  // split it into two instructions - load the address into the OS, then get a value
  // from the address. this allows for easy dereferencing (add derefs between the two)
  // and assignments (remove the get instruction). unfortunately i do not have time :-(
  // this will have to do.
  DEREF_ADDR: () => {
    const offset = popOS()
    OS.push(getValueFromAddr(EBP + offset, BaseType.addr) - EBP)
  },

  DEREF: () => {
    const addr = popOS()
    OS.push(getValueFromAddr(addr, instr.args![0]))
  },

  REF: () => {
    OS.push(EBP + popOS())
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

  LDA: () => OS.push(getValueFromAddr(instr.args![0], BaseType.addr)),

  GOTO: () => (PC = instr.args![0] as number),

  ASSIGN: () => {
    const op = popOS()
    const offset = popOS()
    setValueToAddr(EBP + offset, instr.args![0], op)
    OS.push(op)
  },

  EXS: () => {
    ESP += instr.args![0]
  },

  PUSH: () => {
    const size = instr.args![0]
    setValueToAddr(ESP, size, popOS())
    ESP += size
  },

  LDB: () => {
    OS.push(EBP)
  },

  ASGB: () => {
    EBP = popOS()
  },

  LDS: () => {
    OS.push(ESP)
  },

  LDPC: () => {
    OS.push(PC)
  },

  CALL: () => {
    // set return address
    setValueToAddr(EBP + BaseType.addr, BaseType.addr, PC)
    PC = popOS()
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
  clearMemory()
  stdout.length = 0

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
  console.debug('result:', top)
  if (typeof window !== 'undefined') {
    alert(`program execution result: ${top}`)
  }
  return stdout
}
