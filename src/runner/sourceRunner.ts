import { IOptions, Result } from '..'
import { CannotFindModuleError } from '../errors/localImportErrors'
import { evaluate } from '../interpreter/interpreter'
import { parse } from '../parser/parser'
import { CTree } from '../parser/tree'
import { PreemptiveScheduler } from '../schedulers'
import { Context, Scheduler, Variant } from '../types'
import { compile, runCompiled } from '../vm'
// import { validateAndAnnotate } from '../validator/validator'
import { determineVariant, resolvedErrorPromise } from './utils'

const DEFAULT_SOURCE_OPTIONS: IOptions = {
  scheduler: 'async',
  steps: 1000,
  stepLimit: 1000,
  executionMethod: 'auto',
  variant: Variant.DEFAULT,
  originalMaxExecTime: 1000,
  useSubst: false,
  isPrelude: false,
  throwInfiniteLoops: true
}

function runInterpreter(program: CTree, context: Context, options: IOptions): Promise<Result> {
  const it = evaluate(program, context)
  const scheduler: Scheduler = new PreemptiveScheduler(options.steps)
  return scheduler.run(it, context)
}

export async function sourceRunner(
  code: string,
  context: Context,
  options: Partial<IOptions> = {}
): Promise<Result> {
  const theOptions: IOptions = { ...DEFAULT_SOURCE_OPTIONS, ...options }
  context.variant = determineVariant(context, options)
  context.errors = []

  // Parse and validate
  const parsedTree = parse(code, context)
  if (!parsedTree) {
    return resolvedErrorPromise
  }

  if (context.errors.length > 0) {
    return resolvedErrorPromise
  }

  if (options.variant === Variant.EVALUATOR) {
    return runInterpreter(parsedTree, context, theOptions)
  }
  return Promise.resolve({
    status: 'finished',
    context: context,
    value: runCompiled(compile(parsedTree))
  })
}

export async function sourceFilesRunner(
  files: Partial<Record<string, string>>,
  entrypointFilePath: string,
  context: Context,
  options: Partial<IOptions> = {}
): Promise<Result> {
  const entrypointCode = files[entrypointFilePath]
  if (entrypointCode === undefined) {
    context.errors.push(new CannotFindModuleError(entrypointFilePath))
    return resolvedErrorPromise
  }

  context.variant = determineVariant(context, options)
  // TODO: Make use of the preprocessed program AST after refactoring runners.
  // const preprocessedProgram = preprocessFileImports(files, entrypointFilePath, context)
  // if (!preprocessedProgram) {
  //   return resolvedErrorPromise
  // }

  return sourceRunner(entrypointCode, context, options)
}
