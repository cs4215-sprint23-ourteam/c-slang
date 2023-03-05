import * as es from 'estree'

import { Context } from '../types'
import OpCodes from './opcodes'

const VALID_BINARY_OPERATORS = new Map([
  ['+', OpCodes.ADD],
  ['-', OpCodes.SUB],
  ['*', OpCodes.MUL],
  ['/', OpCodes.DIV]
])

/* for future use
export type Offset = number // instructions to skip
export type Address = [
  number, // function index
  number? // instruction index within function; optional
]
*/
export type Instruction = [
  number, // opcode
  Argument?,
  Argument?
]
export type Argument = number // | Offset | Address
export type Program = [
  number, // index of entry point function; should be main() eventually
  Instruction[]
]

let wc = 0
let Instructions: Instruction[] = []

export function compileProgram(program: es.Program, context: Context): Program {
  // pre-process prelude and vmInternalFunctions
  return compileToIns(program)
}

// we currently only support singular statements. once the grammar has been
// updated to include ';', we'll have to compile a sequence of statements.
const compilers = {
  Literal(node: es.Node) {
    node = node as es.Literal
    const value = node.value
    if (typeof value === 'number') Instructions[wc++] = [1, value]
    else throw Error('Unsupported literal')
  },

  BinaryExpression(node: es.Node) {
    node = node as es.BinaryExpression
    if (VALID_BINARY_OPERATORS.has(node.operator)) {
      const opCode = VALID_BINARY_OPERATORS.get(node.operator) as number
      compile(node.left)
      compile(node.right)
      Instructions[wc++] = [opCode]
    }
  },

  ExpressionStatement(node: es.Node) {
    node = node as es.ExpressionStatement
    return compile(node.expression)
  }
}

// prelude refers to predefined functions in C (like malloc)
// vmInternalFunctions refers to functions not called by users (like clearing the RTS)
// they are both empty for now but we'll add to them as development progresses
function compileToIns(
  program: es.Program,
  prelude?: Program,
  vmInternalFunctions?: string[]
): Program {
  wc = 0
  Instructions = []
  for (const stmt of program.body) compile(stmt)
  Instructions[wc++] = [OpCodes.DONE]
  return [0, Instructions]
}

function compile(expr: es.Node) {
  const compiler = compilers[expr.type]
  if (!compiler) throw Error('Unsupported operation')
  compiler(expr)
}
