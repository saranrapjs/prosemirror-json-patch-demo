import { Node, Schema } from 'prosemirror-model';
import { Step, Transform } from 'prosemirror-transform';
import { createPatch, Operation } from 'rfc6902';

function steps2ops(doc: Node, steps: Step[]): Operation[] {
	let resultDoc = doc;
	const resultOps: Operation[] = [];

	steps.forEach(step => {
		const result = step.apply(resultDoc);
		if (!result.failed && result.doc) {
			const ops = createPatch(resultDoc.toJSON(), result.doc.toJSON());
			resultOps.push(...ops);
			resultDoc = result.doc;
		}
	});
	return resultOps;
}

const schema = new Schema({
  nodes: {
    text: {},
    doc: {content: "text*"}
  },
  marks: {
  	bold: {},
  }
});

const doc = Node.fromJSON(schema, {
	type: 'doc',
	content: [
		{
			type: 'text',
			text: 'hi you'
		}
	]
});

const pretty = (o: any) => JSON.stringify(o, null, 4);

console.warn('input doc:')
console.warn(pretty(doc))
const tr = new Transform(doc).insert(2, schema.text(' there', [schema.marks.bold.create()]));
console.warn('ops:')
const ops = steps2ops(doc, tr.steps);
console.warn(pretty(ops));
console.warn('steps:')
console.warn(pretty(tr.steps));

console.warn('output doc:')
console.warn(pretty(tr.doc));

