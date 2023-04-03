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
let Symbols: string[][] = [[]]
const BuiltInFunctionNames: CFrame = []
const ConstantNames: CFrame = []
const GlobalCompileEnvironment: CEnv = [BuiltInFunctionNames, ConstantNames]

function initGlobalVar() {
  wc = 0
  Instructions = []
  Symbols = [[]]
}

function lookupPos(s: string) {
  for (const [frameIdx, frame] of Symbols.entries()) {
    const pos = frame.indexOf(s)
    if (pos !== -1) {
      return [frameIdx, pos]
    }
  }
  return undefined
}

// for dealing with compile-time environments
const helpers = {
  // declare: (name: string) => {
  //   Symbols[Symbols.length - 1].push(name)
  // },
  declare: (name: string, frame: CFrame) => {
    frame.forEach(str => {
      if (str == name) throw new Error('declaring existing name')
    })
    frame.push(name)
  },
  extend: (frame: CFrame, env: CEnv): CEnv => [...env, frame],
  assign: (name: string) => {
    const pos = lookupPos(name)
    if (pos === undefined) {
      throw new Error('assigning to undeclared symbol')
    }
    Instructions[wc++] = {
      opcode: OpCodes.ASSIGN,
      args: pos
    }
  }
}

// handles (declaration_specifier, declarator) pair
function createName(dec_s: CTree, dec: CTree, ind: number): string {
  // handle declaration_specifier here

  const dir_dec = dec.children![0]
  const name = (dir_dec.children![0] as Token).lexeme as string
  // helpers.declareRespectfully(name, ind)
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
    // deal with specifiers eventually...
    // ideally we want a more generalized way of dealing with the following
    // * declaration_specifiers
    // * declarator
    // * direct_declarator
    // * direct_declarator_p
    // * parameter_type_list
    // * parameter_list
    // * parameter_declaration
    // problem is that parameter_declaration's children are also a
    // (declaration_specifiers, declarator) pair, so we need an intelligent way
    // of knowing when that pair is a function name and when it is a param name
    if (node.nodeChildren[1].title !== 'declarator') {
      throw new Error()
    }
    const direct = node.nodeChildren[1].findWithTitle('direct_declarator')
    if (direct === undefined || direct.tokenChildren[0].tokenClass !== 'IDENTIFIER') {
      throw new Error()
    }
    const name = direct.tokenChildren[0].lexeme

    // const name = createName(node.children![0] as CTree,
    //   node.children![1] as CTree)

    // ignore variadic func, so ignore ... in params
    const params: string[] = []
    if (direct.nodeChildren[1].nodeChildren.length === 4) {
      const paramList = direct.nodeChildren[1].nodeChildren[1].nodeChildren[0]
      paramList.listItems.forEach(decl => {
        params.push(decl.getLastNode(1).getLastNode(1).tokenChildren[0].lexeme)
      })
    }

    // helpers.declare(name)

    // add LDF, add GOTO to jump over function body, extend compile time symbol table, and compile body
    Instructions[wc++] = {
      opcode: OpCodes.LDF,
      args: [wc + 1]
    }
    const gotoPos = wc
    Instructions[wc++] = {
      opcode: OpCodes.GOTO
    }
    Symbols.push(params)
    compile(node.getLastNode(1), env)

    Instructions[wc++] = {
      opcode: OpCodes.RESET
    }
    Instructions[gotoPos].args = [wc]

    // helpers.assign(name)

    compile(node.children![2] as CTree, env)
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
  compile(program, GlobalCompileEnvironment)
  // eventually we find the main function and append a call instruction here
  Instructions[wc++] = { opcode: OpCodes.DONE }
  console.log(Instructions)
  console.log('symbol table: ', Symbols)
  return { entry: 0, instrs: Instructions }
}

function compile(expr: CTree, env: CEnv): void {
  // this is handy to find which expr is not defined
  // console.log("compiling", expr.title)
  const compiler = compilers[expr.title]
  if (!compiler) throw Error('Unsupported operation')
  compiler(expr, env)
}
