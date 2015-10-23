'use strict';

import { gengoGrammar } from 'src/gengo.js';

// trigger
// flow <<, >>
// querying
// layers
// {x, y, ... | }

var gengoSemantics = gengoGrammar.semantics();

class GengoInterpreter {
    static getInstance() {
        return this.instance || (this.instance = new GengoInterpreter());
    }

    static resetInstance() {
        this.instance = undefined;
    }

    constructor() {
        this.stack = new GengoStack();
    }

    getStack() {
        return this.stack;
    }

    withTemporaryFrame(func) {
        this.getStack().pushFrame();
        func();
        this.getStack().popFrame();
    }
}

class GengoStack {
    constructor() {
        this.frames = [
            new GengoFrame()
        ];
    }

    pushFrame() {
        return this.frames.push(new GengoFrame());
    }

    popFrame() {
        return this.frames.pop();
    }

    topFrame() {
        return this.frames[this.frames.length - 1];
    }

    declareLocalVariable(identifier) {
        this.topFrame().createVariable(identifier);
    }

    setVariableValue(identifier, value) {
        const notYetFound = {};
        var found = this.frames.reduceRight((found, frame) => {
            if(found === notYetFound && frame.hasVariable(identifier)) {
                frame.getVariable(identifier).setValue(value);
                return {};
            }
            return found;
        }, notYetFound);

        if(found === notYetFound) {
            throw new Error('tried to set undeclared variable');
        }
        return value;
    }

    getVariable(identifier) {
        const notYetFound = {};
        var variable = this.frames.reduceRight((found, frame) => {
            if(found === notYetFound && frame.hasVariable(identifier)) {
                return frame.getVariable(identifier);
            }
            return found;
        }, notYetFound);

        if(variable === notYetFound) {
            throw new Error('tried to get undeclared variable');
        }
        return variable;
    }
}

class GengoFrame {
    constructor() {
        this.variables = new Map();
    }

    hasVariable(identifier) {
        return this.variables.has(identifier);
    }

    createVariable(identifier) {
        return this.variables.set(identifier, new GengoVariable(null));
    }

    getVariable(identifier) {
        return this.variables.get(identifier);
    }
}

class GengoVariable {
    constructor(value) {
        this.value = value;
    }

    getValue() {
        return this.value;
    }

    setValue(value) {
        this.value = value;
    }

    __print__() {
        return this.value.__print__();
    }
}

class GengoValue {}

class GengoNumber extends GengoValue {
    constructor(value) {
        super();
        this.value = value;
    }

    __print__() {
        return this.value.toString();
    }

    add(gengoNumber) {
        return new GengoNumber(this.value + gengoNumber.value);
    }
}

gengoSemantics.addOperation('interpret', {
        Module: function(e) { return e.interpret(); },

        StatementList: function(e) {
            return e.interpret();
        },

        Statement: function(e) { return e.interpret(); },
        Statement_print: function(_, e) {
            var result = e.interpret();
            console.log('print', result);
            return result;
        },

        Scope: function(_, e, __) {
            GengoInterpreter.getInstance().withTemporaryFrame(() => {
                e.interpret();
            });
        },

        VariableDeclaration: function(_, e) {
            var variableName = e.interval.contents;
            GengoInterpreter.getInstance().getStack().declareLocalVariable(variableName);
        },

        Assignment: function(identifier, _, value) {
            GengoInterpreter.getInstance().getStack().setVariableValue(
                identifier.interpret(),
                value.interpret()
            );
        },

        Exp: function(e) { return e.interpret(); },

        FunctionCallExpression: function(identifier, _, method, __, argument, ___) {
            var variable = GengoInterpreter.getInstance().getStack().getVariable(
                identifier.interpret()
            );

            return variable.getValue().add(argument.interpret());
        },

        BinaryExpression: function(e) { return e.interpret(); },
        BinaryExpression_plus: function(x, _, y) { return x.interpret() + y.interpret(); },
        BinaryExpression_minus: function(x, _, y) { return x.interpret() - y.interpret(); },
        BinaryExpression_times:  function(x, _, y) { return x.interpret() * y.interpret(); },
        BinaryExpression_divide: function(x, _, y) { return x.interpret() / y.interpret(); },

        UnaryExpression:        function(e)       { return e.interpret(); },
        UnaryExpression_paren:  function(_, e, __) { return e.interpret(); },
        UnaryExpression_pos:    function(_, e)    { return e.interpret(); },
        UnaryExpression_neg:    function(_, e)    { return -e.interpret(); },

        Literal: function(e) { return e.interpret(); },

        readIdentifier: function(_, e) {
            return GengoInterpreter.getInstance().getStack().getVariable(
                e.interpret()
            );
        },

        identifier: function(_, __) {
            return this.interval.contents;
        },

        number: function(_) {
            return new GengoNumber(parseFloat(this.interval.contents));
        }
    }
);

function interpret(source) {
    var r = gengoGrammar.match(source);
    var cstNode = gengoSemantics(r);
    return cstNode.interpret();
}

var editor = ace.edit('editor');

(function() {
    var delayedInterpretation;

    editor.on('change', () => {
        clearTimeout(delayedInterpretation);
        delayedInterpretation = setTimeout(() => {
            GengoInterpreter.resetInstance();
            var executionResult = interpret(editor.getValue());
            console.log(executionResult);
        }, 750);
    });
})();

editor.setValue(`
print 1
:answer
answer = 42
print <answer
{
    :answer
    :foo
    answer = 17
    foo = answer.add(3)
    print <answer
    print <foo
}
print <answer
`);
