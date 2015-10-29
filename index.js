'use strict';

import { interpret, GengoInterpreter } from 'src/gengo/gengo-interpreter.js';

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
