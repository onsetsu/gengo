//import { interpret, GengoInterpreter } from 'src/gengo/gengo-interpreter.js';

var canvas = document.querySelector('#drawing');
paper.install(window);
var scope = paper.setup(canvas);

var text = new PointText(new Point(200, 50));
text.justification = 'center';
text.fillColor = 'black';
text.content = 'The contents of the point text';

var rect = new paper.Rectangle(10, 10, 100, 30);
rect.fillColor = 'black';
