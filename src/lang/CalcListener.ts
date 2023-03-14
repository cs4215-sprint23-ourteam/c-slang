// Generated from ./src/lang/Calc.g4 by ANTLR 4.9.0-SNAPSHOT


import { ParseTreeListener } from "antlr4ts/tree/ParseTreeListener";

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
 * This interface defines a complete listener for a parse tree produced by
 * `CalcParser`.
 */
export interface CalcListener extends ParseTreeListener {
	/**
	 * Enter a parse tree produced by `CalcParser.program`.
	 * @param ctx the parse tree
	 */
	enterProgram?: (ctx: ProgramContext) => void;
	/**
	 * Exit a parse tree produced by `CalcParser.program`.
	 * @param ctx the parse tree
	 */
	exitProgram?: (ctx: ProgramContext) => void;

	/**
	 * Enter a parse tree produced by `CalcParser.declaration`.
	 * @param ctx the parse tree
	 */
	enterDeclaration?: (ctx: DeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `CalcParser.declaration`.
	 * @param ctx the parse tree
	 */
	exitDeclaration?: (ctx: DeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `CalcParser.variable_declaration`.
	 * @param ctx the parse tree
	 */
	enterVariable_declaration?: (ctx: Variable_declarationContext) => void;
	/**
	 * Exit a parse tree produced by `CalcParser.variable_declaration`.
	 * @param ctx the parse tree
	 */
	exitVariable_declaration?: (ctx: Variable_declarationContext) => void;

	/**
	 * Enter a parse tree produced by `CalcParser.function_declaration`.
	 * @param ctx the parse tree
	 */
	enterFunction_declaration?: (ctx: Function_declarationContext) => void;
	/**
	 * Exit a parse tree produced by `CalcParser.function_declaration`.
	 * @param ctx the parse tree
	 */
	exitFunction_declaration?: (ctx: Function_declarationContext) => void;

	/**
	 * Enter a parse tree produced by `CalcParser.params`.
	 * @param ctx the parse tree
	 */
	enterParams?: (ctx: ParamsContext) => void;
	/**
	 * Exit a parse tree produced by `CalcParser.params`.
	 * @param ctx the parse tree
	 */
	exitParams?: (ctx: ParamsContext) => void;

	/**
	 * Enter a parse tree produced by `CalcParser.pointer`.
	 * @param ctx the parse tree
	 */
	enterPointer?: (ctx: PointerContext) => void;
	/**
	 * Exit a parse tree produced by `CalcParser.pointer`.
	 * @param ctx the parse tree
	 */
	exitPointer?: (ctx: PointerContext) => void;

	/**
	 * Enter a parse tree produced by `CalcParser.param`.
	 * @param ctx the parse tree
	 */
	enterParam?: (ctx: ParamContext) => void;
	/**
	 * Exit a parse tree produced by `CalcParser.param`.
	 * @param ctx the parse tree
	 */
	exitParam?: (ctx: ParamContext) => void;

	/**
	 * Enter a parse tree produced by `CalcParser.type_specifier`.
	 * @param ctx the parse tree
	 */
	enterType_specifier?: (ctx: Type_specifierContext) => void;
	/**
	 * Exit a parse tree produced by `CalcParser.type_specifier`.
	 * @param ctx the parse tree
	 */
	exitType_specifier?: (ctx: Type_specifierContext) => void;

	/**
	 * Enter a parse tree produced by `CalcParser.name`.
	 * @param ctx the parse tree
	 */
	enterName?: (ctx: NameContext) => void;
	/**
	 * Exit a parse tree produced by `CalcParser.name`.
	 * @param ctx the parse tree
	 */
	exitName?: (ctx: NameContext) => void;

	/**
	 * Enter a parse tree produced by `CalcParser.block`.
	 * @param ctx the parse tree
	 */
	enterBlock?: (ctx: BlockContext) => void;
	/**
	 * Exit a parse tree produced by `CalcParser.block`.
	 * @param ctx the parse tree
	 */
	exitBlock?: (ctx: BlockContext) => void;

	/**
	 * Enter a parse tree produced by `CalcParser.statement`.
	 * @param ctx the parse tree
	 */
	enterStatement?: (ctx: StatementContext) => void;
	/**
	 * Exit a parse tree produced by `CalcParser.statement`.
	 * @param ctx the parse tree
	 */
	exitStatement?: (ctx: StatementContext) => void;

	/**
	 * Enter a parse tree produced by `CalcParser.expression`.
	 * @param ctx the parse tree
	 */
	enterExpression?: (ctx: ExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `CalcParser.expression`.
	 * @param ctx the parse tree
	 */
	exitExpression?: (ctx: ExpressionContext) => void;

	/**
	 * Enter a parse tree produced by `CalcParser.assignment`.
	 * @param ctx the parse tree
	 */
	enterAssignment?: (ctx: AssignmentContext) => void;
	/**
	 * Exit a parse tree produced by `CalcParser.assignment`.
	 * @param ctx the parse tree
	 */
	exitAssignment?: (ctx: AssignmentContext) => void;

	/**
	 * Enter a parse tree produced by `CalcParser.while_statement`.
	 * @param ctx the parse tree
	 */
	enterWhile_statement?: (ctx: While_statementContext) => void;
	/**
	 * Exit a parse tree produced by `CalcParser.while_statement`.
	 * @param ctx the parse tree
	 */
	exitWhile_statement?: (ctx: While_statementContext) => void;

	/**
	 * Enter a parse tree produced by `CalcParser.if_statement`.
	 * @param ctx the parse tree
	 */
	enterIf_statement?: (ctx: If_statementContext) => void;
	/**
	 * Exit a parse tree produced by `CalcParser.if_statement`.
	 * @param ctx the parse tree
	 */
	exitIf_statement?: (ctx: If_statementContext) => void;

	/**
	 * Enter a parse tree produced by `CalcParser.return_statement`.
	 * @param ctx the parse tree
	 */
	enterReturn_statement?: (ctx: Return_statementContext) => void;
	/**
	 * Exit a parse tree produced by `CalcParser.return_statement`.
	 * @param ctx the parse tree
	 */
	exitReturn_statement?: (ctx: Return_statementContext) => void;

	/**
	 * Enter a parse tree produced by `CalcParser.jump_statement`.
	 * @param ctx the parse tree
	 */
	enterJump_statement?: (ctx: Jump_statementContext) => void;
	/**
	 * Exit a parse tree produced by `CalcParser.jump_statement`.
	 * @param ctx the parse tree
	 */
	exitJump_statement?: (ctx: Jump_statementContext) => void;

	/**
	 * Enter a parse tree produced by `CalcParser.call_function`.
	 * @param ctx the parse tree
	 */
	enterCall_function?: (ctx: Call_functionContext) => void;
	/**
	 * Exit a parse tree produced by `CalcParser.call_function`.
	 * @param ctx the parse tree
	 */
	exitCall_function?: (ctx: Call_functionContext) => void;

	/**
	 * Enter a parse tree produced by `CalcParser.arguments`.
	 * @param ctx the parse tree
	 */
	enterArguments?: (ctx: ArgumentsContext) => void;
	/**
	 * Exit a parse tree produced by `CalcParser.arguments`.
	 * @param ctx the parse tree
	 */
	exitArguments?: (ctx: ArgumentsContext) => void;
}

