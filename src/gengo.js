'use strict';

export var gengoGrammar = ohm.grammar(`Gengo {
  Module  (a Module)
    = StatementList

  StatementList  (a StatementList)
    = Statement*

  Statement  (a Statement)
    = "print" Exp  -- print
    | Scope
    | VariableDeclaration
    | Assignment
    | Exp

  Scope  (a Scope)
    = "{" StatementList "}"

  Assignment  (a Assignment)
    = identifier "=" Exp

  VariableDeclaration  (a VariableDeclaration)
    = ":" identifier

  Exp  (an Exp)
    = FunctionCallExpression
    | BinaryExpression

  FunctionCallExpression (a function call)
    = identifier "." identifier "(" number ")"

  BinaryExpression  (a BinaryExpression)
    = BinaryExpression "+" UnaryExpression  -- plus
    | BinaryExpression "-" UnaryExpression  -- minus
    | BinaryExpression "*" UnaryExpression  -- times
    | BinaryExpression "/" UnaryExpression  -- divide
    | UnaryExpression

  UnaryExpression  (a UnaryExpression)
    = "(" Exp ")"  -- paren
    | "+" UnaryExpression   -- pos
    | "-" UnaryExpression   -- neg
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
