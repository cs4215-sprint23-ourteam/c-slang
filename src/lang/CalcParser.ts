// Generated from ./src/lang/Calc.g4 by ANTLR 4.9.0-SNAPSHOT


import { ATN } from "antlr4ts/atn/ATN";
import { ATNDeserializer } from "antlr4ts/atn/ATNDeserializer";
import { FailedPredicateException } from "antlr4ts/FailedPredicateException";
import { NotNull } from "antlr4ts/Decorators";
import { NoViableAltException } from "antlr4ts/NoViableAltException";
import { Override } from "antlr4ts/Decorators";
import { Parser } from "antlr4ts/Parser";
import { ParserRuleContext } from "antlr4ts/ParserRuleContext";
import { ParserATNSimulator } from "antlr4ts/atn/ParserATNSimulator";
import { ParseTreeListener } from "antlr4ts/tree/ParseTreeListener";
import { ParseTreeVisitor } from "antlr4ts/tree/ParseTreeVisitor";
import { RecognitionException } from "antlr4ts/RecognitionException";
import { RuleContext } from "antlr4ts/RuleContext";
//import { RuleVersion } from "antlr4ts/RuleVersion";
import { TerminalNode } from "antlr4ts/tree/TerminalNode";
import { Token } from "antlr4ts/Token";
import { TokenStream } from "antlr4ts/TokenStream";
import { Vocabulary } from "antlr4ts/Vocabulary";
import { VocabularyImpl } from "antlr4ts/VocabularyImpl";

import * as Utils from "antlr4ts/misc/Utils";

import { CalcListener } from "./CalcListener";
import { CalcVisitor } from "./CalcVisitor";


export class CalcParser extends Parser {
	public static readonly T__0 = 1;
	public static readonly T__1 = 2;
	public static readonly T__2 = 3;
	public static readonly T__3 = 4;
	public static readonly T__4 = 5;
	public static readonly T__5 = 6;
	public static readonly T__6 = 7;
	public static readonly T__7 = 8;
	public static readonly T__8 = 9;
	public static readonly T__9 = 10;
	public static readonly T__10 = 11;
	public static readonly T__11 = 12;
	public static readonly T__12 = 13;
	public static readonly T__13 = 14;
	public static readonly T__14 = 15;
	public static readonly T__15 = 16;
	public static readonly MUL = 17;
	public static readonly DIV = 18;
	public static readonly ADD = 19;
	public static readonly SUB = 20;
	public static readonly REMAIN = 21;
	public static readonly EQUAL = 22;
	public static readonly NOT_EQUAL = 23;
	public static readonly GREATER_THAN = 24;
	public static readonly LESS_THAN = 25;
	public static readonly GREATER_OR_EQUAL = 26;
	public static readonly LESS_OR_EQUAL = 27;
	public static readonly NOT = 28;
	public static readonly ADDRESS = 29;
	public static readonly AND = 30;
	public static readonly OR = 31;
	public static readonly INT = 32;
	public static readonly CHAR = 33;
	public static readonly FLOAT = 34;
	public static readonly WHITESPACE = 35;
	public static readonly VOID = 36;
	public static readonly RULE_program = 0;
	public static readonly RULE_declaration = 1;
	public static readonly RULE_variable_declaration = 2;
	public static readonly RULE_function_declaration = 3;
	public static readonly RULE_params = 4;
	public static readonly RULE_pointer = 5;
	public static readonly RULE_param = 6;
	public static readonly RULE_type_specifier = 7;
	public static readonly RULE_name = 8;
	public static readonly RULE_block = 9;
	public static readonly RULE_statement = 10;
	public static readonly RULE_expression = 11;
	public static readonly RULE_assignment = 12;
	public static readonly RULE_while_statement = 13;
	public static readonly RULE_if_statement = 14;
	public static readonly RULE_return_statement = 15;
	public static readonly RULE_jump_statement = 16;
	public static readonly RULE_call_function = 17;
	public static readonly RULE_arguments = 18;
	// tslint:disable:no-trailing-whitespace
	public static readonly ruleNames: string[] = [
		"program", "declaration", "variable_declaration", "function_declaration", 
		"params", "pointer", "param", "type_specifier", "name", "block", "statement", 
		"expression", "assignment", "while_statement", "if_statement", "return_statement", 
		"jump_statement", "call_function", "arguments",
	];

	private static readonly _LITERAL_NAMES: Array<string | undefined> = [
		undefined, "';'", "'='", "'('", "')'", "'_'", "'{'", "'}'", "'while ('", 
		"'if ('", "'else'", "'return'", "'return;'", "'continue;'", "'break;'", 
		"'(void);'", "');'", "'*'", "'/'", "'+'", "'-'", "'%'", "'=='", "'!='", 
		"'>'", "'<'", "'>='", "'<='", "'!'", "'&'", "'&&'", "'||'", undefined, 
		undefined, undefined, undefined, "'void'",
	];
	private static readonly _SYMBOLIC_NAMES: Array<string | undefined> = [
		undefined, undefined, undefined, undefined, undefined, undefined, undefined, 
		undefined, undefined, undefined, undefined, undefined, undefined, undefined, 
		undefined, undefined, undefined, "MUL", "DIV", "ADD", "SUB", "REMAIN", 
		"EQUAL", "NOT_EQUAL", "GREATER_THAN", "LESS_THAN", "GREATER_OR_EQUAL", 
		"LESS_OR_EQUAL", "NOT", "ADDRESS", "AND", "OR", "INT", "CHAR", "FLOAT", 
		"WHITESPACE", "VOID",
	];
	public static readonly VOCABULARY: Vocabulary = new VocabularyImpl(CalcParser._LITERAL_NAMES, CalcParser._SYMBOLIC_NAMES, []);

	// @Override
	// @NotNull
	public get vocabulary(): Vocabulary {
		return CalcParser.VOCABULARY;
	}
	// tslint:enable:no-trailing-whitespace

	// @Override
	public get grammarFileName(): string { return "Calc.g4"; }

	// @Override
	public get ruleNames(): string[] { return CalcParser.ruleNames; }

	// @Override
	public get serializedATN(): string { return CalcParser._serializedATN; }

	protected createFailedPredicateException(predicate?: string, message?: string): FailedPredicateException {
		return new FailedPredicateException(this, predicate, message);
	}

	constructor(input: TokenStream) {
		super(input);
		this._interp = new ParserATNSimulator(CalcParser._ATN, this);
	}
	// @RuleVersion(0)
	public program(): ProgramContext {
		let _localctx: ProgramContext = new ProgramContext(this._ctx, this.state);
		this.enterRule(_localctx, 0, CalcParser.RULE_program);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 41;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (((((_la - 32)) & ~0x1F) === 0 && ((1 << (_la - 32)) & ((1 << (CalcParser.INT - 32)) | (1 << (CalcParser.CHAR - 32)) | (1 << (CalcParser.FLOAT - 32)))) !== 0)) {
				{
				{
				this.state = 38;
				this.declaration();
				}
				}
				this.state = 43;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public declaration(): DeclarationContext {
		let _localctx: DeclarationContext = new DeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 2, CalcParser.RULE_declaration);
		try {
			this.state = 46;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 1, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 44;
				this.variable_declaration();
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 45;
				this.function_declaration();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public variable_declaration(): Variable_declarationContext {
		let _localctx: Variable_declarationContext = new Variable_declarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 4, CalcParser.RULE_variable_declaration);
		try {
			this.state = 56;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 2, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 48;
				this.param();
				this.state = 49;
				this.match(CalcParser.T__0);
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 51;
				this.param();
				this.state = 52;
				this.match(CalcParser.T__1);
				this.state = 53;
				this.expression(0);
				this.state = 54;
				this.match(CalcParser.T__0);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public function_declaration(): Function_declarationContext {
		let _localctx: Function_declarationContext = new Function_declarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 6, CalcParser.RULE_function_declaration);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 58;
			this.type_specifier();
			this.state = 59;
			this.name(0);
			this.state = 60;
			this.match(CalcParser.T__2);
			this.state = 61;
			this.params();
			this.state = 62;
			this.match(CalcParser.T__3);
			this.state = 63;
			this.block();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public params(): ParamsContext {
		let _localctx: ParamsContext = new ParamsContext(this._ctx, this.state);
		this.enterRule(_localctx, 8, CalcParser.RULE_params);
		let _la: number;
		try {
			this.state = 71;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case CalcParser.INT:
			case CalcParser.CHAR:
			case CalcParser.FLOAT:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 66;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				do {
					{
					{
					this.state = 65;
					this.param();
					}
					}
					this.state = 68;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				} while (((((_la - 32)) & ~0x1F) === 0 && ((1 << (_la - 32)) & ((1 << (CalcParser.INT - 32)) | (1 << (CalcParser.CHAR - 32)) | (1 << (CalcParser.FLOAT - 32)))) !== 0));
				}
				break;
			case CalcParser.VOID:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 70;
				this.match(CalcParser.VOID);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public pointer(): PointerContext {
		let _localctx: PointerContext = new PointerContext(this._ctx, this.state);
		this.enterRule(_localctx, 10, CalcParser.RULE_pointer);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 73;
			this.match(CalcParser.MUL);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public param(): ParamContext {
		let _localctx: ParamContext = new ParamContext(this._ctx, this.state);
		this.enterRule(_localctx, 12, CalcParser.RULE_param);
		try {
			this.state = 82;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 5, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 75;
				this.type_specifier();
				this.state = 76;
				this.name(0);
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 78;
				this.type_specifier();
				this.state = 79;
				this.pointer();
				this.state = 80;
				this.name(0);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public type_specifier(): Type_specifierContext {
		let _localctx: Type_specifierContext = new Type_specifierContext(this._ctx, this.state);
		this.enterRule(_localctx, 14, CalcParser.RULE_type_specifier);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 84;
			_la = this._input.LA(1);
			if (!(((((_la - 32)) & ~0x1F) === 0 && ((1 << (_la - 32)) & ((1 << (CalcParser.INT - 32)) | (1 << (CalcParser.CHAR - 32)) | (1 << (CalcParser.FLOAT - 32)))) !== 0))) {
			this._errHandler.recoverInline(this);
			} else {
				if (this._input.LA(1) === Token.EOF) {
					this.matchedEOF = true;
				}

				this._errHandler.reportMatch(this);
				this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}

	public name(): NameContext;
	public name(_p: number): NameContext;
	// @RuleVersion(0)
	public name(_p?: number): NameContext {
		if (_p === undefined) {
			_p = 0;
		}

		let _parentctx: ParserRuleContext = this._ctx;
		let _parentState: number = this.state;
		let _localctx: NameContext = new NameContext(this._ctx, _parentState);
		let _prevctx: NameContext = _localctx;
		let _startState: number = 16;
		this.enterRecursionRule(_localctx, 16, CalcParser.RULE_name, _p);
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			{
			this.state = 87;
			this.match(CalcParser.CHAR);
			}
			this._ctx._stop = this._input.tryLT(-1);
			this.state = 97;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 7, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = _localctx;
					{
					this.state = 95;
					this._errHandler.sync(this);
					switch ( this.interpreter.adaptivePredict(this._input, 6, this._ctx) ) {
					case 1:
						{
						_localctx = new NameContext(_parentctx, _parentState);
						this.pushNewRecursionContext(_localctx, _startState, CalcParser.RULE_name);
						this.state = 89;
						if (!(this.precpred(this._ctx, 3))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 3)");
						}
						this.state = 90;
						this.match(CalcParser.CHAR);
						}
						break;

					case 2:
						{
						_localctx = new NameContext(_parentctx, _parentState);
						this.pushNewRecursionContext(_localctx, _startState, CalcParser.RULE_name);
						this.state = 91;
						if (!(this.precpred(this._ctx, 2))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 2)");
						}
						this.state = 92;
						this.match(CalcParser.T__4);
						}
						break;

					case 3:
						{
						_localctx = new NameContext(_parentctx, _parentState);
						this.pushNewRecursionContext(_localctx, _startState, CalcParser.RULE_name);
						this.state = 93;
						if (!(this.precpred(this._ctx, 1))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 1)");
						}
						this.state = 94;
						this.match(CalcParser.INT);
						}
						break;
					}
					}
				}
				this.state = 99;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 7, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.unrollRecursionContexts(_parentctx);
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public block(): BlockContext {
		let _localctx: BlockContext = new BlockContext(this._ctx, this.state);
		this.enterRule(_localctx, 18, CalcParser.RULE_block);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 100;
			this.match(CalcParser.T__5);
			this.state = 105;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (((((_la - 6)) & ~0x1F) === 0 && ((1 << (_la - 6)) & ((1 << (CalcParser.T__5 - 6)) | (1 << (CalcParser.T__7 - 6)) | (1 << (CalcParser.T__8 - 6)) | (1 << (CalcParser.T__10 - 6)) | (1 << (CalcParser.T__11 - 6)) | (1 << (CalcParser.T__12 - 6)) | (1 << (CalcParser.T__13 - 6)) | (1 << (CalcParser.INT - 6)) | (1 << (CalcParser.CHAR - 6)) | (1 << (CalcParser.FLOAT - 6)))) !== 0)) {
				{
				this.state = 103;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input, 8, this._ctx) ) {
				case 1:
					{
					this.state = 101;
					this.declaration();
					}
					break;

				case 2:
					{
					this.state = 102;
					this.statement();
					}
					break;
				}
				}
				this.state = 107;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 108;
			this.match(CalcParser.T__6);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public statement(): StatementContext {
		let _localctx: StatementContext = new StatementContext(this._ctx, this.state);
		this.enterRule(_localctx, 20, CalcParser.RULE_statement);
		try {
			this.state = 119;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 10, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 110;
				this.expression(0);
				this.state = 111;
				this.match(CalcParser.T__0);
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 113;
				this.assignment();
				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 114;
				this.block();
				}
				break;

			case 4:
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 115;
				this.if_statement();
				}
				break;

			case 5:
				this.enterOuterAlt(_localctx, 5);
				{
				this.state = 116;
				this.while_statement();
				}
				break;

			case 6:
				this.enterOuterAlt(_localctx, 6);
				{
				this.state = 117;
				this.return_statement();
				}
				break;

			case 7:
				this.enterOuterAlt(_localctx, 7);
				{
				this.state = 118;
				this.jump_statement();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}

	public expression(): ExpressionContext;
	public expression(_p: number): ExpressionContext;
	// @RuleVersion(0)
	public expression(_p?: number): ExpressionContext {
		if (_p === undefined) {
			_p = 0;
		}

		let _parentctx: ParserRuleContext = this._ctx;
		let _parentState: number = this.state;
		let _localctx: ExpressionContext = new ExpressionContext(this._ctx, _parentState);
		let _prevctx: ExpressionContext = _localctx;
		let _startState: number = 22;
		this.enterRecursionRule(_localctx, 22, CalcParser.RULE_expression, _p);
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 129;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 12, this._ctx) ) {
			case 1:
				{
				this.state = 122;
				this.match(CalcParser.INT);
				}
				break;

			case 2:
				{
				this.state = 124;
				this._errHandler.sync(this);
				_alt = 1;
				do {
					switch (_alt) {
					case 1:
						{
						{
						this.state = 123;
						this.match(CalcParser.CHAR);
						}
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					this.state = 126;
					this._errHandler.sync(this);
					_alt = this.interpreter.adaptivePredict(this._input, 11, this._ctx);
				} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
				}
				break;

			case 3:
				{
				this.state = 128;
				this.name(0);
				}
				break;
			}
			this._ctx._stop = this._input.tryLT(-1);
			this.state = 180;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 14, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = _localctx;
					{
					this.state = 178;
					this._errHandler.sync(this);
					switch ( this.interpreter.adaptivePredict(this._input, 13, this._ctx) ) {
					case 1:
						{
						_localctx = new ExpressionContext(_parentctx, _parentState);
						_localctx._left = _prevctx;
						this.pushNewRecursionContext(_localctx, _startState, CalcParser.RULE_expression);
						this.state = 131;
						if (!(this.precpred(this._ctx, 17))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 17)");
						}
						this.state = 132;
						_localctx._operator = this.match(CalcParser.MUL);
						this.state = 133;
						_localctx._right = this.expression(18);
						}
						break;

					case 2:
						{
						_localctx = new ExpressionContext(_parentctx, _parentState);
						_localctx._left = _prevctx;
						this.pushNewRecursionContext(_localctx, _startState, CalcParser.RULE_expression);
						this.state = 134;
						if (!(this.precpred(this._ctx, 16))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 16)");
						}
						this.state = 135;
						_localctx._operator = this.match(CalcParser.DIV);
						this.state = 136;
						_localctx._right = this.expression(17);
						}
						break;

					case 3:
						{
						_localctx = new ExpressionContext(_parentctx, _parentState);
						_localctx._left = _prevctx;
						this.pushNewRecursionContext(_localctx, _startState, CalcParser.RULE_expression);
						this.state = 137;
						if (!(this.precpred(this._ctx, 15))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 15)");
						}
						this.state = 138;
						_localctx._operator = this.match(CalcParser.ADD);
						this.state = 139;
						_localctx._right = this.expression(16);
						}
						break;

					case 4:
						{
						_localctx = new ExpressionContext(_parentctx, _parentState);
						_localctx._left = _prevctx;
						this.pushNewRecursionContext(_localctx, _startState, CalcParser.RULE_expression);
						this.state = 140;
						if (!(this.precpred(this._ctx, 14))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 14)");
						}
						this.state = 141;
						_localctx._operator = this.match(CalcParser.SUB);
						this.state = 142;
						_localctx._right = this.expression(15);
						}
						break;

					case 5:
						{
						_localctx = new ExpressionContext(_parentctx, _parentState);
						_localctx._left = _prevctx;
						this.pushNewRecursionContext(_localctx, _startState, CalcParser.RULE_expression);
						this.state = 143;
						if (!(this.precpred(this._ctx, 13))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 13)");
						}
						this.state = 144;
						_localctx._operator = this.match(CalcParser.REMAIN);
						this.state = 145;
						_localctx._right = this.expression(14);
						}
						break;

					case 6:
						{
						_localctx = new ExpressionContext(_parentctx, _parentState);
						_localctx._left = _prevctx;
						this.pushNewRecursionContext(_localctx, _startState, CalcParser.RULE_expression);
						this.state = 146;
						if (!(this.precpred(this._ctx, 12))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 12)");
						}
						this.state = 147;
						_localctx._operator = this.match(CalcParser.EQUAL);
						this.state = 148;
						_localctx._right = this.expression(13);
						}
						break;

					case 7:
						{
						_localctx = new ExpressionContext(_parentctx, _parentState);
						_localctx._left = _prevctx;
						this.pushNewRecursionContext(_localctx, _startState, CalcParser.RULE_expression);
						this.state = 149;
						if (!(this.precpred(this._ctx, 11))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 11)");
						}
						this.state = 150;
						_localctx._operator = this.match(CalcParser.NOT_EQUAL);
						this.state = 151;
						_localctx._right = this.expression(12);
						}
						break;

					case 8:
						{
						_localctx = new ExpressionContext(_parentctx, _parentState);
						_localctx._left = _prevctx;
						this.pushNewRecursionContext(_localctx, _startState, CalcParser.RULE_expression);
						this.state = 152;
						if (!(this.precpred(this._ctx, 10))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 10)");
						}
						this.state = 153;
						_localctx._operator = this.match(CalcParser.GREATER_THAN);
						this.state = 154;
						_localctx._right = this.expression(11);
						}
						break;

					case 9:
						{
						_localctx = new ExpressionContext(_parentctx, _parentState);
						_localctx._left = _prevctx;
						this.pushNewRecursionContext(_localctx, _startState, CalcParser.RULE_expression);
						this.state = 155;
						if (!(this.precpred(this._ctx, 9))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 9)");
						}
						this.state = 156;
						_localctx._operator = this.match(CalcParser.LESS_THAN);
						this.state = 157;
						_localctx._right = this.expression(10);
						}
						break;

					case 10:
						{
						_localctx = new ExpressionContext(_parentctx, _parentState);
						_localctx._left = _prevctx;
						this.pushNewRecursionContext(_localctx, _startState, CalcParser.RULE_expression);
						this.state = 158;
						if (!(this.precpred(this._ctx, 8))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 8)");
						}
						this.state = 159;
						_localctx._operator = this.match(CalcParser.GREATER_OR_EQUAL);
						this.state = 160;
						_localctx._right = this.expression(9);
						}
						break;

					case 11:
						{
						_localctx = new ExpressionContext(_parentctx, _parentState);
						_localctx._left = _prevctx;
						this.pushNewRecursionContext(_localctx, _startState, CalcParser.RULE_expression);
						this.state = 161;
						if (!(this.precpred(this._ctx, 7))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 7)");
						}
						this.state = 162;
						_localctx._operator = this.match(CalcParser.LESS_OR_EQUAL);
						this.state = 163;
						_localctx._right = this.expression(8);
						}
						break;

					case 12:
						{
						_localctx = new ExpressionContext(_parentctx, _parentState);
						_localctx._left = _prevctx;
						this.pushNewRecursionContext(_localctx, _startState, CalcParser.RULE_expression);
						this.state = 164;
						if (!(this.precpred(this._ctx, 6))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 6)");
						}
						this.state = 165;
						_localctx._operator = this.match(CalcParser.AND);
						this.state = 166;
						_localctx._right = this.expression(7);
						}
						break;

					case 13:
						{
						_localctx = new ExpressionContext(_parentctx, _parentState);
						_localctx._left = _prevctx;
						this.pushNewRecursionContext(_localctx, _startState, CalcParser.RULE_expression);
						this.state = 167;
						if (!(this.precpred(this._ctx, 5))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 5)");
						}
						this.state = 168;
						_localctx._operator = this.match(CalcParser.OR);
						this.state = 169;
						_localctx._right = this.expression(6);
						}
						break;

					case 14:
						{
						_localctx = new ExpressionContext(_parentctx, _parentState);
						_localctx._left = _prevctx;
						this.pushNewRecursionContext(_localctx, _startState, CalcParser.RULE_expression);
						this.state = 170;
						if (!(this.precpred(this._ctx, 4))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 4)");
						}
						this.state = 171;
						_localctx._operator = this.match(CalcParser.NOT);
						}
						break;

					case 15:
						{
						_localctx = new ExpressionContext(_parentctx, _parentState);
						_localctx._left = _prevctx;
						this.pushNewRecursionContext(_localctx, _startState, CalcParser.RULE_expression);
						this.state = 172;
						if (!(this.precpred(this._ctx, 3))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 3)");
						}
						this.state = 173;
						_localctx._operator = this.match(CalcParser.SUB);
						}
						break;

					case 16:
						{
						_localctx = new ExpressionContext(_parentctx, _parentState);
						_localctx._left = _prevctx;
						this.pushNewRecursionContext(_localctx, _startState, CalcParser.RULE_expression);
						this.state = 174;
						if (!(this.precpred(this._ctx, 2))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 2)");
						}
						this.state = 175;
						_localctx._operator = this.match(CalcParser.ADDRESS);
						}
						break;

					case 17:
						{
						_localctx = new ExpressionContext(_parentctx, _parentState);
						_localctx._left = _prevctx;
						this.pushNewRecursionContext(_localctx, _startState, CalcParser.RULE_expression);
						this.state = 176;
						if (!(this.precpred(this._ctx, 1))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 1)");
						}
						this.state = 177;
						_localctx._operator = this.match(CalcParser.MUL);
						}
						break;
					}
					}
				}
				this.state = 182;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 14, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.unrollRecursionContexts(_parentctx);
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public assignment(): AssignmentContext {
		let _localctx: AssignmentContext = new AssignmentContext(this._ctx, this.state);
		this.enterRule(_localctx, 24, CalcParser.RULE_assignment);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 183;
			this.name(0);
			this.state = 184;
			this.match(CalcParser.T__1);
			this.state = 185;
			this.expression(0);
			this.state = 186;
			this.match(CalcParser.T__0);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public while_statement(): While_statementContext {
		let _localctx: While_statementContext = new While_statementContext(this._ctx, this.state);
		this.enterRule(_localctx, 26, CalcParser.RULE_while_statement);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 188;
			this.match(CalcParser.T__7);
			this.state = 189;
			this.expression(0);
			this.state = 190;
			this.match(CalcParser.T__3);
			this.state = 191;
			this.block();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public if_statement(): If_statementContext {
		let _localctx: If_statementContext = new If_statementContext(this._ctx, this.state);
		this.enterRule(_localctx, 28, CalcParser.RULE_if_statement);
		try {
			this.state = 205;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 15, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 193;
				this.match(CalcParser.T__8);
				this.state = 194;
				this.expression(0);
				this.state = 195;
				this.match(CalcParser.T__3);
				this.state = 196;
				this.block();
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 198;
				this.match(CalcParser.T__8);
				this.state = 199;
				this.expression(0);
				this.state = 200;
				this.match(CalcParser.T__3);
				this.state = 201;
				this.block();
				this.state = 202;
				this.match(CalcParser.T__9);
				this.state = 203;
				this.block();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public return_statement(): Return_statementContext {
		let _localctx: Return_statementContext = new Return_statementContext(this._ctx, this.state);
		this.enterRule(_localctx, 30, CalcParser.RULE_return_statement);
		try {
			this.state = 212;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case CalcParser.T__10:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 207;
				this.match(CalcParser.T__10);
				this.state = 208;
				this.expression(0);
				this.state = 209;
				this.match(CalcParser.T__0);
				}
				break;
			case CalcParser.T__11:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 211;
				this.match(CalcParser.T__11);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public jump_statement(): Jump_statementContext {
		let _localctx: Jump_statementContext = new Jump_statementContext(this._ctx, this.state);
		this.enterRule(_localctx, 32, CalcParser.RULE_jump_statement);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 214;
			_la = this._input.LA(1);
			if (!(_la === CalcParser.T__12 || _la === CalcParser.T__13)) {
			this._errHandler.recoverInline(this);
			} else {
				if (this._input.LA(1) === Token.EOF) {
					this.matchedEOF = true;
				}

				this._errHandler.reportMatch(this);
				this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public call_function(): Call_functionContext {
		let _localctx: Call_functionContext = new Call_functionContext(this._ctx, this.state);
		this.enterRule(_localctx, 34, CalcParser.RULE_call_function);
		try {
			this.state = 224;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 17, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 216;
				this.name(0);
				this.state = 217;
				this.match(CalcParser.T__14);
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 219;
				this.name(0);
				this.state = 220;
				this.match(CalcParser.T__2);
				this.state = 221;
				this.arguments();
				this.state = 222;
				this.match(CalcParser.T__15);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public arguments(): ArgumentsContext {
		let _localctx: ArgumentsContext = new ArgumentsContext(this._ctx, this.state);
		this.enterRule(_localctx, 36, CalcParser.RULE_arguments);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 227;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 226;
				this.expression(0);
				}
				}
				this.state = 229;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while (_la === CalcParser.INT || _la === CalcParser.CHAR);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}

	public sempred(_localctx: RuleContext, ruleIndex: number, predIndex: number): boolean {
		switch (ruleIndex) {
		case 8:
			return this.name_sempred(_localctx as NameContext, predIndex);

		case 11:
			return this.expression_sempred(_localctx as ExpressionContext, predIndex);
		}
		return true;
	}
	private name_sempred(_localctx: NameContext, predIndex: number): boolean {
		switch (predIndex) {
		case 0:
			return this.precpred(this._ctx, 3);

		case 1:
			return this.precpred(this._ctx, 2);

		case 2:
			return this.precpred(this._ctx, 1);
		}
		return true;
	}
	private expression_sempred(_localctx: ExpressionContext, predIndex: number): boolean {
		switch (predIndex) {
		case 3:
			return this.precpred(this._ctx, 17);

		case 4:
			return this.precpred(this._ctx, 16);

		case 5:
			return this.precpred(this._ctx, 15);

		case 6:
			return this.precpred(this._ctx, 14);

		case 7:
			return this.precpred(this._ctx, 13);

		case 8:
			return this.precpred(this._ctx, 12);

		case 9:
			return this.precpred(this._ctx, 11);

		case 10:
			return this.precpred(this._ctx, 10);

		case 11:
			return this.precpred(this._ctx, 9);

		case 12:
			return this.precpred(this._ctx, 8);

		case 13:
			return this.precpred(this._ctx, 7);

		case 14:
			return this.precpred(this._ctx, 6);

		case 15:
			return this.precpred(this._ctx, 5);

		case 16:
			return this.precpred(this._ctx, 4);

		case 17:
			return this.precpred(this._ctx, 3);

		case 18:
			return this.precpred(this._ctx, 2);

		case 19:
			return this.precpred(this._ctx, 1);
		}
		return true;
	}

	public static readonly _serializedATN: string =
		"\x03\uC91D\uCABA\u058D\uAFBA\u4F53\u0607\uEA8B\uC241\x03&\xEA\x04\x02" +
		"\t\x02\x04\x03\t\x03\x04\x04\t\x04\x04\x05\t\x05\x04\x06\t\x06\x04\x07" +
		"\t\x07\x04\b\t\b\x04\t\t\t\x04\n\t\n\x04\v\t\v\x04\f\t\f\x04\r\t\r\x04" +
		"\x0E\t\x0E\x04\x0F\t\x0F\x04\x10\t\x10\x04\x11\t\x11\x04\x12\t\x12\x04" +
		"\x13\t\x13\x04\x14\t\x14\x03\x02\x07\x02*\n\x02\f\x02\x0E\x02-\v\x02\x03" +
		"\x03\x03\x03\x05\x031\n\x03\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03" +
		"\x04\x03\x04\x03\x04\x05\x04;\n\x04\x03\x05\x03\x05\x03\x05\x03\x05\x03" +
		"\x05\x03\x05\x03\x05\x03\x06\x06\x06E\n\x06\r\x06\x0E\x06F\x03\x06\x05" +
		"\x06J\n\x06\x03\x07\x03\x07\x03\b\x03\b\x03\b\x03\b\x03\b\x03\b\x03\b" +
		"\x05\bU\n\b\x03\t\x03\t\x03\n\x03\n\x03\n\x03\n\x03\n\x03\n\x03\n\x03" +
		"\n\x03\n\x07\nb\n\n\f\n\x0E\ne\v\n\x03\v\x03\v\x03\v\x07\vj\n\v\f\v\x0E" +
		"\vm\v\v\x03\v\x03\v\x03\f\x03\f\x03\f\x03\f\x03\f\x03\f\x03\f\x03\f\x03" +
		"\f\x05\fz\n\f\x03\r\x03\r\x03\r\x06\r\x7F\n\r\r\r\x0E\r\x80\x03\r\x05" +
		"\r\x84\n\r\x03\r\x03\r\x03\r\x03\r\x03\r\x03\r\x03\r\x03\r\x03\r\x03\r" +
		"\x03\r\x03\r\x03\r\x03\r\x03\r\x03\r\x03\r\x03\r\x03\r\x03\r\x03\r\x03" +
		"\r\x03\r\x03\r\x03\r\x03\r\x03\r\x03\r\x03\r\x03\r\x03\r\x03\r\x03\r\x03" +
		"\r\x03\r\x03\r\x03\r\x03\r\x03\r\x03\r\x03\r\x03\r\x03\r\x03\r\x03\r\x03" +
		"\r\x03\r\x07\r\xB5\n\r\f\r\x0E\r\xB8\v\r\x03\x0E\x03\x0E\x03\x0E\x03\x0E" +
		"\x03\x0E\x03\x0F\x03\x0F\x03\x0F\x03\x0F\x03\x0F\x03\x10\x03\x10\x03\x10" +
		"\x03\x10\x03\x10\x03\x10\x03\x10\x03\x10\x03\x10\x03\x10\x03\x10\x03\x10" +
		"\x05\x10\xD0\n\x10\x03\x11\x03\x11\x03\x11\x03\x11\x03\x11\x05\x11\xD7" +
		"\n\x11\x03\x12\x03\x12\x03\x13\x03\x13\x03\x13\x03\x13\x03\x13\x03\x13" +
		"\x03\x13\x03\x13\x05\x13\xE3\n\x13\x03\x14\x06\x14\xE6\n\x14\r\x14\x0E" +
		"\x14\xE7\x03\x14\x02\x02\x04\x12\x18\x15\x02\x02\x04\x02\x06\x02\b\x02" +
		"\n\x02\f\x02\x0E\x02\x10\x02\x12\x02\x14\x02\x16\x02\x18\x02\x1A\x02\x1C" +
		"\x02\x1E\x02 \x02\"\x02$\x02&\x02\x02\x04\x03\x02\"$\x03\x02\x0F\x10\x02" +
		"\xFF\x02+\x03\x02\x02\x02\x040\x03\x02\x02\x02\x06:\x03\x02\x02\x02\b" +
		"<\x03\x02\x02\x02\nI\x03\x02\x02\x02\fK\x03\x02\x02\x02\x0ET\x03\x02\x02" +
		"\x02\x10V\x03\x02\x02\x02\x12X\x03\x02\x02\x02\x14f\x03\x02\x02\x02\x16" +
		"y\x03\x02\x02\x02\x18\x83\x03\x02\x02\x02\x1A\xB9\x03\x02\x02\x02\x1C" +
		"\xBE\x03\x02\x02\x02\x1E\xCF\x03\x02\x02\x02 \xD6\x03\x02\x02\x02\"\xD8" +
		"\x03\x02\x02\x02$\xE2\x03\x02\x02\x02&\xE5\x03\x02\x02\x02(*\x05\x04\x03" +
		"\x02)(\x03\x02\x02\x02*-\x03\x02\x02\x02+)\x03\x02\x02\x02+,\x03\x02\x02" +
		"\x02,\x03\x03\x02\x02\x02-+\x03\x02\x02\x02.1\x05\x06\x04\x02/1\x05\b" +
		"\x05\x020.\x03\x02\x02\x020/\x03\x02\x02\x021\x05\x03\x02\x02\x0223\x05" +
		"\x0E\b\x0234\x07\x03\x02\x024;\x03\x02\x02\x0256\x05\x0E\b\x0267\x07\x04" +
		"\x02\x0278\x05\x18\r\x0289\x07\x03\x02\x029;\x03\x02\x02\x02:2\x03\x02" +
		"\x02\x02:5\x03\x02\x02\x02;\x07\x03\x02\x02\x02<=\x05\x10\t\x02=>\x05" +
		"\x12\n\x02>?\x07\x05\x02\x02?@\x05\n\x06\x02@A\x07\x06\x02\x02AB\x05\x14" +
		"\v\x02B\t\x03\x02\x02\x02CE\x05\x0E\b\x02DC\x03\x02\x02\x02EF\x03\x02" +
		"\x02\x02FD\x03\x02\x02\x02FG\x03\x02\x02\x02GJ\x03\x02\x02\x02HJ\x07&" +
		"\x02\x02ID\x03\x02\x02\x02IH\x03\x02\x02\x02J\v\x03\x02\x02\x02KL\x07" +
		"\x13\x02\x02L\r\x03\x02\x02\x02MN\x05\x10\t\x02NO\x05\x12\n\x02OU\x03" +
		"\x02\x02\x02PQ\x05\x10\t\x02QR\x05\f\x07\x02RS\x05\x12\n\x02SU\x03\x02" +
		"\x02\x02TM\x03\x02\x02\x02TP\x03\x02\x02\x02U\x0F\x03\x02\x02\x02VW\t" +
		"\x02\x02\x02W\x11\x03\x02\x02\x02XY\b\n\x01\x02YZ\x07#\x02\x02Zc\x03\x02" +
		"\x02\x02[\\\f\x05\x02\x02\\b\x07#\x02\x02]^\f\x04\x02\x02^b\x07\x07\x02" +
		"\x02_`\f\x03\x02\x02`b\x07\"\x02\x02a[\x03\x02\x02\x02a]\x03\x02\x02\x02" +
		"a_\x03\x02\x02\x02be\x03\x02\x02\x02ca\x03\x02\x02\x02cd\x03\x02\x02\x02" +
		"d\x13\x03\x02\x02\x02ec\x03\x02\x02\x02fk\x07\b\x02\x02gj\x05\x04\x03" +
		"\x02hj\x05\x16\f\x02ig\x03\x02\x02\x02ih\x03\x02\x02\x02jm\x03\x02\x02" +
		"\x02ki\x03\x02\x02\x02kl\x03\x02\x02\x02ln\x03\x02\x02\x02mk\x03\x02\x02" +
		"\x02no\x07\t\x02\x02o\x15\x03\x02\x02\x02pq\x05\x18\r\x02qr\x07\x03\x02" +
		"\x02rz\x03\x02\x02\x02sz\x05\x1A\x0E\x02tz\x05\x14\v\x02uz\x05\x1E\x10" +
		"\x02vz\x05\x1C\x0F\x02wz\x05 \x11\x02xz\x05\"\x12\x02yp\x03\x02\x02\x02" +
		"ys\x03\x02\x02\x02yt\x03\x02\x02\x02yu\x03\x02\x02\x02yv\x03\x02\x02\x02" +
		"yw\x03\x02\x02\x02yx\x03\x02\x02\x02z\x17\x03\x02\x02\x02{|\b\r\x01\x02" +
		"|\x84\x07\"\x02\x02}\x7F\x07#\x02\x02~}\x03\x02\x02\x02\x7F\x80\x03\x02" +
		"\x02\x02\x80~\x03\x02\x02\x02\x80\x81\x03\x02\x02\x02\x81\x84\x03\x02" +
		"\x02\x02\x82\x84\x05\x12\n\x02\x83{\x03\x02\x02\x02\x83~\x03\x02\x02\x02" +
		"\x83\x82\x03\x02\x02\x02\x84\xB6\x03\x02\x02\x02\x85\x86\f\x13\x02\x02" +
		"\x86\x87\x07\x13\x02\x02\x87\xB5\x05\x18\r\x14\x88\x89\f\x12\x02\x02\x89" +
		"\x8A\x07\x14\x02\x02\x8A\xB5\x05\x18\r\x13\x8B\x8C\f\x11\x02\x02\x8C\x8D" +
		"\x07\x15\x02\x02\x8D\xB5\x05\x18\r\x12\x8E\x8F\f\x10\x02\x02\x8F\x90\x07" +
		"\x16\x02\x02\x90\xB5\x05\x18\r\x11\x91\x92\f\x0F\x02\x02\x92\x93\x07\x17" +
		"\x02\x02\x93\xB5\x05\x18\r\x10\x94\x95\f\x0E\x02\x02\x95\x96\x07\x18\x02" +
		"\x02\x96\xB5\x05\x18\r\x0F\x97\x98\f\r\x02\x02\x98\x99\x07\x19\x02\x02" +
		"\x99\xB5\x05\x18\r\x0E\x9A\x9B\f\f\x02\x02\x9B\x9C\x07\x1A\x02\x02\x9C" +
		"\xB5\x05\x18\r\r\x9D\x9E\f\v\x02\x02\x9E\x9F\x07\x1B\x02\x02\x9F\xB5\x05" +
		"\x18\r\f\xA0\xA1\f\n\x02\x02\xA1\xA2\x07\x1C\x02\x02\xA2\xB5\x05\x18\r" +
		"\v\xA3\xA4\f\t\x02\x02\xA4\xA5\x07\x1D\x02\x02\xA5\xB5\x05\x18\r\n\xA6" +
		"\xA7\f\b\x02\x02\xA7\xA8\x07 \x02\x02\xA8\xB5\x05\x18\r\t\xA9\xAA\f\x07" +
		"\x02\x02\xAA\xAB\x07!\x02\x02\xAB\xB5\x05\x18\r\b\xAC\xAD\f\x06\x02\x02" +
		"\xAD\xB5\x07\x1E\x02\x02\xAE\xAF\f\x05\x02\x02\xAF\xB5\x07\x16\x02\x02" +
		"\xB0\xB1\f\x04\x02\x02\xB1\xB5\x07\x1F\x02\x02\xB2\xB3\f\x03\x02\x02\xB3" +
		"\xB5\x07\x13\x02\x02\xB4\x85\x03\x02\x02\x02\xB4\x88\x03\x02\x02\x02\xB4" +
		"\x8B\x03\x02\x02\x02\xB4\x8E\x03\x02\x02\x02\xB4\x91\x03\x02\x02\x02\xB4" +
		"\x94\x03\x02\x02\x02\xB4\x97\x03\x02\x02\x02\xB4\x9A\x03\x02\x02\x02\xB4" +
		"\x9D\x03\x02\x02\x02\xB4\xA0\x03\x02\x02\x02\xB4\xA3\x03\x02\x02\x02\xB4" +
		"\xA6\x03\x02\x02\x02\xB4\xA9\x03\x02\x02\x02\xB4\xAC\x03\x02\x02\x02\xB4" +
		"\xAE\x03\x02\x02\x02\xB4\xB0\x03\x02\x02\x02\xB4\xB2\x03\x02\x02\x02\xB5" +
		"\xB8\x03\x02\x02\x02\xB6\xB4\x03\x02\x02\x02\xB6\xB7\x03\x02\x02\x02\xB7" +
		"\x19\x03\x02\x02\x02\xB8\xB6\x03\x02\x02\x02\xB9\xBA\x05\x12\n\x02\xBA" +
		"\xBB\x07\x04\x02\x02\xBB\xBC\x05\x18\r\x02\xBC\xBD\x07\x03\x02\x02\xBD" +
		"\x1B\x03\x02\x02\x02\xBE\xBF\x07\n\x02\x02\xBF\xC0\x05\x18\r\x02\xC0\xC1" +
		"\x07\x06\x02\x02\xC1\xC2\x05\x14\v\x02\xC2\x1D\x03\x02\x02\x02\xC3\xC4" +
		"\x07\v\x02\x02\xC4\xC5\x05\x18\r\x02\xC5\xC6\x07\x06\x02\x02\xC6\xC7\x05" +
		"\x14\v\x02\xC7\xD0\x03\x02\x02\x02\xC8\xC9\x07\v\x02\x02\xC9\xCA\x05\x18" +
		"\r\x02\xCA\xCB\x07\x06\x02\x02\xCB\xCC\x05\x14\v\x02\xCC\xCD\x07\f\x02" +
		"\x02\xCD\xCE\x05\x14\v\x02\xCE\xD0\x03\x02\x02\x02\xCF\xC3\x03\x02\x02" +
		"\x02\xCF\xC8\x03\x02\x02\x02\xD0\x1F\x03\x02\x02\x02\xD1\xD2\x07\r\x02" +
		"\x02\xD2\xD3\x05\x18\r\x02\xD3\xD4\x07\x03\x02\x02\xD4\xD7\x03\x02\x02" +
		"\x02\xD5\xD7\x07\x0E\x02\x02\xD6\xD1\x03\x02\x02\x02\xD6\xD5\x03\x02\x02" +
		"\x02\xD7!\x03\x02\x02\x02\xD8\xD9\t\x03\x02\x02\xD9#\x03\x02\x02\x02\xDA" +
		"\xDB\x05\x12\n\x02\xDB\xDC\x07\x11\x02\x02\xDC\xE3\x03\x02\x02\x02\xDD" +
		"\xDE\x05\x12\n\x02\xDE\xDF\x07\x05\x02\x02\xDF\xE0\x05&\x14\x02\xE0\xE1" +
		"\x07\x12\x02\x02\xE1\xE3\x03\x02\x02\x02\xE2\xDA\x03\x02\x02\x02\xE2\xDD" +
		"\x03\x02\x02\x02\xE3%\x03\x02\x02\x02\xE4\xE6\x05\x18\r\x02\xE5\xE4\x03" +
		"\x02\x02\x02\xE6\xE7\x03\x02\x02\x02\xE7\xE5\x03\x02\x02\x02\xE7\xE8\x03" +
		"\x02\x02\x02\xE8\'\x03\x02\x02\x02\x15+0:FITaciky\x80\x83\xB4\xB6\xCF" +
		"\xD6\xE2\xE7";
	public static __ATN: ATN;
	public static get _ATN(): ATN {
		if (!CalcParser.__ATN) {
			CalcParser.__ATN = new ATNDeserializer().deserialize(Utils.toCharArray(CalcParser._serializedATN));
		}

		return CalcParser.__ATN;
	}

}

export class ProgramContext extends ParserRuleContext {
	public declaration(): DeclarationContext[];
	public declaration(i: number): DeclarationContext;
	public declaration(i?: number): DeclarationContext | DeclarationContext[] {
		if (i === undefined) {
			return this.getRuleContexts(DeclarationContext);
		} else {
			return this.getRuleContext(i, DeclarationContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CalcParser.RULE_program; }
	// @Override
	public enterRule(listener: CalcListener): void {
		if (listener.enterProgram) {
			listener.enterProgram(this);
		}
	}
	// @Override
	public exitRule(listener: CalcListener): void {
		if (listener.exitProgram) {
			listener.exitProgram(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CalcVisitor<Result>): Result {
		if (visitor.visitProgram) {
			return visitor.visitProgram(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class DeclarationContext extends ParserRuleContext {
	public variable_declaration(): Variable_declarationContext | undefined {
		return this.tryGetRuleContext(0, Variable_declarationContext);
	}
	public function_declaration(): Function_declarationContext | undefined {
		return this.tryGetRuleContext(0, Function_declarationContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CalcParser.RULE_declaration; }
	// @Override
	public enterRule(listener: CalcListener): void {
		if (listener.enterDeclaration) {
			listener.enterDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: CalcListener): void {
		if (listener.exitDeclaration) {
			listener.exitDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CalcVisitor<Result>): Result {
		if (visitor.visitDeclaration) {
			return visitor.visitDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Variable_declarationContext extends ParserRuleContext {
	public param(): ParamContext {
		return this.getRuleContext(0, ParamContext);
	}
	public expression(): ExpressionContext | undefined {
		return this.tryGetRuleContext(0, ExpressionContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CalcParser.RULE_variable_declaration; }
	// @Override
	public enterRule(listener: CalcListener): void {
		if (listener.enterVariable_declaration) {
			listener.enterVariable_declaration(this);
		}
	}
	// @Override
	public exitRule(listener: CalcListener): void {
		if (listener.exitVariable_declaration) {
			listener.exitVariable_declaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CalcVisitor<Result>): Result {
		if (visitor.visitVariable_declaration) {
			return visitor.visitVariable_declaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Function_declarationContext extends ParserRuleContext {
	public type_specifier(): Type_specifierContext {
		return this.getRuleContext(0, Type_specifierContext);
	}
	public name(): NameContext {
		return this.getRuleContext(0, NameContext);
	}
	public params(): ParamsContext {
		return this.getRuleContext(0, ParamsContext);
	}
	public block(): BlockContext {
		return this.getRuleContext(0, BlockContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CalcParser.RULE_function_declaration; }
	// @Override
	public enterRule(listener: CalcListener): void {
		if (listener.enterFunction_declaration) {
			listener.enterFunction_declaration(this);
		}
	}
	// @Override
	public exitRule(listener: CalcListener): void {
		if (listener.exitFunction_declaration) {
			listener.exitFunction_declaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CalcVisitor<Result>): Result {
		if (visitor.visitFunction_declaration) {
			return visitor.visitFunction_declaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ParamsContext extends ParserRuleContext {
	public param(): ParamContext[];
	public param(i: number): ParamContext;
	public param(i?: number): ParamContext | ParamContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ParamContext);
		} else {
			return this.getRuleContext(i, ParamContext);
		}
	}
	public VOID(): TerminalNode | undefined { return this.tryGetToken(CalcParser.VOID, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CalcParser.RULE_params; }
	// @Override
	public enterRule(listener: CalcListener): void {
		if (listener.enterParams) {
			listener.enterParams(this);
		}
	}
	// @Override
	public exitRule(listener: CalcListener): void {
		if (listener.exitParams) {
			listener.exitParams(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CalcVisitor<Result>): Result {
		if (visitor.visitParams) {
			return visitor.visitParams(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class PointerContext extends ParserRuleContext {
	public MUL(): TerminalNode { return this.getToken(CalcParser.MUL, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CalcParser.RULE_pointer; }
	// @Override
	public enterRule(listener: CalcListener): void {
		if (listener.enterPointer) {
			listener.enterPointer(this);
		}
	}
	// @Override
	public exitRule(listener: CalcListener): void {
		if (listener.exitPointer) {
			listener.exitPointer(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CalcVisitor<Result>): Result {
		if (visitor.visitPointer) {
			return visitor.visitPointer(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ParamContext extends ParserRuleContext {
	public type_specifier(): Type_specifierContext {
		return this.getRuleContext(0, Type_specifierContext);
	}
	public name(): NameContext {
		return this.getRuleContext(0, NameContext);
	}
	public pointer(): PointerContext | undefined {
		return this.tryGetRuleContext(0, PointerContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CalcParser.RULE_param; }
	// @Override
	public enterRule(listener: CalcListener): void {
		if (listener.enterParam) {
			listener.enterParam(this);
		}
	}
	// @Override
	public exitRule(listener: CalcListener): void {
		if (listener.exitParam) {
			listener.exitParam(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CalcVisitor<Result>): Result {
		if (visitor.visitParam) {
			return visitor.visitParam(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Type_specifierContext extends ParserRuleContext {
	public INT(): TerminalNode | undefined { return this.tryGetToken(CalcParser.INT, 0); }
	public FLOAT(): TerminalNode | undefined { return this.tryGetToken(CalcParser.FLOAT, 0); }
	public CHAR(): TerminalNode | undefined { return this.tryGetToken(CalcParser.CHAR, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CalcParser.RULE_type_specifier; }
	// @Override
	public enterRule(listener: CalcListener): void {
		if (listener.enterType_specifier) {
			listener.enterType_specifier(this);
		}
	}
	// @Override
	public exitRule(listener: CalcListener): void {
		if (listener.exitType_specifier) {
			listener.exitType_specifier(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CalcVisitor<Result>): Result {
		if (visitor.visitType_specifier) {
			return visitor.visitType_specifier(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class NameContext extends ParserRuleContext {
	public CHAR(): TerminalNode | undefined { return this.tryGetToken(CalcParser.CHAR, 0); }
	public name(): NameContext | undefined {
		return this.tryGetRuleContext(0, NameContext);
	}
	public INT(): TerminalNode | undefined { return this.tryGetToken(CalcParser.INT, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CalcParser.RULE_name; }
	// @Override
	public enterRule(listener: CalcListener): void {
		if (listener.enterName) {
			listener.enterName(this);
		}
	}
	// @Override
	public exitRule(listener: CalcListener): void {
		if (listener.exitName) {
			listener.exitName(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CalcVisitor<Result>): Result {
		if (visitor.visitName) {
			return visitor.visitName(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class BlockContext extends ParserRuleContext {
	public declaration(): DeclarationContext[];
	public declaration(i: number): DeclarationContext;
	public declaration(i?: number): DeclarationContext | DeclarationContext[] {
		if (i === undefined) {
			return this.getRuleContexts(DeclarationContext);
		} else {
			return this.getRuleContext(i, DeclarationContext);
		}
	}
	public statement(): StatementContext[];
	public statement(i: number): StatementContext;
	public statement(i?: number): StatementContext | StatementContext[] {
		if (i === undefined) {
			return this.getRuleContexts(StatementContext);
		} else {
			return this.getRuleContext(i, StatementContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CalcParser.RULE_block; }
	// @Override
	public enterRule(listener: CalcListener): void {
		if (listener.enterBlock) {
			listener.enterBlock(this);
		}
	}
	// @Override
	public exitRule(listener: CalcListener): void {
		if (listener.exitBlock) {
			listener.exitBlock(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CalcVisitor<Result>): Result {
		if (visitor.visitBlock) {
			return visitor.visitBlock(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class StatementContext extends ParserRuleContext {
	public expression(): ExpressionContext | undefined {
		return this.tryGetRuleContext(0, ExpressionContext);
	}
	public assignment(): AssignmentContext | undefined {
		return this.tryGetRuleContext(0, AssignmentContext);
	}
	public block(): BlockContext | undefined {
		return this.tryGetRuleContext(0, BlockContext);
	}
	public if_statement(): If_statementContext | undefined {
		return this.tryGetRuleContext(0, If_statementContext);
	}
	public while_statement(): While_statementContext | undefined {
		return this.tryGetRuleContext(0, While_statementContext);
	}
	public return_statement(): Return_statementContext | undefined {
		return this.tryGetRuleContext(0, Return_statementContext);
	}
	public jump_statement(): Jump_statementContext | undefined {
		return this.tryGetRuleContext(0, Jump_statementContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CalcParser.RULE_statement; }
	// @Override
	public enterRule(listener: CalcListener): void {
		if (listener.enterStatement) {
			listener.enterStatement(this);
		}
	}
	// @Override
	public exitRule(listener: CalcListener): void {
		if (listener.exitStatement) {
			listener.exitStatement(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CalcVisitor<Result>): Result {
		if (visitor.visitStatement) {
			return visitor.visitStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ExpressionContext extends ParserRuleContext {
	public _left!: ExpressionContext;
	public _operator!: Token;
	public _right!: ExpressionContext;
	public INT(): TerminalNode | undefined { return this.tryGetToken(CalcParser.INT, 0); }
	public CHAR(): TerminalNode[];
	public CHAR(i: number): TerminalNode;
	public CHAR(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(CalcParser.CHAR);
		} else {
			return this.getToken(CalcParser.CHAR, i);
		}
	}
	public name(): NameContext | undefined {
		return this.tryGetRuleContext(0, NameContext);
	}
	public expression(): ExpressionContext[];
	public expression(i: number): ExpressionContext;
	public expression(i?: number): ExpressionContext | ExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExpressionContext);
		} else {
			return this.getRuleContext(i, ExpressionContext);
		}
	}
	public MUL(): TerminalNode | undefined { return this.tryGetToken(CalcParser.MUL, 0); }
	public DIV(): TerminalNode | undefined { return this.tryGetToken(CalcParser.DIV, 0); }
	public ADD(): TerminalNode | undefined { return this.tryGetToken(CalcParser.ADD, 0); }
	public SUB(): TerminalNode | undefined { return this.tryGetToken(CalcParser.SUB, 0); }
	public REMAIN(): TerminalNode | undefined { return this.tryGetToken(CalcParser.REMAIN, 0); }
	public EQUAL(): TerminalNode | undefined { return this.tryGetToken(CalcParser.EQUAL, 0); }
	public NOT_EQUAL(): TerminalNode | undefined { return this.tryGetToken(CalcParser.NOT_EQUAL, 0); }
	public GREATER_THAN(): TerminalNode | undefined { return this.tryGetToken(CalcParser.GREATER_THAN, 0); }
	public LESS_THAN(): TerminalNode | undefined { return this.tryGetToken(CalcParser.LESS_THAN, 0); }
	public GREATER_OR_EQUAL(): TerminalNode | undefined { return this.tryGetToken(CalcParser.GREATER_OR_EQUAL, 0); }
	public LESS_OR_EQUAL(): TerminalNode | undefined { return this.tryGetToken(CalcParser.LESS_OR_EQUAL, 0); }
	public AND(): TerminalNode | undefined { return this.tryGetToken(CalcParser.AND, 0); }
	public OR(): TerminalNode | undefined { return this.tryGetToken(CalcParser.OR, 0); }
	public NOT(): TerminalNode | undefined { return this.tryGetToken(CalcParser.NOT, 0); }
	public ADDRESS(): TerminalNode | undefined { return this.tryGetToken(CalcParser.ADDRESS, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CalcParser.RULE_expression; }
	// @Override
	public enterRule(listener: CalcListener): void {
		if (listener.enterExpression) {
			listener.enterExpression(this);
		}
	}
	// @Override
	public exitRule(listener: CalcListener): void {
		if (listener.exitExpression) {
			listener.exitExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CalcVisitor<Result>): Result {
		if (visitor.visitExpression) {
			return visitor.visitExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AssignmentContext extends ParserRuleContext {
	public name(): NameContext {
		return this.getRuleContext(0, NameContext);
	}
	public expression(): ExpressionContext {
		return this.getRuleContext(0, ExpressionContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CalcParser.RULE_assignment; }
	// @Override
	public enterRule(listener: CalcListener): void {
		if (listener.enterAssignment) {
			listener.enterAssignment(this);
		}
	}
	// @Override
	public exitRule(listener: CalcListener): void {
		if (listener.exitAssignment) {
			listener.exitAssignment(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CalcVisitor<Result>): Result {
		if (visitor.visitAssignment) {
			return visitor.visitAssignment(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class While_statementContext extends ParserRuleContext {
	public expression(): ExpressionContext {
		return this.getRuleContext(0, ExpressionContext);
	}
	public block(): BlockContext {
		return this.getRuleContext(0, BlockContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CalcParser.RULE_while_statement; }
	// @Override
	public enterRule(listener: CalcListener): void {
		if (listener.enterWhile_statement) {
			listener.enterWhile_statement(this);
		}
	}
	// @Override
	public exitRule(listener: CalcListener): void {
		if (listener.exitWhile_statement) {
			listener.exitWhile_statement(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CalcVisitor<Result>): Result {
		if (visitor.visitWhile_statement) {
			return visitor.visitWhile_statement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class If_statementContext extends ParserRuleContext {
	public expression(): ExpressionContext {
		return this.getRuleContext(0, ExpressionContext);
	}
	public block(): BlockContext[];
	public block(i: number): BlockContext;
	public block(i?: number): BlockContext | BlockContext[] {
		if (i === undefined) {
			return this.getRuleContexts(BlockContext);
		} else {
			return this.getRuleContext(i, BlockContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CalcParser.RULE_if_statement; }
	// @Override
	public enterRule(listener: CalcListener): void {
		if (listener.enterIf_statement) {
			listener.enterIf_statement(this);
		}
	}
	// @Override
	public exitRule(listener: CalcListener): void {
		if (listener.exitIf_statement) {
			listener.exitIf_statement(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CalcVisitor<Result>): Result {
		if (visitor.visitIf_statement) {
			return visitor.visitIf_statement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Return_statementContext extends ParserRuleContext {
	public expression(): ExpressionContext | undefined {
		return this.tryGetRuleContext(0, ExpressionContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CalcParser.RULE_return_statement; }
	// @Override
	public enterRule(listener: CalcListener): void {
		if (listener.enterReturn_statement) {
			listener.enterReturn_statement(this);
		}
	}
	// @Override
	public exitRule(listener: CalcListener): void {
		if (listener.exitReturn_statement) {
			listener.exitReturn_statement(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CalcVisitor<Result>): Result {
		if (visitor.visitReturn_statement) {
			return visitor.visitReturn_statement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Jump_statementContext extends ParserRuleContext {
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CalcParser.RULE_jump_statement; }
	// @Override
	public enterRule(listener: CalcListener): void {
		if (listener.enterJump_statement) {
			listener.enterJump_statement(this);
		}
	}
	// @Override
	public exitRule(listener: CalcListener): void {
		if (listener.exitJump_statement) {
			listener.exitJump_statement(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CalcVisitor<Result>): Result {
		if (visitor.visitJump_statement) {
			return visitor.visitJump_statement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Call_functionContext extends ParserRuleContext {
	public name(): NameContext {
		return this.getRuleContext(0, NameContext);
	}
	public arguments(): ArgumentsContext | undefined {
		return this.tryGetRuleContext(0, ArgumentsContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CalcParser.RULE_call_function; }
	// @Override
	public enterRule(listener: CalcListener): void {
		if (listener.enterCall_function) {
			listener.enterCall_function(this);
		}
	}
	// @Override
	public exitRule(listener: CalcListener): void {
		if (listener.exitCall_function) {
			listener.exitCall_function(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CalcVisitor<Result>): Result {
		if (visitor.visitCall_function) {
			return visitor.visitCall_function(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ArgumentsContext extends ParserRuleContext {
	public expression(): ExpressionContext[];
	public expression(i: number): ExpressionContext;
	public expression(i?: number): ExpressionContext | ExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExpressionContext);
		} else {
			return this.getRuleContext(i, ExpressionContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CalcParser.RULE_arguments; }
	// @Override
	public enterRule(listener: CalcListener): void {
		if (listener.enterArguments) {
			listener.enterArguments(this);
		}
	}
	// @Override
	public exitRule(listener: CalcListener): void {
		if (listener.exitArguments) {
			listener.exitArguments(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CalcVisitor<Result>): Result {
		if (visitor.visitArguments) {
			return visitor.visitArguments(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


