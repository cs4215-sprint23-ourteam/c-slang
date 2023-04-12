import { BaseType } from "./types"

class MemoryManager {
  totalSize: number
  nodes: { start: number, size: number, allocated: boolean }[]

  constructor(size: number) {
    this.make(size)
  }

  make(size: number) {
    this.totalSize = size
    this.nodes = [{ start: 0, size: size, allocated: false }]
  }

  allocate(size: number) {
    const idx = this.nodes.findIndex(node => node.size >= size && !node.allocated)
    if (idx === -1) {
      return undefined
    }
    const original = this.nodes[idx]
    const splitted = { start: original.start + size, size: original.size - size, allocated: false }
    original.size = size
    original.allocated = true
    if (splitted.size > 0) {
      this.nodes.splice(idx + 1, 0, splitted)
    }
    return original.start
  }

  free(addr: number) {
    const idx = this.nodes.findIndex(node => node.start = addr)
    if (idx === -1) {
      return undefined
    }
    this.nodes[idx].allocated = false
    while (idx + 1 < this.nodes.length && !this.nodes[idx + 1].allocated) {
      this.nodes[idx].size += this.nodes[idx + 1].size
      this.nodes.splice(idx + 1, 1)
    }
    return 0
  }
}

const ADDRESS_SPACE = 1024 * 1024 * 64
const MEMORY = new DataView(new ArrayBuffer(ADDRESS_SPACE))

export const HEAP_MANAGER = new MemoryManager(ADDRESS_SPACE / 2)

export function getValueFromAddr(addr: number, length: BaseType) {
  if (length === BaseType.char) {
    return MEMORY.getInt8(addr)
  }
  else if (length === BaseType.short) {
    return MEMORY.getInt16(addr)
  }
  else if (length === BaseType.int) {
    return MEMORY.getInt32(addr)
  }
  else if (length === BaseType.long) {
    return Number(MEMORY.getBigInt64(addr))
  } else {
    throw new Error('invalid type')
  }
}

export function setValueToAddr(addr: number, length: BaseType, value: number) {
  if (length === BaseType.char) {
    return MEMORY.setInt8(addr, value)
  }
  else if (length === BaseType.short) {
    return MEMORY.setInt16(addr, value)
  }
  else if (length === BaseType.int) {
    return MEMORY.setInt32(addr, value)
  }
  else if (length === BaseType.long) {
    return MEMORY.setBigInt64(addr, BigInt(value))
  } else {
    throw new Error('invalid type')
  }
}

export function showStack(ESP: number) {
  const s = []
  for (let i = 0; i < ESP; i += 4) {
    s.push(getValueFromAddr(i, 4))
  }
  return s
}

export function allocateInHeap(size: number) {
  const start = HEAP_MANAGER.allocate(size)
  if (start === undefined) {
    throw new Error('no enough memory')
  }
  return ADDRESS_SPACE - start - 1
}

export function freeInHeap(addr: number) {
  const result = HEAP_MANAGER.free(ADDRESS_SPACE - addr - 1)
  if (result === undefined) {
    throw new Error('invalid address')
  }
  return 0
}
