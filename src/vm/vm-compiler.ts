import { CTree, Token } from '../parser/tree'
import { OpCodes } from './opcodes'
import {
  BaseType,
  compareTypes,
  FunctionType,
  makeFunctionType,
  makeSigned,
  SignedType,
  Type,
  UndeclaredType
} from './types'

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
  ['--', OpCodes.DEC],
  ['*', OpCodes.DEREF],
  ['&', OpCodes.REF]
])

const TYPES = new Map([
  ['void', makeSigned(BaseType.void)],
  ['char', makeSigned(BaseType.char)],
  ['short', makeSigned(BaseType.short)],
  ['int', makeSigned(BaseType.int)],
  ['long', makeSigned(BaseType.long)]
])

export type Instruction = {
  opcode: OpCodes
  args?: Argument[]
}

export type Argument = number
export type Program = {
  entry: number
  instrs: Instruction[]
}

// compile-time frame and environment
type CName = {
  name: string
  type: Type
}
type CFrame = CName[]
type CEnv = CFrame[]

let wc = 0
let Instructions: Instruction[] = []
let MainPos: [number, number] = [-1, -1]
const BuiltInFunctionNames: CFrame = []
const ConstantNames: CFrame = []
const GlobalCompileEnvironment: CEnv = [BuiltInFunctionNames, ConstantNames]
// type-checking is excruciating to deal with, especially in exprs with many layers of nested
// exprs. since we don't return any information while compiling, we use a global stack to throw
// the type back so we can check if it's allowed.
let returnType: Type
const TypeStack: Type[] = []

function initGlobalVar() {
  wc = 0
  Instructions = []
  MainPos = [-1, -1]
}

// for dealing with compile-time environments
const helpers = {
  declare: (name: string, type: Type, frame: CFrame): void => {
    frame.forEach(cname => {
      if (cname.name == name) throw new Error('declaring existing name ' + name)
    })
    frame.push({
      name: name,
      type: type
    })
  },
  extend: (frame: CFrame, env: CEnv): CEnv => [...env, frame],
  find: (env: CEnv, name: string): [number, number] => {
    const loc = helpers.position(env, name)
    if (loc[0] === -1 && loc[1] === -1) throw new Error('undeclared name ' + name + ' used')
    return loc
  },
  lookup: (frame: CFrame, name: string): number => {
    for (let i = 0; i < frame.length; i++) {
      if (frame[i].name == name) return i
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

// handles (Type, declarator) pair - top level declarators only
// children of declarator: pointer, direct_declarator
// children of direct_declarator: id_token, direct_declarator_p
//                            OR '(', declarator, ')', direct_declarator_p
// function pointers are characterized by 1. a pointer and 2. (args...) after the
// name.
function createName(baseType: Type, dec: CTree, env: CEnv, funcPtr: boolean = true): string {
  const arr = extractName(baseType, dec)
  const name = arr[0] as string
  let type = arr[1] as Type

  if (arr[2] !== undefined && funcPtr) {
    // naming becomes atrocious at 6am
    let paramsList = [] as Type[]
    if (arr[2] !== null) {
      const parTypeList = arr[2]
      const parList = parTypeList.children![0] as CTree
      const params = parList.listItems
      paramsList = params.map(parDec => createTypeFromList(parDec.children![0] as CTree)) as Type[]
    }
    // dereference the pointer
    type = makeFunctionType(type.child as Type, paramsList)
  }
  helpers.declare(name, type, env[env.length - 1])
  TypeStack.push(type)
  return name
}

// recursively delves into a declarator node to extract the type and name
// of the object. if at any point we find some argument_list we know it's
// a function pointer.
function extractName(baseType: Type, dec: CTree): [string, Type, CTree | undefined | null] {
  let type = baseType
  let node = dec
  let params = undefined
  while (true) {
    let dir_dec = node.children![0]
    if (node.children!.length === 2) {
      const pointer = node.children![0] as CTree
      type = updateTypeWithPointer(type, pointer)
      dir_dec = node.children![1] as CTree
    }
    const dir_dec_p = dir_dec.children![dir_dec.children!.length - 1]
    if (dir_dec_p.children!.length === 3) {
      params = null
    } else if (dir_dec_p.children!.length === 4) {
      // some param list exists
      params = dir_dec_p.children![1] as CTree
    }
    if (dir_dec.children!.length === 2) {
      // id token found
      const name = (dir_dec.children![0] as Token).lexeme as string
      return [name, type, params]
    } else if (dir_dec.children!.length === 4) {
      // the search continues...
      node = dir_dec.children![1] as CTree
    }
  }
}

// both specifier_qualifier_list and declaration_specifiers have the same children
// structure
// children of possible lists: type_qualifier
//                          OR type_specifier
//                          OR type_qualifier, declaration_specifiers
//                          OR type_specifier, declaration_specifiers
function createTypeFromList(decSpe: CTree): Type {
  const type = UndeclaredType
  let node = decSpe
  while (true) {
    const typeNode = node.children![0] as CTree
    if (typeNode.title === 'type_qualifier') {
      type.const = true
    } else {
      const token = typeNode.children![0] as Token
      const qual = token.lexeme as string
      const child = TYPES.get(qual) as SignedType
      type.child = child
    }
    if (node.children!.length > 1) node = node.children![1] as CTree
    else break
  }
  return type
}

// children of type_name: specifier_qualifier_list
//                    OR  specifier_qualifier_list, abstract_declarator
// children of abstract_declarator: pointer
function createTypeFromTypeName(typeName: CTree): Type {
  const listNode = typeName.children![0] as CTree
  let type = createTypeFromList(listNode)
  if (typeName.children!.length === 2) {
    const pointer = typeName.children![1].children![0] as CTree
    type = updateTypeWithPointer(type, pointer)
  }
  return type
}

// children of pointer: pointer token
//                   OR pointer token, pointer
//                   OR pointer token, type_qualifier_list
//                   OR pointer token, type_qualifier_list, pointer
function updateTypeWithPointer(type: Type, pointer: CTree): Type {
  let newType = type
  while (true) {
    newType = {
      child: type,
      const: false,
      depth: type.depth + 1
    }
    if (pointer.children!.length === 1) {
      break
      // if a type_qualifier_list exists, it contains one or more consts and volatiles.
      // we only consider consts (so volatile will cause undefined behavior).
    } else if (pointer.children!.length === 2) {
      if (pointer.children![1].title === 'pointer') {
        pointer = pointer.children![1] as CTree
      } else {
        newType.const = true
        break
      }
    } else if (pointer.children!.length === 3) {
      pointer = pointer.children![2] as CTree
      newType.const = true
    }
  }
  return newType
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
// we should ONLY run this check on cast_expr, unary_expr OR primary_expr, wherein the
// structure we are looking for is:
//  cast_expr
//   => unary_expr
//    => postfix_expr
//      => primary_expr (guaranteed)
//        => (constant or) identifier token
//      => postfix_expr_p (guaranteed)
//        => EPSILON (or others of length != 1)
// note that unary_expr can also have unary_token, unary_expr children.
// we can skip some sanity checks because of the above guarantees.
// reject everything else.
function lvalueCheck(node: CTree): boolean {
  return node.title === 'cast_expr'
    ? lvalueCheck(node.children![0] as CTree)
    : node.title === 'unary_expr'
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
    node.title === 'cast_expr'
      ? (node.children![0].children![0].children![0].children![0] as Token).lexeme
      : node.title === 'unary_expr'
      ? (node.children![0].children![0].children![0] as Token).lexeme
      : (node.children![0] as Token).lexeme
  )
}

export function compileProgram(program: CTree): Program {
  // pre-process prelude and vmInternalFunctions
  return compileToIns(program)
}

// we treat all statements as value producing, so we load an undefined in some cases.
const compilers: { [nodeType: string]: (node: CTree, env: CEnv) => void } = {
  EPSILON: (node, env) => {},

  // children: multiplicative_expr, additive_expr_p
  //    of _p: binop token, multiplicative_expr, additive_expr_p
  additive_expr: (node, env) => {
    const list = flatten(node)
    compile(list[0] as CTree, env)
    for (let i = 1; i < list.length; i += 2) {
      const type = TypeStack.pop()!
      if (type.depth > 0) throw new Error('invalid operands to binary + or -')
      const token = list[i] as Token
      const opcode = VALID_BINARY_OPERATORS.get(token.lexeme) as OpCodes
      compile(list[i + 1] as CTree, env)
      if (TypeStack.pop()!.depth > 0) throw new Error('invalid operands to binary + or -')
      Instructions[wc++] = { opcode: opcode }
      TypeStack.push(type)
    }
  },

  // children: equality_expr, and_expr_p
  //    of _p: bitwise and token, equality_expr, and_expr_p
  and_expr: (node, env) => {
    const list = flatten(node)
    compile(list[0] as CTree, env)
    for (let i = 1; i < list.length; i += 2) {
      const type = TypeStack.pop()!
      if (type.depth > 0) throw new Error('invalid operands to binary &')
      compile(list[i + 1] as CTree, env)
      if (TypeStack.pop()!.depth > 0) throw new Error('invalid operands to binary &')
      Instructions[wc++] = { opcode: OpCodes.BAND }
      TypeStack.push(type)
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
      if (opcode == OpCodes.ASSIGN) {
        const lType = env[loc[0]][loc[1]].type
        const rType = TypeStack.pop() as Type
        compareTypes(lType, rType)
        TypeStack.push(lType)
      }
      Instructions[wc++] = {
        opcode: opcode,
        args: loc
      }
    }
  },

  // children: stmt
  block_item: (node, env) => compile(node.children![0] as CTree, env),

  // children: block_item, block_item_list_p
  block_item_list: (node, env) => {
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

  // children: unary_expr
  //        OR '(', type_name, ')', cast_expr
  cast_expr: (node, env) => {
    if (node.children!.length === 1) {
      compile(node.children![0] as CTree, env)
    } else if (node.children!.length === 4) {
      compile(node.children![3] as CTree, env)
      const rtype = TypeStack.pop()!
      const ltype = createTypeFromTypeName(node.children![1] as CTree)
      compareTypes(ltype, rtype)
      TypeStack.push(ltype)
    }
  },

  // children: '{', '}'
  //        OR '{', block_item_list, '}'
  compound_stmt: (node, env) => {
    if (node.children!.length === 3) {
      compile(node.children![1] as CTree, env)
    }
    Instructions[wc++] = {
      opcode: OpCodes.LDC,
      args: []
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
    const type = createTypeFromList(decSpe)

    // children: init_declarator, init_declarator_list_p
    //    of _p: ",", init_declarator, init_declarator_list_p
    for (let i = 0; i < list.length; i += 2) {
      const initDec = list[i] as CTree
      const name = createName(type, initDec.children![0] as CTree, env)
      const loc = helpers.find(env, name)
      const lType = TypeStack.pop()!
      if (initDec.children!.length > 1) {
        const token = initDec.children![1] as Token
        const opcode = VALID_ASSIGNMENT_OPERATORS.get(token.lexeme) as OpCodes
        compile(initDec.children![2] as CTree, env)
        if (opcode == OpCodes.ASSIGN) {
          const rType = TypeStack.pop()!
          compareTypes(lType, rType)
          TypeStack.push(lType)
        }
        Instructions[wc++] = { opcode: opcode, args: loc }
      } else {
        Instructions[wc++] = {
          opcode: OpCodes.LDC,
          args: []
        }
      }
      Instructions[wc++] = { opcode: OpCodes.POP }
    }
    Instructions.pop()
    wc--
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
    const type = createTypeFromList(decSpe)
    const dec = node.children![1] as CTree
    const funcName = createName(type, dec, env, false)
    // const funcName = pair[0]
    // const funcType = pair[1]
    returnType = TypeStack.pop()!
    const funcLoc = helpers.find(env, funcName)
    if (funcName == 'main') MainPos = funcLoc

    // children: identifier token, direct_declarator_p
    const dirDec = dec.children![0] as CTree
    // children: empty
    //        OR '(', parameter_type_list, ')', direct_declarator_p
    const dirDecP = dirDec.children![1] as CTree
    const tmpEnv = helpers.extend([], env)
    let arity = 0
    const paramTypes: Type[] = []

    // ignore variadic func, so ignore ... in params
    if (dirDecP.children!.length === 4) {
      const parTypeList = dirDecP.children![1] as CTree
      const parList = parTypeList.children![0] as CTree
      const params = parList.listItems
      params.forEach(parDec => {
        createName(
          createTypeFromList(parDec.children![0] as CTree),
          parDec.children![1] as CTree,
          tmpEnv
        )
        paramTypes.push(TypeStack.pop()!)
      })
      arity = params.length
    }

    const loc = helpers.find(env, funcName)
    env[loc[0]][loc[1]].type = makeFunctionType(env[loc[0]][loc[1]].type, paramTypes)

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
      const type = TypeStack.pop()!
      if (type.depth > 0) throw new Error('invalid operands to binary |')
      compile(list[i + 1] as CTree, env)
      if (TypeStack.pop()!.depth > 0) throw new Error('invalid operands to binary |')
      Instructions[wc++] = { opcode: OpCodes.BOR }
      TypeStack.push(type)
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
      const enterIns = { opcode: OpCodes.ENTER_SCOPE } as Instruction
      Instructions[wc++] = enterIns
      const dec = node.children![2] as CTree
      const newEnv = helpers.extend([], env)
      compile(dec, newEnv)
      enterIns.args = [newEnv[newEnv.length - 1].length]
      if (enterIns.args![0] !== 0) {
        Instructions[wc++] = { opcode: OpCodes.POP }
      }
      loopStart = wc
      const expr = node.children![3] as CTree
      compile(expr, newEnv)
      const jofIns = { opcode: OpCodes.JOF } as Instruction
      Instructions[wc++] = jofIns
      const stmt = node.children![6] as CTree
      compile(stmt, newEnv)
      Instructions[wc++] = { opcode: OpCodes.POP }
      Instructions[wc++] = { opcode: OpCodes.CMARKER }
      const update = node.children![4] as CTree
      compile(update, newEnv)
      Instructions[wc++] = { opcode: OpCodes.POP }
      Instructions[wc++] = {
        opcode: OpCodes.GOTO,
        args: [loopStart]
      }
      Instructions[wc++] = { opcode: OpCodes.BMARKER }
      jofIns.args = [wc]
      Instructions[wc++] = { opcode: OpCodes.EXIT_SCOPE }
    }
    Instructions[wc++] = {
      opcode: OpCodes.LDC,
      args: []
    }
  },

  // children: jump token, ';'
  //        OR break token, ';'
  //        OR return token, ';'
  //        OR return token, expr, ';'
  // return statements can only occur in functions.
  jump_stmt: (node, env) => {
    const token = node.children![0] as Token
    const iterType = token.lexeme as string
    const opcode = VALID_CONTROL_OPERATORS.get(iterType) as OpCodes
    if (iterType === 'return' && node.children!.length === 3) {
      let type = UndeclaredType
      if (node.children!.length === 3) {
        compile(node.children![1] as CTree, env)
        type = TypeStack.pop()!
      }
      if (
        returnType.depth === 0 &&
        (returnType.child as SignedType).type === BaseType.void &&
        node.children!.length === 3
      ) {
        console.log("warning: 'return' with a value, in function returning void")
      } else {
        compareTypes(returnType, type)
      }
    } else {
      Instructions[wc++] = {
        opcode: OpCodes.LDC,
        args: []
      }
    }
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
      const type = TypeStack.pop()!
      if (type.depth > 0) throw new Error('invalid operands to binary * or /')
      const token = list[i] as Token
      const opcode = VALID_BINARY_OPERATORS.get(token.lexeme) as OpCodes
      compile(list[i + 1] as CTree, env)
      if (TypeStack.pop()!.depth > 0) throw new Error('invalid operands to binary * or /')
      Instructions[wc++] = { opcode: opcode }
      TypeStack.push(type)
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

      // we only get to this segment with function calls
      const loc = helpers.find(env, name)
      const type = env[loc[0]][loc[1]].type as FunctionType
      const params = type.params
      if (params.length !== 0) throw new Error('too few arguments to function ' + name)

      TypeStack.push({
        child: type.child,
        const: type.const,
        depth: type.depth
      })

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
      for (let i = 0; i < list.length; i += 2) {
        compile(list[i] as CTree, env)
      }
      const arity = (list.length + 1) / 2
      const name = (priExp.children![0] as Token).lexeme

      // we also only get to this segment with function calls
      const loc = helpers.find(env, name)
      const type = env[loc[0]][loc[1]].type as FunctionType
      const params = type.params
      if (params.length > arity) throw new Error('too few arguments to function ' + name)
      if (params.length < arity) throw new Error('too many arguments to function ' + name)

      for (let i = params.length - 1; i >= 0; i--) {
        compareTypes(params[i], TypeStack.pop()!)
      }

      TypeStack.push({
        child: type.child,
        const: type.const,
        depth: type.depth
      })

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
      let raw = token.lexeme
      while ((raw.at(-1) as string) > '9' && (raw.at(1) as string) <= '9') {
        raw = raw.slice(0, -1)
      }
      const value = Number(raw)
      Instructions[wc++] = { opcode: OpCodes.LDC, args: [value] }
      // we just use the least generalised type possible. this is because we check for
      // possible truncation during assignment but not padding, because we don't actually
      // do any casting in the compiler (since we don't ever handle raw values, we just
      // load them for the machine to do).
      TypeStack.push({
        child: makeSigned(BaseType.char),
        const: true,
        depth: 0
      })
    } else if (token.tokenClass === 'IDENTIFIER') {
      const name: string = token.lexeme
      const loc = helpers.find(env, name)
      Instructions[wc++] = { opcode: OpCodes.LD, args: loc }
      TypeStack.push(env[loc[0]][loc[1]].type)
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
    Instructions[wc++] = {
      opcode: OpCodes.LDC,
      args: []
    }
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

  // children: postfix_expr
  //        OR unary token, unary_expr
  //        OR unary_operator, unary_expr
  unary_expr: (node, env) => {
    if (node.children!.length === 1) {
      compile(node.children![0] as CTree, env)
    } else if (node.children!.length === 2) {
      const loc = lvalueLocation(env, node.children![1] as CTree)
      if ('lexeme' in node.children![0]) {
        compile(node.children![1] as CTree, env)
        const token = node.children![0] as Token
        const opcode = VALID_UNARY_OPERATORS.get(token.lexeme) as OpCodes
        Instructions[wc++] = {
          opcode: opcode,
          args: [0]
        }
        Instructions[wc++] = {
          opcode: OpCodes.ASSIGN,
          args: loc
        }
        Instructions[wc++] = { opcode: OpCodes.POP }
      } else {
        const unaOp = node.children![0] as CTree
        const token = unaOp.children![0] as Token
        const opcode = VALID_UNARY_OPERATORS.get(token.lexeme) as OpCodes
        const type = TypeStack.pop()! as Type
        if (opcode === OpCodes.DEREF) {
          if (type.depth === 0) throw new Error('invalid type argument of unary *')
          TypeStack.push(type.child as Type)
        } else if (opcode === OpCodes.REF) {
          TypeStack.push({
            child: type,
            const: false,
            depth: type.depth + 1
          })
        }
        Instructions[wc++] = {
          opcode: opcode,
          args: loc
        }
      }
    }
  }
}

// prelude refers to predefined functions in C (like malloc)
// vmInternalFunctions refers to functions not called by users (like clearing the RTS)
// they are both empty for now but we'll add to them as development progresses
function compileToIns(program: CTree): Program {
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
