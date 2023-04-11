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

// dummy type
export const UndeclaredType: Type = {
  child: {
    type: BaseType.void,
    signed: false
  },
  const: false,
  depth: 0
}

export function compareTypes(left: Type, right: Type, params: boolean = false): void {
  if (left.depth === right.depth) {
    if (left.depth === 0) return
    while (left.depth > 0) {
      if (left.const && !right.const)
        console.log("warning: initialization discards 'const' qualifier from pointer target type")
      left = left.child as Type
      right = right.child as Type
    }
    if (left.const && !right.const)
      console.log("warning: initialization discards 'const' qualifier from pointer target type")
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
