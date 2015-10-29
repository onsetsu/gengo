'use strict';

export var gengoGrammar = ohm.grammar(`Gengo {
  Module  (a Module)
    = StatementList

  StatementList  (a StatementList)
    = Statement*

  Statement  (a Statement)
    = PrintStatement
    | Scope
    | VariableDeclaration
    | Assignment
    | Exp

  PrintStatement  (a PrintStatement)
    = "print" Exp

  Scope  (a Scope)
    = "{" StatementList "}"

  Assignment  (a Assignment)
    = identifier "=" Exp

  VariableDeclaration  (a VariableDeclaration)
    = ":" identifier

  Exp  (an Exp)
    = FunctionCallExpression
    | UnaryExpression

  FunctionCallExpression (a function call)
    = identifier "." identifier "(" number ")"

  UnaryExpression  (a UnaryExpression)
    = "(" Exp ")"  -- paren
    | readIdentifier
    | Literal

  Literal
    = number

  readIdentifier  (a readIdentifier)
    = "<" identifier

  identifier  (an identifier)
    = letter alnum*

  number  (a number)
    = digit* "." digit+  -- fract
    | digit+             -- whole
}`);
