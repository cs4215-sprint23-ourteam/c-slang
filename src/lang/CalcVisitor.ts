// Generated from ./src/lang/Calc.g4 by ANTLR 4.9.0-SNAPSHOT


import { ParseTreeVisitor } from "antlr4ts/tree/ParseTreeVisitor";

import { ProgramContext } from "./CalcParser";
import { DeclarationContext } from "./CalcParser";
import { Variable_declarationContext } from "./CalcParser";
import { Function_declarationContext } from "./CalcParser";
import { ParamsContext } from "./CalcParser";
import { PointerContext } from "./CalcParser";
import { ParamContext } from "./CalcParser";
import { Type_specifierContext } from "./CalcParser";
import { NameContext } from "./CalcParser";
import { BlockContext } from "./CalcParser";
import { StatementContext } from "./CalcParser";
import { ExpressionContext } from "./CalcParser";
import { AssignmentContext } from "./CalcParser";
import { While_statementContext } from "./CalcParser";
import { If_statementContext } from "./CalcParser";
import { Return_statementContext } from "./CalcParser";
import { Jump_statementContext } from "./CalcParser";
import { Call_functionContext } from "./CalcParser";
import { ArgumentsContext } from "./CalcParser";


/**
 * This interface defines a complete generic visitor for a parse tree produced
 * by `CalcParser`.
 *
 * @param <Result> The return type of the visit operation. Use `void` for
 * operations with no return type.
 */
export interface CalcVisitor<Result> extends ParseTreeVisitor<Result> {
	/**
	 * Visit a parse tree produced by `CalcParser.program`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitProgram?: (ctx: ProgramContext) => Result;

	/**
	 * Visit a parse tree produced by `CalcParser.declaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDeclaration?: (ctx: DeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `CalcParser.variable_declaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitVariable_declaration?: (ctx: Variable_declarationContext) => Result;

	/**
	 * Visit a parse tree produced by `CalcParser.function_declaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFunction_declaration?: (ctx: Function_declarationContext) => Result;

	/**
	 * Visit a parse tree produced by `CalcParser.params`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitParams?: (ctx: ParamsContext) => Result;

	/**
	 * Visit a parse tree produced by `CalcParser.pointer`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPointer?: (ctx: PointerContext) => Result;

	/**
	 * Visit a parse tree produced by `CalcParser.param`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitParam?: (ctx: ParamContext) => Result;

	/**
	 * Visit a parse tree produced by `CalcParser.type_specifier`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitType_specifier?: (ctx: Type_specifierContext) => Result;

	/**
	 * Visit a parse tree produced by `CalcParser.name`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitName?: (ctx: NameContext) => Result;

	/**
	 * Visit a parse tree produced by `CalcParser.block`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitBlock?: (ctx: BlockContext) => Result;

	/**
	 * Visit a parse tree produced by `CalcParser.statement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitStatement?: (ctx: StatementContext) => Result;

	/**
	 * Visit a parse tree produced by `CalcParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitExpression?: (ctx: ExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `CalcParser.assignment`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAssignment?: (ctx: AssignmentContext) => Result;

	/**
	 * Visit a parse tree produced by `CalcParser.while_statement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitWhile_statement?: (ctx: While_statementContext) => Result;

	/**
	 * Visit a parse tree produced by `CalcParser.if_statement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitIf_statement?: (ctx: If_statementContext) => Result;

	/**
	 * Visit a parse tree produced by `CalcParser.return_statement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitReturn_statement?: (ctx: Return_statementContext) => Result;

	/**
	 * Visit a parse tree produced by `CalcParser.jump_statement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitJump_statement?: (ctx: Jump_statementContext) => Result;

	/**
	 * Visit a parse tree produced by `CalcParser.call_function`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCall_function?: (ctx: Call_functionContext) => Result;

	/**
	 * Visit a parse tree produced by `CalcParser.arguments`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitArguments?: (ctx: ArgumentsContext) => Result;
}


