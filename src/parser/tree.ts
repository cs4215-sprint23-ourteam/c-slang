import { CTree as RawTree, Token } from './raw-tree'

/**
 * helper type that has some type unsafe properties
 */
export interface CTree {
  readonly title: string
  readonly children?: (Token | CTree)[]
  readonly nodeChildren: CTree[]
  readonly tokenChildren: Token[]
  readonly firstChild: Token | CTree
}

export { Token } from './raw-tree'

class CTreeNode implements CTree {
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

  get firstChild(): Token | CTree {
    return this.shouldChildren[0]
  }

  get nodeChildren(): CTree[] {
    return this.shouldChildren as CTree[]
  }

  get tokenChildren(): Token[] {
    return this.shouldChildren as Token[]
  }
}

export function transformTree(raw: RawTree): CTree {
  const root = new CTreeNode(raw.title!)

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
