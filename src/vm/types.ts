// simulate a 64-bit system

export enum BaseType {
  void = 0,
  char = 1,
  short = 2,
  int = 4,
  long = 8
}

export type SignedType = {
  type: BaseType
  signed: boolean
}

export type Type = {
  child: Type | SignedType
  const: boolean
  depth: number
}

// we restrict functions to have depth 0
export type FunctionType = Type & {
  params: Type[]
}

// dummy type
export const UndeclaredType: Type = {
  child: {
    type: BaseType.void,
    signed: false
  },
  const: false,
  depth: 0
}

export function compareTypes(left: Type, right: Type): void {
  // this indicates function pointer
  if ('params' in left && 'params' in right) {
    compareTypes(
      {
        child: left.child,
        const: left.const,
        depth: left.depth
      },
      {
        child: right.child,
        const: right.const,
        depth: right.depth
      }
    )
    const l = left as FunctionType
    const r = right as FunctionType
    for (let i = 0; i < l.params.length; i++) {
      compareTypes(l.params[i], r.params[i])
    }
    return
  } else if ('params' in left !== 'params' in right) {
    console.log('warning: initialization from incompatible pointer type')
    return
  }

  if (left.depth === right.depth) {
    if (left.depth === 0) return
    while (left.depth > 0) {
      if (left.const && !right.const) {
        console.log("warning: initialization discards 'const' qualifier from pointer target type")
        return
      }
      left = left.child as Type
      right = right.child as Type
    }
    if (left.const && !right.const) {
      console.log("warning: initialization discards 'const' qualifier from pointer target type")
      return
    }
    if ((left.child as SignedType).type !== (right.child as SignedType).type)
      console.log('warning: initialization from incompatible pointer type')
  } else if (left.depth < right.depth) {
    console.log('warning: initialization makes integer a pointer without cast')
  } else {
    console.log('warning: initialization from incompatible pointer type')
  }
}

export function makeSigned(type: BaseType): SignedType {
  return {
    type: type,
    signed: false
  }
}

export function makeFunctionType(type: Type, params: Type[]): FunctionType {
  return {
    child: type.child,
    const: type.const,
    depth: type.depth,
    params: params
  }
}
