import { CTree, Token } from '../parser/tree'
import { OpCodes } from './opcodes'

const VALID_ASSIGNMENT_OPERATORS = new Map([
  ['=', OpCodes.ASSIGN],
  ['+=', OpCodes.ADD_ASSIGN],
  ['-=', OpCodes.SUB_ASSIGN],
  ['*=', OpCodes.MUL_ASSIGN],
  ['/=', OpCodes.DIV_ASSIGN],
  ['%=', OpCodes.MOD_ASSIGN],
  ['<<=', OpCodes.LEFT_ASSIGN],
  ['>>=', OpCodes.RIGHT_ASSIGN],
  ['^=', OpCodes.XOR_ASSIGN],
  ['&=', OpCodes.AND_ASSIGN],
  ['|=', OpCodes.OR_ASSIGN]
])

const VALID_BINARY_OPERATORS = new Map([
  ['+', OpCodes.ADD],
  ['-', OpCodes.SUB],
  ['*', OpCodes.MUL],
  ['/', OpCodes.DIV],
  ['%', OpCodes.MOD]
])

const VALID_CONTROL_OPERATORS = new Map([
  ['break', OpCodes.BREAK],
  ['continue', OpCodes.CONT],
  ['return', OpCodes.RET]
])

const VALID_EQUALITY_OPERATORS = new Map([
  ['==', OpCodes.EQ],
  ['!=', OpCodes.NE]
])

const VALID_RELATIONAL_OPERATORS = new Map([
  ['>=', OpCodes.GEQ],
  ['>', OpCodes.GT],
  ['<=', OpCodes.LEQ],
  ['<', OpCodes.LT]
])

const VALID_SHIFT_OPERATORS = new Map([
  ['<<', OpCodes.LEFT],
  ['>>', OpCodes.RIGHT]
])

const VALID_UNARY_OPERATORS = new Map([
  ['++', OpCodes.INC],
  ['--', OpCodes.DEC]
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
  entry: number
  instrs: Instruction[]
}

// compile-time frame and environment
type CFrame = string[]
type CEnv = CFrame[]

let wc = 0
let Instructions: Instruction[] = []
let MainPos: [number, number] = [-1, -1]
const FunctionArityMap: { [name: string]: number } = {}
const BuiltInFunctionNames: CFrame = []
const ConstantNames: CFrame = []
const GlobalCompileEnvironment: CEnv = [BuiltInFunctionNames, ConstantNames]

function initGlobalVar() {
  wc = 0
  Instructions = []
  MainPos = [-1, -1]
}

// for dealing with compile-time environments
const helpers = {
  declare: (name: string, frame: CFrame): void => {
    frame.forEach(str => {
      if (str == name) throw new Error('declaring existing name')
    })
    frame.push(name)
  },
  extend: (frame: CFrame, env: CEnv): CEnv => [...env, frame],
  find: (env: CEnv, name: string): [number, number] => {
    const loc = helpers.position(env, name)
    if (loc[0] === -1 && loc[1] === -1) throw new Error('undeclared name used')
    return loc
  },
  lookup: (frame: CFrame, name: string): number => {
    for (let i = 0; i < frame.length; i++) {
      if (frame[i] == name) return i
    }
    return -1
  },
  // try to avoid using this raw - use find instead
  position: (env: CEnv, name: string): [number, number] => {
    let i = env.length
    while (--i !== -1 && helpers.lookup(env[i], name) === -1) {}
    return [i, i === -1 ? -1 : helpers.lookup(env[i], name)]
  }
}

// handles (declaration_specifier, declarator) pair
// children: (pointer)*, direct_declarator
function createName(decSpe: CTree, dec: CTree, env: CEnv): string {
  // handle declaration_specifier here

  const dir_dec = dec.children![0]
  const name = (dir_dec.children![0] as Token).lexeme as string
  helpers.declare(name, env[env.length - 1])
  return name
}

// flattens a CTree structure
function flatten(node: CTree): (CTree | Token)[] {
  let nodePtr = node
  const list: (CTree | Token)[] = []

  while (nodePtr.children![0].title !== 'EPSILON') {
    list.push(...nodePtr.children!)
    nodePtr = list.pop() as CTree
  }

  return list
}

// this is a compiler level check - assignment and unary operators should only
// accept lvalues. lvalues are locations in memory that identifies as objects.
// we should ONLY run this check on unary_expr OR primary_expr, wherein the structure we are
// looking for is:
// unary_expr
//  => postfix_expr
//    => primary_expr (guaranteed)
//      => (constant or) identifier token
//    => postfix_expr_p (guaranteed)
//      => EPSILON (or others of length != 1)
// note that unary_expr can also have unary_token, unary_expr children.
// we can skip some sanity checks because of the above guarantees.
// reject everything else.
function lvalueCheck(node: CTree): boolean {
  return node.title === 'unary_expr'
    ? node.children!.length === 1 &&
        lvalueCheck(node.children![0].children![0] as CTree) &&
        node.children![0].children![1].children!.length === 1
    : node.title === 'primary_expr'
    ? (node.children![0] as Token).tokenClass === 'IDENTIFIER'
    : false
}

function lvalueLocation(env: CEnv, node: CTree): [number, number] {
  if (!lvalueCheck(node)) throw new Error('lvalue required for left side of operation')
  return helpers.find(
    env,
    node.title === 'unary_expr'
      ? (node.children![0].children![0].children![0] as Token).lexeme
      : (node.children![0] as Token).lexeme
  )
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
  //    of _p: binop token, multiplicative_expr, additive_expr_p
  additive_expr: (node, env) => {
    const list = flatten(node)
    compile(list[0] as CTree, env)
    for (let i = 1; i < list.length; i += 2) {
      const token = list[i] as Token
      const opcode = VALID_BINARY_OPERATORS.get(token.lexeme) as OpCodes
      compile(list[i + 1] as CTree, env)
      Instructions[wc++] = { opcode: opcode }
    }
  },

  // children: equality_expr, and_expr_p
  //    of _p: bitwise and token, equality_expr, and_expr_p
  and_expr: (node, env) => {
    const list = flatten(node)
    compile(list[0] as CTree, env)
    for (let i = 1; i < list.length; i += 2) {
      compile(list[i + 1] as CTree, env)
      Instructions[wc++] = { opcode: OpCodes.BAND }
    }
  },

  // children: conditional_expr
  //        OR unary_expr, assignment_operator, assignment_expr
  assignment_expr: (node, env) => {
    if (node.children!.length === 1) {
      compile(node.children![0] as CTree, env)
    }
    if (node.children!.length === 3) {
      const loc = lvalueLocation(env, node.children![0] as CTree)
      const assOp = node.children![1] as CTree
      const token = assOp.children![0] as Token
      const opcode = VALID_ASSIGNMENT_OPERATORS.get(token.lexeme) as OpCodes
      compile(node.children![2] as CTree, env)
      Instructions[wc++] = {
        opcode: opcode,
        args: loc
      }
      Instructions[wc++] = { opcode: OpCodes.POP }
    }
  },

  // children: stmt
  block_item: (node, env) => compile(node.children![0] as CTree, env),

  // children: block_item, block_item_list_p
  block_item_list: (node, env) => {
    const newEnv = helpers.extend([], env)
    flatten(node).forEach(child => {
      compile(child as CTree, newEnv)
      Instructions[wc++] = { opcode: OpCodes.POP }
    })
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
  //        OR logical_or_expr, '?', expr, ':', conditional_expr
  conditional_expr: (node, env) => {
    if (node.children!.length === 1) {
      compile(node.children![0] as CTree, env)
    } else if (node.children!.length === 5) {
      const pred = node.children![0] as CTree
      const cons = node.children![2] as CTree
      compile(pred, env)
      const jofIns = { opcode: OpCodes.JOF } as Instruction
      Instructions[wc++] = jofIns
      compile(cons, env)
      const gotoIns = { opcode: OpCodes.GOTO } as Instruction
      Instructions[wc++] = gotoIns
      jofIns.args = [wc]
      const alt = node.children![4] as CTree
      compile(alt, env)
      gotoIns.args = [wc]
    }
  },

  // children: declaration_specifiers, init_declarator_list
  declaration: (node, env) => {
    const decSpe = node.children![0] as CTree
    const list = flatten(node.children![1] as CTree)

    // children: init_declarator, init_declarator_list_p
    //    of _p: ",", init_declarator, init_declarator_list_p
    for (let i = 0; i < list.length; i += 2) {
      const initDec = list[i] as CTree
      const name = createName(decSpe, initDec.children![0] as CTree, env)
      const loc = helpers.find(env, name)
      if (initDec.children!.length > 1) {
        const token = initDec.children![1] as Token
        const opcode = VALID_ASSIGNMENT_OPERATORS.get(token.lexeme) as OpCodes
        compile(initDec.children![2] as CTree, env)
        Instructions[wc++] = { opcode: opcode, args: loc }
      }
    }
  },

  // children: type_specifier
  // there may be more than one - be careful
  declaration_specifiers: (node, env) => {
    compile(node.children![0] as CTree, env)
  },

  // children: relational_expr, equality_expr_p
  //    of _p: equality token, relational_expr, equality_expr_p
  equality_expr: (node, env) => {
    const list = flatten(node)
    compile(list[0] as CTree, env)
    for (let i = 1; i < list.length; i += 2) {
      const token = list[i] as Token
      const opcode = VALID_EQUALITY_OPERATORS.get(token.lexeme) as OpCodes
      compile(list[i + 1] as CTree, env)
      Instructions[wc++] = { opcode: opcode }
    }
  },

  // children: assignment_expr, expr_p
  //    of _p: ',', assignment_expr, expr_p
  expr: (node, env) => {
    const list = flatten(node)
    for (let i = 0; i < list.length; i += 2) compile(list[i] as CTree, env)
  },

  // children: and_expr, exclusive_or_expr_p
  //    of _p: xor token, and_expr, exclusive_or_expr_p
  exclusive_or_expr: (node, env) => {
    const list = flatten(node)
    compile(list[0] as CTree, env)
    for (let i = 1; i < list.length; i += 2) {
      compile(list[i + 1] as CTree, env)
      Instructions[wc++] = { opcode: OpCodes.XOR }
    }
  },

  // children: ';'
  //        OR expr, ';'
  expression_stmt: (node, env) => {
    if (node.children!.length === 2) {
      compile(node.children![0] as CTree, env)
    }
  },

  // children: declaration
  //        OR function_definition
  external_declaration: (node, env) => compile(node.children![0] as CTree, env),

  // children: declaration_specifiers, declarator, compound_stmt
  function_definition: (node, env) => {
    const decSpe = node.children![0] as CTree
    const dec = node.children![1] as CTree
    const funcName = createName(decSpe, dec, env)
    const funcLoc = helpers.find(env, funcName)
    if (funcName == 'main') MainPos = funcLoc

    // children: identifier token, direct_declarator_p
    const dirDec = dec.children![0] as CTree
    // children: empty
    //        OR '(', parameter_type_list, ')', direct_declarator_p
    const dirDecP = dirDec.children![1] as CTree
    const tmpEnv = helpers.extend([], env)
    let arity = 0

    // ignore variadic func, so ignore ... in params
    if (dirDecP.children!.length === 4) {
      const parTypeList = dirDecP.children![1] as CTree
      const parList = parTypeList.children![0] as CTree
      const params = parList.listItems
      params.forEach(parDec =>
        createName(parDec.children![0] as CTree, parDec.children![1] as CTree, tmpEnv)
      )
      arity = params.length
    }

    FunctionArityMap[funcName] = arity

    Instructions[wc++] = {
      opcode: OpCodes.LDF,
      args: [arity, wc + 1]
    }
    const gotoPos = wc
    Instructions[wc++] = {
      opcode: OpCodes.GOTO
    }
    compile(node.children![2] as CTree, tmpEnv)
    Instructions[wc++] = { opcode: OpCodes.RMARKER }
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
  //    of _p: bitwise or token, exclusive_or_expr, inclusive_or_expr_p
  inclusive_or_expr: (node, env) => {
    const list = flatten(node)
    compile(list[0] as CTree, env)
    for (let i = 1; i < list.length; i += 2) {
      compile(list[i + 1] as CTree, env)
      Instructions[wc++] = { opcode: OpCodes.BOR }
    }
  },

  // children: assignment_expr
  initializer: (node, env) => compile(node.children![0] as CTree, env),

  // children: while token, '(', expr, ')', stmt
  //        OR do token, stmt, while token, '(', expr, ')', ';'
  //        OR for token, '(', declaration, expression_stmt, expr, ')', stmt
  //        OR for token, '(', expression_stmt, expression_stmt, expr, ')', stmt
  iteration_stmt: (node, env) => {
    const token = node.children![0] as Token
    const iterType = token.lexeme as string

    let loopStart = wc
    // honestly the structure is pretty similar so we can probably refactor them.
    // even a do-while loop simply prepends a goto instruction to the start
    // of the execution.
    if (iterType === 'while') {
      const expr = node.children![2] as CTree
      compile(expr, env)
      const jofIns = { opcode: OpCodes.JOF } as Instruction
      Instructions[wc++] = jofIns
      const stmt = node.children![4] as CTree
      compile(stmt, env)
      Instructions[wc++] = { opcode: OpCodes.CMARKER }
      Instructions[wc++] = {
        opcode: OpCodes.GOTO,
        args: [loopStart]
      }
      Instructions[wc++] = { opcode: OpCodes.BMARKER }
      jofIns.args = [wc]
    } else if (iterType === 'do') {
      const stmt = node.children![1] as CTree
      compile(stmt, env)
      Instructions[wc++] = { opcode: OpCodes.CMARKER }
      const expr = node.children![4] as CTree
      compile(expr, env)
      const jofIns = { opcode: OpCodes.JOF } as Instruction
      Instructions[wc++] = jofIns
      Instructions[wc++] = {
        opcode: OpCodes.GOTO,
        args: [loopStart]
      }
      Instructions[wc++] = { opcode: OpCodes.BMARKER }
      jofIns.args = [wc]
    } else if (iterType === 'for') {
      const dec = node.children![2] as CTree
      compile(dec, env)
      loopStart = wc
      const expr = node.children![3] as CTree
      compile(expr, env)
      const jofIns = { opcode: OpCodes.JOF } as Instruction
      Instructions[wc++] = jofIns
      const stmt = node.children![6] as CTree
      compile(stmt, env)
      Instructions[wc++] = { opcode: OpCodes.CMARKER }
      const update = node.children![4] as CTree
      compile(update, env)
      Instructions[wc++] = {
        opcode: OpCodes.GOTO,
        args: [loopStart]
      }
      Instructions[wc++] = { opcode: OpCodes.BMARKER }
      jofIns.args = [wc]
    }
    // we treat stmts as value producing by default and pop after, so we load an
    // undefined here.
    Instructions[wc++] = {
      opcode: OpCodes.LDC,
      args: []
    }
  },

  // children: jump token, ';'
  //        OR break token, ';'
  //        OR return token, expr, ';'
  // return statements can only occur in functions.
  jump_stmt: (node, env) => {
    const token = node.children![0] as Token
    const iterType = token.lexeme as string
    if (iterType === 'return') {
      compile(node.children![1] as CTree, env)
    }
    const opcode = VALID_CONTROL_OPERATORS.get(iterType) as OpCodes
    Instructions[wc++] = { opcode: opcode }
  },

  // children: inclusive_or_expr, logical_and_expr_p
  //    of _p: logical and token, inclusive_or_expr, logical_and_expr_p
  logical_and_expr: (node, env) => {
    const list = flatten(node)
    compile(list[0] as CTree, env)
    for (let i = 1; i < list.length; i += 2) {
      const opcode = OpCodes.AND
      compile(list[i + 1] as CTree, env)
      Instructions[wc++] = { opcode: opcode }
    }
  },

  // children: logical_and_expr, logical_or_expr_p
  //    of _p: or_op, logical_and_expr, logical_or_expr_p
  logical_or_expr: (node, env) => {
    const list = flatten(node)
    compile(list[0] as CTree, env)
    for (let i = 1; i < list.length; i += 2) {
      const opcode = OpCodes.OR
      compile(list[i + 1] as CTree, env)
      Instructions[wc++] = { opcode: opcode }
    }
  },

  // children: cast_expr, multiplicative_expr_p
  //    of _p: binop token, cast_expr, multiplicative_expr_p
  multiplicative_expr: (node, env) => {
    const list = flatten(node)
    compile(list[0] as CTree, env)
    for (let i = 1; i < list.length; i += 2) {
      const token = list[i] as Token
      const opcode = VALID_BINARY_OPERATORS.get(token.lexeme) as OpCodes
      compile(list[i + 1] as CTree, env)
      Instructions[wc++] = { opcode: opcode }
    }
  },

  // children: primary_expr, postfix_expr_p
  postfix_expr: (node, env) => {
    const priExp = node.children![0] as CTree
    compile(priExp, env)
    // children: epsilon
    //        OR unary op token, postfix_expr_p
    //        OR '(', ')', postfix_expr_p
    //        OR '(', argument_expr_list, ')'
    const posExpP = node.children![1] as CTree
    if (posExpP.children!.length === 1) {
      // variable
    } else if (posExpP.children!.length === 2) {
      // unary operator
      const loc = lvalueLocation(env, priExp)
      const token = posExpP.children![0] as Token
      const opcode = VALID_UNARY_OPERATORS.get(token.lexeme) as OpCodes
      Instructions[wc++] = {
        opcode: opcode,
        args: [-1]
      }
      Instructions[wc++] = {
        opcode: OpCodes.ASSIGN,
        args: loc
      }
      Instructions[wc++] = { opcode: OpCodes.POP }
    } else if (posExpP.children!.length === 3) {
      // function call with no arguments
      const name = (priExp.children![0] as Token).lexeme
      if (FunctionArityMap[name] !== 0) throw new Error('too few arguments to function ' + name)

      Instructions[wc++] = {
        opcode: OpCodes.CALL,
        args: [0]
      }
    } else if (posExpP.children!.length === 4) {
      // function call with arguments
      // children: assignment expr, argument_expr_list_p
      //    of _p: assignment_expr, argument_expr_list_p
      const argExpL = posExpP.children![1] as CTree
      const list = flatten(argExpL)
      console.log(list)
      for (let i = 0; i < list.length; i += 2) {
        compile(list[i] as CTree, env)
      }
      const arity = (list.length + 1) / 2
      const name = (priExp.children![0] as Token).lexeme

      if (FunctionArityMap[name] > arity) throw new Error('too few arguments to function ' + name)
      if (FunctionArityMap[name] < arity) throw new Error('too many arguments to function ' + name)

      Instructions[wc++] = {
        opcode: OpCodes.CALL,
        args: [arity]
      }
    }
  },

  // children: expression token
  primary_expr: (node, env) => {
    const token = node.children![0] as Token
    if (token.tokenClass === 'CONSTANT') {
      const value: number = Number(token.lexeme)
      Instructions[wc++] = { opcode: OpCodes.LDC, args: [value] }
    } else if (token.tokenClass === 'IDENTIFIER') {
      const name: string = token.lexeme
      const loc = helpers.find(env, name)
      Instructions[wc++] = { opcode: OpCodes.LD, args: loc }
    }
  },

  // children: shift_expr, relational_expr_p
  //    of _p: relational token, shift_expr, relational_expr_p
  relational_expr: (node, env) => {
    const list = flatten(node)
    compile(list[0] as CTree, env)
    for (let i = 1; i < list.length; i += 2) {
      const token = list[i] as Token
      const opcode = VALID_RELATIONAL_OPERATORS.get(token.lexeme) as OpCodes
      compile(list[i + 1] as CTree, env)
      Instructions[wc++] = { opcode: opcode }
    }
  },

  // children: if token, '(', expr, ')', stmt
  //        OR if token, '(', expr, ')', stmt, else token, stmt
  selection_stmt: (node, env) => {
    const pred = node.children![2] as CTree
    const cons = node.children![4] as CTree
    compile(pred, env)
    const jofIns = { opcode: OpCodes.JOF } as Instruction
    Instructions[wc++] = jofIns
    compile(cons, env)
    const gotoIns = { opcode: OpCodes.GOTO } as Instruction
    jofIns.args = [wc]
    if (node.children!.length === 7) {
      const alt = node.children![6] as CTree
      compile(alt, env)
    }
    gotoIns.args = [wc]
  },

  // children: additive_expr, shift_expr_p
  //    of _p: shift op, additive_expr, shift_expr_p
  shift_expr: (node, env) => {
    const list = flatten(node)
    compile(list[0] as CTree, env)
    for (let i = 1; i < list.length; i += 2) {
      const token = list[i] as Token
      const opcode = VALID_SHIFT_OPERATORS.get(token.lexeme) as OpCodes
      compile(list[i + 1] as CTree, env)
      Instructions[wc++] = { opcode: opcode }
    }
  },

  // children: expr
  //        OR jump_stmt
  //        OR compound_stmt
  //        OR iteration_stmt
  //        OR selection_stmt
  // we force statements to be value producing.
  stmt: (node, env) => compile(node.children![0] as CTree, env),

  // children: external_declaration, translation_unit_p
  translation_unit: (node, env) => {
    const enterIns = { opcode: OpCodes.ENTER_SCOPE } as Instruction
    const newEnv = helpers.extend([], env)
    Instructions[wc++] = enterIns
    flatten(node).forEach(child => {
      compile(child as CTree, newEnv)
      Instructions[wc++] = { opcode: OpCodes.POP }
    })
    enterIns.args = [newEnv[newEnv.length - 1].length]
    Instructions[wc++] = { opcode: OpCodes.EXIT_SCOPE }
  },

  // children: type specifier token
  type_specifier: (node, env) => {
    // enforce type safety here; probably through an instruction?
  },

  // children: postfix_expr
  //        OR unary token, unary_expr
  unary_expr: (node, env) => {
    if (node.children!.length === 1) {
      compile(node.children![0] as CTree, env)
    } else if (node.children!.length === 2) {
      compile(node.children![1] as CTree, env)
      const token = node.children![0] as Token
      const opcode = VALID_UNARY_OPERATORS.get(token.lexeme) as OpCodes
      Instructions[wc++] = {
        opcode: opcode,
        args: [0]
      }
    }
  }
}

// prelude refers to predefined functions in C (like malloc)
// vmInternalFunctions refers to functions not called by users (like clearing the RTS)
// they are both empty for now but we'll add to them as development progresses
function compileToIns(program: CTree, vmInternalFunctions?: string[]): Program {
  initGlobalVar()
  compile(program, GlobalCompileEnvironment)
  if (MainPos[0] === -1 && MainPos[1] === -1) throw new Error('no main function detected')
  // replace the last exit scope with loading and calling main
  Instructions[wc - 1] = {
    opcode: OpCodes.LD,
    args: MainPos
  }
  Instructions[wc++] = {
    opcode: OpCodes.CALL,
    args: [0]
  }
  Instructions[wc++] = { opcode: OpCodes.EXIT_SCOPE }
  Instructions[wc++] = { opcode: OpCodes.DONE }
  for (let i = 0; i < Instructions.length; i++) {
    console.log(i, Instructions[i])
  }
  return { entry: 0, instrs: Instructions }
}

function compile(expr: CTree, env: CEnv): void {
  // this is handy to find which expr is not defined
  // console.log("compiling", expr.title)
  const compiler = compilers[expr.title]
  if (!compiler) throw Error('Unsupported operation: ' + expr.title)
  compiler(expr, env)
}
