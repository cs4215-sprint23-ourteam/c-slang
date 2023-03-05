import { IOptions, Result } from '..'
import { CannotFindModuleError } from '../errors/localImportErrors'
import { evaluate } from '../interpreter/interpreter'
import { parse } from '../parser/parser'
import { CTree } from '../parser/tree'
import { PreemptiveScheduler } from '../schedulers'
import { Context, Scheduler, Variant } from '../types'
import { compileProgram, runCompiled } from '../vm'
// import { validateAndAnnotate } from '../validator/validator'
import { validateAndAnnotate } from '../validator/validator'
import { compileProgram } from '../vm/vm-compiler'
import { runWithProgram } from '../vm/vm-machine'
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

async function runVM(program: es.Program, context: Context, options: IOptions): Promise<Result> {
  try {
    // compileProgram(program, context)
    return Promise.resolve({
      status: 'finished',
      context,
      value: runWithProgram(compileProgram(program, context), context)
    })
  } catch (error) {
    // implement better error checking in the future
    return resolvedErrorPromise
  }
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

  // if (context.variant === 'vm') {
  //   return runVM(program, context, theOptions)
  // }

  // TODO: Remove this after runners have been refactored.
  //       These should be done as part of the local imports
  //       preprocessing step.
  // removeExports(program)
  // removeNonSourceModuleImports(program)
  // hoistAndMergeImports(program)

  // validateAndAnnotate(program, context)
  // context.unTypecheckedCode.push(code)

  if (context.errors.length > 0) {
    return resolvedErrorPromise
  }

  if (options.variant === Variant.EVALUATOR) {
    return runInterpreter(parsedTree, context, theOptions)
  }
  return Promise.resolve({
    status: 'finished',
    context: context,
    value: runCompiled(compileProgram(parsedTree))
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
