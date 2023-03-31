import { Program } from './compiler'


// currently RTS for keeping frames, values are all stored in heap
// move to c-like stack later
type Address = number
const RTS: Address[][] = []
// const STACK: number[] = []

// register for easily doing operations, the OS in homework
const OPERATION_STACK: number[] = []

const HEAP: any[] = []

export function runCompiled(program: Program): string {
  console.debug('debug: program', program)
  return 'run finished'
}
