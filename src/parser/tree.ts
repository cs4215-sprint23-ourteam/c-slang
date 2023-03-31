import { CTree as RawTree, Token as RawToken } from './raw-tree'

export interface Token extends RawToken { }

/**
 * helper type that has some type unsafe properties
 */
export class CTree {
  title: string
  children?: (Token | CTree)[]

  constructor(title: string) {
    this.title = title
  }

  get shouldChildren(): (Token | CTree)[] {
    if (this.children) {
      return this.children
    } else {
      throw new Error('no children')
    }
  }

  get nodeChildren(): CTree[] {
    return this.shouldChildren as CTree[]
  }

  get tokenChildren(): Token[] {
    return this.shouldChildren as Token[]
  }

  debugTree(maxDepth: number, depth: number = 0) {
    console.debug('debug tree', depth, this)
    if (depth === maxDepth) return
    if (this.children) {
      this.children.forEach(c => {
        if (c.title) {
          (c as CTree).debugTree(maxDepth, depth + 1)
        }
      })
    }
  }

  findWithTitle(title: string) {
    const result = this.nodeChildren.find(c => 'title' in c && c.title === title)
    if (result === undefined) {
      throw new Error('not found')
    }
    return result
  }

  getLastNode(idx: number) {
    if (idx > this.nodeChildren.length) {
      throw new Error('bad index')
    }
    return this.nodeChildren[this.shouldChildren.length - idx]
  }

  get listItems(): CTree[] {
    if (this.getLastNode(1).title === 'EPSILON') {
      return []
    }
    return [this.getLastNode(2), ...this.getLastNode(1).listItems]
  }
}

export function transformTree(raw: RawTree): CTree {
  const root = new CTree(raw.title!)

  if ('children' in raw && raw.children) {
    root.children = []
    for (const c of raw.children) {
      if (c.title) {
        root.children.push(transformTree(c as RawTree))
      } else {
        root.children.push(c as Token)
      }
    }
  }

  return root
}
