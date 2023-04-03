import { CTree, Token } from '../parser/tree'
import { OpCodes } from './opcodes'

const VALID_ASSIGNMENT_OPERATORS = new Map([['=', OpCodes.ASSIGN]])

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
export type Instruction = {
  opcode: OpCodes
  args?: Argument[]
}

export type Argument = number // | Offset | Address
export type Program = {
  entry: number // index of entry point function; should be main() eventually
  instrs: Instruction[]
}

// compile-time frame and environment
type CFrame = string[]
type CEnv = CFrame[]

let wc = 0
let Instructions: Instruction[] = []
let MainPos: [number, number] = [-1, -1]
const BuiltInFunctionNames: CFrame = []
const ConstantNames: CFrame = []
const GlobalCompileEnvironment: CEnv = [BuiltInFunctionNames, ConstantNames]

function initGlobalVar() {
  wc = 0
  Instructions = []
  MainPos = [-1, -1]
}

// function lookupPos(s: string) {
//   for (const [frameIdx, frame] of Symbols.entries()) {
//     const pos = frame.indexOf(s)
//     if (pos !== -1) {
//       return [frameIdx, pos]
//     }
//   }
//   return undefined
// }

// for dealing with compile-time environments
const helpers = {
  declare: (name: string, frame: CFrame): void => {
    frame.forEach(str => {
      if (str == name) throw new Error('declaring existing name')
    })
    frame.push(name)
  },
  extend: (frame: CFrame, env: CEnv): CEnv => [...env, frame],
  lookup: (frame: CFrame, name: string): number => {
    for (let i = 0; i < frame.length; i++) {
      if (frame[i] == name) return i
    }
    return -1
  },
  position: (env: CEnv, name: string): [number, number] => {
    let i = env.length
    while (helpers.lookup(env[--i], name) === -1) {}
    return [i, helpers.lookup(env[i], name)]
  }
}

// handles (declaration_specifier, declarator) pair
function createName(decSpe: CTree, dec: CTree, env: CEnv): string {
  // handle declaration_specifier here

  const dir_dec = dec.children![0]
  const name = (dir_dec.children![0] as Token).lexeme as string
  helpers.declare(name, env[env.length - 1])
  return name
}

export function compileProgram(program: CTree): Program {
  // pre-process prelude and vmInternalFunctions
  return compileToIns(program)
}

// note - there seem to be two types of _p instrs, one with tokens in between
// and one without. can probably be generalised.
const compilers: { [nodeType: string]: (node: CTree, env: CEnv) => void } = {
  EPSILON: (node, env) => {},

  // children: multiplicative_expr, additive_expr_p
  additive_expr: (node, env) => {
    compile(node.children![0] as CTree, env)
    compile(node.children![1] as CTree, env)
  },

  // children: binop token, multiplicative_expr, additive_expr_p
  additive_expr_p: (node, env) => {
    if (node.children!.length === 3) {
      const token = node.children![0] as Token
      const opcode = VALID_BINARY_OPERATORS.get(token.lexeme) as OpCodes
      compile(node.children![1] as CTree, env)
      Instructions[wc++] = { opcode: opcode }
      compile(node.children![2] as CTree, env)
    }
  },

  // children: equality_expr, and_expr_p
  and_expr: (node, env) => {
    compile(node.children![0] as CTree, env)
    // implement this: compile(node.children[1] as CTree)
  },

  // children: conditional_expr
  assignment_expr: (node, env) => compile(node.children![0] as CTree, env),

  // children: stmt
  block_item: (node, env) => compile(node.children![0] as CTree, env),

  // children: block_item, block_item_list_p
  block_item_list: (node, env) => {
    compile(node.children![0] as CTree, env)
    // implement this: compile(node.children[1] as CTree)
  },

  // children: unary_expr
  cast_expr: (node, env) => compile(node.children![0] as CTree, env),

  // children: '{', '}'
  //        OR '{', block_item_list, '}'
  compound_stmt: (node, env) => {
    if (node.children!.length > 2) {
      compile(node.children![1] as CTree, env)
    }
  },

  // children: logical_or_expr
  conditional_expr: (node, env) => compile(node.children![0] as CTree, env),

  // children: declaration_specifiers, init_declarator_list
  declaration: (node, env) => {
    compile(node.children![0] as CTree, env)
    compile(node.children![1] as CTree, env)
  },

  // children: type_specifier
  // there may be more than one - be careful
  declaration_specifiers: (node, env) => {
    compile(node.children![0] as CTree, env)
  },

  // children: (pointer)*, direct_declarator
  declarator: (node, env) => {
    // deal with pointers eventually
    compile(node.children![node.children!.length - 1] as CTree, env)
  },

  // children: identifier token, direct_declarator_p
  direct_declarator: (node, env) => {
    const token = node.children![0] as Token
    const name = token.lexeme
    // helpers.declare(name)
    compile(node.children![1] as CTree, env)
  },

  // children: empty or '(', parameter_type_list, ')', direct_declarator_p
  direct_declarator_p: (node, env) => {},

  // children: relational_expr, equality_expr_p
  equality_expr: (node, env) => {
    compile(node.children![0] as CTree, env)
    // implement this: compile(node.children[1] as CTree)
  },

  // children: assignment_expr, expr_p
  expr: (node, env) => {
    compile(node.children![0] as CTree, env)
    // implement this: compile(node.children[1] as CTree)
  },

  // children: and_expr, exclusive_or_expr_p
  exclusive_or_expr: (node, env) => {
    compile(node.children![0] as CTree, env)
    // implement this: compile(node.children[1] as CTree)
  },

  // children: expr, ';'
  expression_stmt: (node, env) => compile(node.children![0] as CTree, env),

  // children: function_definition - there's probably more
  external_declaration: (node, env) => {
    compile(node.children![0] as CTree, env)
  },

  // children: declaration_specifiers, declarator, compound_stmt
  function_definition: (node, env) => {
    const decSpe = node.children![0] as CTree
    const dec = node.children![1] as CTree
    const funcName = createName(decSpe, dec, env)
    const funcLoc = helpers.position(env, funcName)
    if (funcName == 'main') MainPos = funcLoc

    // children: identifier token, direct_declarator_p
    const dirDec = dec.children![0] as CTree
    // children: empty
    //        OR '(', parameter_type_list, ')', direct_declarator_p
    const dirDecP = dirDec.children![1] as CTree
    let tmpEnv = env

    // ignore variadic func, so ignore ... in params
    if (dirDecP.children!.length === 4) {
      const parTypeList = dirDecP.children![1] as CTree
      const parList = parTypeList.children![0] as CTree
      tmpEnv = helpers.extend([], env)
      parList.listItems.forEach(parDec => {
        createName(parDec.children![0] as CTree, parDec.children![1] as CTree, tmpEnv)
      })
    }

    Instructions[wc++] = {
      opcode: OpCodes.LDF,
      args: [wc + 1]
    }
    const gotoPos = wc
    Instructions[wc++] = {
      opcode: OpCodes.GOTO
    }

    // compile(node.getLastNode(1), env)

    compile(node.children![2] as CTree, tmpEnv)

    Instructions[wc++] = {
      opcode: OpCodes.RESET
    }
    Instructions[gotoPos].args = [wc]

    Instructions[wc++] = {
      opcode: OpCodes.ASSIGN,
      args: funcLoc
    }
  },

  // children: exclusive_or_expr, inclusive_or_expr_p
  inclusive_or_expr: (node, env) => {
    compile(node.children![0] as CTree, env)
    // implement this: compile(node.children[1] as CTree)
  },

  // children: declarator
  //        OR declarator, assignment token, initializer
  init_declarator: (node, env) => {
    compile(node.children![0] as CTree, env)
    if (node.children!.length > 1) {
      const token = node.children![1] as Token
      const opcode = VALID_ASSIGNMENT_OPERATORS.get(token.lexeme) as OpCodes
      compile(node.children![2] as CTree, env)
      Instructions[wc++] = { opcode: opcode }
    }
  },

  // children: init_declarator, init_declarator_list_p
  init_declarator_list: (node, env) => {
    if (node.children) {
      compile(node.children[0] as CTree, env)
      // implement this: compile(node.children[1] as CTree)
    }
  },

  // children: inclusive_or_expr, logical_and_expr_p
  logical_and_expr: (node, env) => {
    compile(node.children![0] as CTree, env)
    // implement this: compile(node.children[1] as CTree)
  },

  // children: logical_and_expr, logical_or_expr
  logical_or_expr: (node, env) => {
    compile(node.children![0] as CTree, env)
    // implement this: compile(node.children[1] as CTree)
  },

  // children: cast_expr, multiplicative_expr_p
  multiplicative_expr: (node, env) => {
    compile(node.children![0] as CTree, env)
    // implement this: compile(node.children[1] as CTree)
  },

  // children: declaration_specifiers, declarator
  parameter_declaration: (node, env) => {
    // we should handle this the same way we do function_definition
  },

  // children: parameter_declaration, parameter_list_p
  parameter_list: (node, env) => {
    // implement this: compile(node.children![0] as CTree)
  },

  // children: parameter_list
  parameter_type_list: (node, env) => compile(node.children![0] as CTree, env),

  // children: primary_expr, postfix_expr_p
  postfix_expr: (node, env) => {
    compile(node.children![0] as CTree, env)
    // implement this: compile(node.children[1] as CTree)
  },

  // children: expression token
  primary_expr: (node, env) => {
    const token = node.children![0] as Token
    const value: number = Number(token.lexeme)
    Instructions[wc++] = { opcode: OpCodes.LDC, args: [value] }
  },

  // children: shift_expr, relational_expr_p
  relational_expr: (node, env) => {
    compile(node.children![0] as CTree, env)
    // implement this: compile(node.children[1] as CTree)
  },

  // children: additive_expr, shift_expr_p
  shift_expr: (node, env) => {
    compile(node.children![0] as CTree, env)
    // implement this: compile(node.children[1] as CTree)
  },

  // children: expr
  // other many types of statements here; implement as we go
  stmt: (node, env) => compile(node.children![0] as CTree, env),

  // children: external_declaration, translation_unit_p
  translation_unit: (node, env) => {
    compile(node.children![0] as CTree, env)
    // implement this: compile(node.children[1] as CTree)
  },

  // children: type specifier token
  type_specifier: (node, env) => {
    // enforce type safety here; probably through an instruction?
  },

  // children: postfix_expr
  unary_expr: (node, env) => compile(node.children![0] as CTree, env)
}

// prelude refers to predefined functions in C (like malloc)
// vmInternalFunctions refers to functions not called by users (like clearing the RTS)
// they are both empty for now but we'll add to them as development progresses
function compileToIns(program: CTree, vmInternalFunctions?: string[]): Program {
  initGlobalVar()
  const env = helpers.extend([], GlobalCompileEnvironment)
  compile(program, env)
  // eventually we find the main function and append a call instruction here
  if (MainPos[0] === -1 && MainPos[1] === -1) throw new Error('no main function detected')
  Instructions[wc++] = {
    opcode: OpCodes.CALL,
    args: MainPos
  }
  Instructions[wc++] = { opcode: OpCodes.DONE }
  console.log(Instructions)
  return { entry: 0, instrs: Instructions }
}

function compile(expr: CTree, env: CEnv): void {
  // this is handy to find which expr is not defined
  // console.log("compiling", expr.title)
  const compiler = compilers[expr.title]
  if (!compiler) throw Error('Unsupported operation')
  compiler(expr, env)
}
