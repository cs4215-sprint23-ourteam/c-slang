grammar Sublang;

/*
 * Tokens (terminal)
 */
MUL: '*';
DIV: '/';
ADD: '+';
SUB: '-';
REMAIN: '%';
EQUAL: '==';
NOT_EQUAL: '!=';
GREATER_THAN: '>';
LESS_THAN: '<';
GREATER_OR_EQUAL: '>=';
LESS_OR_EQUAL: '<=';
NOT: '!';
ADDRESS: '&';
AND: '&&';
OR: '||';
INT: [0-9]+;
CHAR: [A-Z a-z]+;
FLOAT: (INT+ '.' INT+);
WHITESPACE: [ \r\n\t]+ -> skip;
VOID: 'void';

/*
 * Productions
 */
program : declaration*;

declaration: variable_declaration | function_declaration;

variable_declaration: param';' | param '=' expression';';

function_declaration: type_specifier name '(' params ')' block;

params: param+ | VOID;

pointer: MUL;

param: type_specifier name | type_specifier pointer name;

type_specifier: INT | FLOAT | CHAR;

name : CHAR | name CHAR | name '_' |name INT;

block : '{' (declaration | statement)* '}';

statement 
    : expression';'
    | assignment
    | block
    | if_statement
    | while_statement
    | return_statement
    | jump_statement
    ;

expression
   : INT                                            
   | CHAR+                                          
   | name
   | left=expression operator=MUL right=expression  
   | left=expression operator=DIV right=expression  
   | left=expression operator=ADD right=expression  
   | left=expression operator=SUB right=expression  
   | left=expression operator=REMAIN right=expression
   | left=expression operator=EQUAL right=expression 
   | left=expression operator=NOT_EQUAL right=expression 
   | left=expression operator=GREATER_THAN right=expression 
   | left=expression operator=LESS_THAN right=expression 
   | left=expression operator=GREATER_OR_EQUAL right=expression 
   | left=expression operator=LESS_OR_EQUAL right=expression 
   | left=expression operator=AND right=expression 
   | left=expression operator=OR right=expression 
   | left=expression operator=NOT
   | left=expression operator=SUB
   | left=expression operator=ADDRESS
   | left=expression operator=MUL
   ;

assignment: name '=' expression';';

while_statement: 'while (' expression ')' block;

if_statement
    : 'if (' expression ')' block 
    | 'if (' expression ')' block 'else' block;

return_statement: 'return' expression ';' | 'return;';

jump_statement: 'continue;' | 'break;';

call_function: name '(void);' | name '(' arguments ');';

arguments: expression+;
