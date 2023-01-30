import { Node, Schema } from 'prosemirror-model';
import { Step, Transform } from 'prosemirror-transform';
import { applyPatch, createPatch, Operation } from 'rfc6902';

/**
 * For a given set of ProseMirror steps, apply each one,
 * and return the JSON Patch describing the prevDoc / doc
 * described by each step in a sequence of steps.
 */
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

/**
 * This produces debugging-friendly output for illustrating
 * the ways in which steps/JSON patches do (or don't) resemble
 * each other
 */
function runTest(doc: Node, tr: Transform) {
	const genericDoc = doc.toJSON();
	const ops = steps2ops(doc, tr.steps);
	applyPatch(genericDoc, ops);
	console.warn('input ProseMirror doc:')
	console.warn(JSON.stringify(doc))
	console.warn('JSON Patch operations:')
	console.warn(pretty(ops));
	console.warn('steps:')
	console.warn(pretty(tr.steps));
	console.warn('output doc (ProseMirror):')
	console.warn(JSON.stringify(tr.doc));
	console.warn('output doc (JSON Patch):')
	console.warn(JSON.stringify(genericDoc));
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

runTest(doc, new Transform(doc).insert(2, schema.text(' there', [schema.marks.bold.create()])))

