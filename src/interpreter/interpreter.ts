/* tslint:disable:max-classes-per-file */

// import { RuntimeSourceError } from '../errors/runtimeSourceError'
import { CTree, Token } from '../parser/tree'
import { Context, Environment, Value } from '../types'
// import { evaluateBinaryExpression, evaluateUnaryExpression } from '../utils/operators'
// import * as rttc from '../utils/rttc'

class Thunk {
  public value: Value
  public isMemoized: boolean
  constructor(public exp: CTree, public env: Environment) {
    this.isMemoized = false
    this.value = null
  }
}

function* forceIt(val: any, context: Context): Value {
  if (val instanceof Thunk) {
    if (val.isMemoized) return val.value

    pushEnvironment(context, val.env)
    const evalRes = yield* actualValue(val.exp, context)
    popEnvironment(context)
    val.value = evalRes
    val.isMemoized = true
    return evalRes
  } else return val
}

export function* actualValue(exp: CTree, context: Context): Value {
  const evalResult = yield* evaluate(exp, context)
  const forced = yield* forceIt(evalResult, context)
  return forced
}

// const handleRuntimeError = (context: Context, error: RuntimeSourceError): never => {
//   context.errors.push(error)
//   context.runtime.environments = context.runtime.environments.slice(
//     -context.numberOfOuterEnvironments
//   )
//   throw error
// }

function* leave(context: Context) {
  context.runtime.break = false
  context.runtime.nodes.shift()
  yield context
}

const popEnvironment = (context: Context) => context.runtime.environments.shift()
export const pushEnvironment = (context: Context, environment: Environment) => {
  context.runtime.environments.unshift(environment)
  context.runtime.environmentTree.insert(environment)
}

export type Evaluator<T extends CTree> = (node: T, context: Context) => IterableIterator<Value>

/**
 * WARNING: Do not use object literal shorthands, e.g.
 *   {
 *     *Literal(node: es.Literal, ...) {...},
 *     *ThisExpression(node: es.ThisExpression, ..._ {...},
 *     ...
 *   }
 * They do not minify well, raising uncaught syntax errors in production.
 * See: https://github.com/webpack/webpack/issues/7566
 */
// tslint:disable:object-literal-shorthand
// prettier-ignore
export const evaluators: { [nodeType: string]: Evaluator<CTree> } = {
  /** Simple Values */

  additive_expr_p: function*(node: CTree, context: Context) {
    const value = yield* actualValue(node.children![1] as CTree, context)
    const rest = yield* actualValue(node.children![2] as CTree, context)
    if ((node.children![0] as Token).tokenClass === "+") {
      return value + rest
    } else {
      return -value + rest
    }
  },

  additive_expr: function*(node: CTree, context: Context) {
    const left = yield* actualValue(node.children![0] as CTree, context)
    const right = yield* actualValue(node.children![1] as CTree, context)
    // const error = rttc.checkBinaryExpression(node, node.operator, left, right)
    // if (error) {
    //   return handleRuntimeError(context, error)
    // }
    // return evaluateBinaryExpression(node.operator, left, right)
    return left + right
  },

  EPSILON: function*(node: CTree, context: Context) {
    return
  },

  declaration: function*(node: CTree, context: Context) {
    const specifiers = node.children![0].children
    console.debug('debug: specifiers', specifiers)
    return specifiers;
  },

  translation_unit: function*(node: CTree, context: Context) {
    const result = yield* forceIt(yield* evaluateExternalDeclaration(context, node), context);
    return result;
  }
}
// tslint:enable:object-literal-shorthand
function* evaluateExternalDeclaration(context: Context, node: CTree) {
  let result
  for (const external_declaration of node.children!) {
    result = yield* evaluate((external_declaration as CTree).children![0] as CTree, context)
  }
  return result
}

export function* evaluate(node: CTree, context: Context) {
  console.debug('debug: node', node)
  const result = yield* evaluators[node.title!](node, context)
  yield* leave(context)
  console.debug('debug: result', result)
  return result
}
