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
    = AddExp

  AddExp  (an AddExp)
    = AddExp "+" MulExp  -- plus
    | AddExp "-" MulExp  -- minus
    | MulExp

  MulExp  (a MulExp)
    = MulExp "*" PriExp  -- times
    | MulExp "/" PriExp  -- divide
    | PriExp

  PriExp  (a PriExp)
    = "(" Exp ")"  -- paren
    | "+" PriExp   -- pos
    | "-" PriExp   -- neg
    | readIdentifier
    | number

  readIdentifier  (a readIdentifier)
    = "<" identifier

  identifier  (an identifier)
    = letter alnum*

  number  (a number)
    = digit* "." digit+  -- fract
    | digit+             -- whole
}`);
