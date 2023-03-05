/* tslint:disable:max-classes-per-file */
import * as es from 'estree'
import * as parser from 'node-c-parser'

import { Context, ErrorSeverity, ErrorType, SourceError } from '../types'
import { stripIndent } from '../utils/formatters'
import { CTree as RawTree } from './raw-tree'
import { CTree, Token, transformTree } from './tree'

export class DisallowedConstructError implements SourceError {
  public type = ErrorType.SYNTAX
  public severity = ErrorSeverity.ERROR
  public nodeType: string

  constructor(public node: es.Node) {
    this.nodeType = this.formatNodeType(this.node.type)
  }

  get location() {
    return this.node.loc!
  }

  public explain() {
    return `${this.nodeType} are not allowed`
  }

  public elaborate() {
    return stripIndent`
      You are trying to use ${this.nodeType}, which is not allowed (yet).
    `
  }

  /**
   * Converts estree node.type into english
   * e.g. ThisExpression -> 'this' expressions
   *      Property -> Properties
   *      EmptyStatement -> Empty Statements
   */
  private formatNodeType(nodeType: string) {
    switch (nodeType) {
      case 'ThisExpression':
        return "'this' expressions"
      case 'Property':
        return 'Properties'
      default: {
        const words = nodeType.split(/(?=[A-Z])/)
        return words.map((word, i) => (i === 0 ? word : word.toLowerCase())).join(' ') + 's'
      }
    }
  }
}

export class FatalSyntaxError implements SourceError {
  public type = ErrorType.SYNTAX
  public severity = ErrorSeverity.ERROR
  public constructor(public location: es.SourceLocation, public message: string) {}

  public explain() {
    return this.message
  }

  public elaborate() {
    return 'There is a syntax error in your program'
  }
}

export class MissingSemicolonError implements SourceError {
  public type = ErrorType.SYNTAX
  public severity = ErrorSeverity.ERROR
  public constructor(public location: es.SourceLocation) {}

  public explain() {
    return 'Missing semicolon at the end of statement'
  }

  public elaborate() {
    return 'Every statement must be terminated by a semicolon.'
  }
}

export class TrailingCommaError implements SourceError {
  public type: ErrorType.SYNTAX
  public severity: ErrorSeverity.WARNING
  public constructor(public location: es.SourceLocation) {}

  public explain() {
    return 'Trailing comma'
  }

  public elaborate() {
    return 'Please remove the trailing comma'
  }
}

function debugTree(tree: RawTree | Token, level = 0) {
  console.debug('debug:', level, tree)
  if ('children' in tree && tree.children) {
    for (const c of tree.children) {
      debugTree(c, level + 1)
    }
  }
}

export function parse(source: string, context: Context) {
  const tokens = (parser as any).lexer.lexUnit.tokenize(source)
  const parse_tree: RawTree = (parser as any).parse(tokens)
  if (parse_tree) {
    debugTree(parse_tree)
  let program: es.Program | undefined

  // if (context.variant === 'calc' || context.variant === 'vm') {
  //   const inputStream = CharStreams.fromString(source)
  //   const lexer = new CalcLexer(inputStream)
  //   const tokenStream = new CommonTokenStream(lexer)
  //   const parser = new CalcParser(tokenStream)
  //   parser.buildParseTree = true
  //   try {
  //     const tree = parser.expression()
  //     program = convertSource(tree)
  //   } catch (error) {
  //     if (error instanceof FatalSyntaxError) {
  //       context.errors.push(error)
  //     } else {
  //       throw error
  //     }
  //   }
  //   const hasErrors = context.errors.find(m => m.severity === ErrorSeverity.ERROR)
  //   if (program && !hasErrors) {
  //     return program
  //   } else {
  //     return undefined
  //   }
  } else {
    console.debug('debug: error parsing')
  }
  return transformTree(parse_tree)
}
