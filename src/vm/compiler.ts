import { CTree } from '../parser/tree'

export type Program = string[]

export function compile(program: CTree): Program {
  return [program.title!]
}
