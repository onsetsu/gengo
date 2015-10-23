'use strict';

import { gengoGrammar } from 'src/gengo.js';

var gengoSemantics = gengoGrammar.semantics();

class GengoInterpreter {
    static getInstance() {
        return this.instance || (this.instance = new GengoInterpreter());
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
        this.topFrame().setVariable(identifier, null);
    }

    setVariable(identifier, value) {
        const notYetFound = {};
        var found = this.frames.reduceRight((found, frame) => {
            if(found === notYetFound && frame.hasVariable(identifier)) {
                return frame.setVariable(identifier, value);
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

    setVariable(identifier, value) {
        return this.variables.set(identifier, value);
    }

    getVariable(identifier) {
        return this.variables.get(identifier);
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
            GengoInterpreter.getInstance().getStack().setVariable(
                identifier.interpret(),
                value.interpret()
            );
        },

        AddExp: function(e) { return e.interpret(); },
        AddExp_plus: function(x, _, y) { return x.interpret() + y.interpret(); },
        AddExp_minus: function(x, _, y) { return x.interpret() - y.interpret(); },

        MulExp:        function(e)       { return e.interpret(); },
        MulExp_times:  function(x, _, y) { return x.interpret() * y.interpret(); },
        MulExp_divide: function(x, _, y) { return x.interpret() / y.interpret(); },

        PriExp:        function(e)       { return e.interpret(); },
        PriExp_paren:  function(_, e, __) { return e.interpret(); },
        PriExp_pos:    function(_, e)    { return e.interpret(); },
        PriExp_neg:    function(_, e)    { return -e.interpret(); },

        readIdentifier: function(_, e) {
            return GengoInterpreter.getInstance().getStack().getVariable(
                e.interpret()
            );
        },

        identifier: function(_, __) {
            return this.interval.contents;
        },

        number: function(_) {
            return parseFloat(this.interval.contents);
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
    answer = 17
    print <answer
}
print <answer
`);