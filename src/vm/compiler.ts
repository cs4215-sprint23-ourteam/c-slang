import { CTree } from '../parser/tree'
import { OpCodes } from './opcodes'

export type Argument = number | string
export type Instruction = {
  code: OpCodes
  values?: Argument[]
}
export type Program = {
  entry: number
  instructions: Instruction[]
}

let wc = 0
const instructions: Instruction[] = []

// corresponding to RTS in vm
const symbols: string[][] = [[]]

function initGlobalVar() {
  wc = 0
  instructions.length = 0
  symbols.length = 0
  symbols.push([])
}

function lookupPos(s: string) {
  for (const [frameIdx, frame] of symbols.entries()) {
    const pos = frame.indexOf(s)
    if (pos !== -1) {
      return [frameIdx, pos]
    }
  }
  return undefined
}

const helpers = {
  declare: (name: string) => {
    symbols[symbols.length - 1].push(name)
  },
  assign: (name: string) => {
    const pos = lookupPos(name)
    if (pos === undefined) {
      throw new Error('assigning to undeclared symbol')
    }
    instructions[wc++] = {
      code: OpCodes.ASSIGN,
      values: pos
    }
  },
}

function typeHelper<T extends { [key: string]: (node: CTree) => void }>(arg: T): T {
  return arg;
}

const compilers = typeHelper({
  external_declaration: (node) => {
    compile(node.nodeChildren[0])
  },
  declaration: (node) => {
  },
  function_definition: (node) => {
    // ignore type_specifier
    // process declarator, ignore pointer, get name, get parameters
    if (node.nodeChildren[1].title !== 'declarator') {
      throw new Error()
    }
    const direct = node.nodeChildren[1].findWithTitle('direct_declarator')
    if (direct === undefined || direct.tokenChildren[0].tokenClass !== 'IDENTIFIER') {
      throw new Error()
    }
    const name = direct.tokenChildren[0].lexeme
    // ignore variadic func, so ignore ... in params
    const params: string[] = []
    if (direct.nodeChildren[1].nodeChildren.length === 4) {
      const paramList = direct.nodeChildren[1].nodeChildren[1].nodeChildren[0]
      paramList.listItems.forEach(decl => {
        params.push(decl.getLastNode(1).getLastNode(1).tokenChildren[0].lexeme)
      })
    }

    helpers.declare(name)

    // add LDF, add GOTO to jump over function body, extend compile time symbol table, and compile body
    instructions[wc++] = {
      code: OpCodes.LDF,
      values: [wc + 1]
    }
    const gotoPos = wc
    instructions[wc++] = {
      code: OpCodes.GOTO,
    }
    symbols.push(params)
    compile(node.getLastNode(1))
    // seems no need of LDC for statements since no support for top level expressions
    instructions[wc++] = {
      code: OpCodes.LDC,
    }
    instructions[wc++] = {
      code: OpCodes.RESET
    }
    instructions[gotoPos].values = [wc]

    helpers.assign(name)

    console.debug('debug', symbols)
  },

  compound_stmt: (node) => {
    if (node.shouldChildren.length === 2) {
      return
    }
    node.nodeChildren[1].listItems.forEach(compile)
  },
  stmt: (node) => {
  }

})

export function compile(node: CTree) {
  console.debug('debug', node)
  const compiler = compilers[node.title]
  if (!compiler) throw Error('Unsupported operation')
  compiler(node)
}

function compileToIns(
  parsedTree: CTree,
): Program {
  parsedTree.listItems.forEach(c => compile(c))
  instructions[wc++] = { code: OpCodes.DONE }
  return { entry: 0, instructions: instructions }
}

export function compileProgram(parsedTree: CTree): Program {
  initGlobalVar()
  return compileToIns(parsedTree)
}
