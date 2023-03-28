import { Program } from './compiler'

export function runCompiled(program: Program): string {
  console.debug('debug: program', program)
  return 'run finished'
}
