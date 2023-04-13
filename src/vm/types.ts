// simulate a 64-bit system

export enum BaseType {
  void = 0,
  char = 1,
  short = 2,
  int = 4,
  addr = 8,
  long = 8
}

const BaseTypeStrings = new Map([
  [BaseType.void, 'void'],
  [BaseType.char, 'char'],
  [BaseType.short, 'short'],
  [BaseType.int, 'int'],
  [BaseType.long, 'long']
])

export type SignedType = {
  type: BaseType
  signed: boolean
}

export type Type = {
  child: Type | SignedType
  const: boolean
  depth: number
  size?: number
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
  } as const,
  const: false,
  depth: 0
} as const

export function getSizeFromType(t: Type) {
  if ('size' in t && t.size !== undefined) {
    return t.size
  }
  let c = t.child
  while (!('signed' in c)) {
    c = c.child
  }
  return c.type
}

export enum Warnings {
  SUCCESS = '',
  INC_PTR = ' from incompatible pointer type ',
  NO_CONST = " discards 'const' qualifier from pointer target type",
  INT_TO_PTR = ' makes integer from pointer without a cast',
  PTR_TO_INT = ' makes pointer from integer without a cast'
}

export function compareTypes(left: Type, right: Type, isReturn: boolean = false): string {
  // this indicates function pointer
  if ('params' in left && 'params' in right) {
    let warning = compareTypes(
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
    if (warning !== Warnings.SUCCESS)
      return warningToString(Warnings.INC_PTR, left, right, isReturn)
    const l = left as FunctionType
    const r = right as FunctionType
    for (let i = 0; i < l.params.length; i++) {
      warning = compareTypes(l.params[i], r.params[i])
      if (warning !== Warnings.SUCCESS)
        return warningToString(Warnings.INC_PTR, left, right, isReturn)
    }
    return Warnings.SUCCESS
  } else if ('params' in left) {
    return warningToString(Warnings.PTR_TO_INT, left, right, isReturn)
  } else if ('params' in right) {
    return warningToString(Warnings.INT_TO_PTR, left, right, isReturn)
  }
  if (left.depth === right.depth) {
    if (left.depth === 0) return Warnings.SUCCESS
    let warning = Warnings.SUCCESS
    let l = left
    let r = right
    let i = 0
    // outer two 'layers' of const gives a no_const warning
    while (l.depth > 0 && i++ < 2) {
      if (!l.const && r.const) warning = Warnings.NO_CONST
      l = l.child as Type
      r = r.child as Type
    }
    while (l.depth > 0) {
      if (!l.const && r.const) return warningToString(Warnings.INC_PTR, left, right, isReturn)
      l = l.child as Type
      r = r.child as Type
    }
    if ((l.child as SignedType).type !== (r.child as SignedType).type)
      return warningToString(Warnings.INC_PTR, left, right, isReturn)
    else return warningToString(warning, left, right, isReturn)
  } else if (left.depth === 0) {
    return warningToString(Warnings.PTR_TO_INT, left, right, isReturn)
  } else {
    return right.depth !== 0
      ? warningToString(Warnings.INC_PTR, left, right, isReturn)
      : Warnings.SUCCESS
  }
}

function warningToString(
  warning: Warnings,
  left: Type,
  right: Type,
  isReturn: boolean = false
): string {
  switch (warning) {
    case Warnings.INC_PTR:
      return isReturn
        ? 'returning ' +
            typeToString(right) +
            ' from a function with incompatible return type ' +
            typeToString(left)
        : ' of ' + typeToString(left) + Warnings.INC_PTR + typeToString(right)
    case Warnings.NO_CONST:
      return isReturn
        ? "return discards 'const' qualifier from pointer target type"
        : Warnings.NO_CONST
    case Warnings.PTR_TO_INT:
    case Warnings.INT_TO_PTR:
      return isReturn
        ? 'returning ' +
            typeToString(right) +
            ' from a function with return type ' +
            typeToString(left) +
            warning
        : ' of ' + typeToString(left) + ' from ' + typeToString(right) + warning
    default:
      return ''
  }
}

// separate function because comparison process is much shorter
export function compareTypesInCast(left: Type, right: Type): string {
  return left.depth === right.depth
    ? Warnings.SUCCESS
    : left.depth > right.depth &&
      right.depth !== 0 &&
      (right.child as SignedType).type !== BaseType.long
    ? 'cast to pointer from integer of different size'
    : left.depth !== 0 && (left.child as SignedType).type !== BaseType.long
    ? 'cast from pointer to integer of different size'
    : Warnings.SUCCESS
}

export function makeSized(type: Type, size: number): Type {
  return {
    child: type.child,
    const: type.const,
    depth: type.depth,
    size: size
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
    params: params,
    size: type.size
  }
}

export function typeToString(type: Type): string {
  if (type.depth === 0) {
    // function pointer
    if ('params' in type) {
    }
    return (
      (type.const ? "'const " : "'") + BaseTypeStrings.get((type.child as SignedType).type) + "'"
    )
  }
  const str = typeToString(type.child as Type).slice(0, -1)
  return str + (str.slice(-1) == '*' ? '' : ' ') + '*' + (type.const ? ' const' : '') + "'"
}
