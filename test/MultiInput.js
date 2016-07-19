'use strict';

import dom from 'metal-dom';
import MultiInput from '../src/MultiInput';

describe('MultiInput', function() {
	let comp;

	afterEach(function() {
		if (comp) {
			comp.dispose();
		}
	});

	it('should render a text field for each given value, plus an empty one', function() {
		comp = new MultiInput({
			values: ['foo', 'bar']
		});

		const element = comp.element;
		assert.strictEqual(3, element.childNodes.length);
		assert.strictEqual('foo', getFieldFromWrapper(element.childNodes[0]).value);
		assert.strictEqual('bar', getFieldFromWrapper(element.childNodes[1]).value);
		assert.strictEqual('', getFieldFromWrapper(element.childNodes[2]).value);
	});

	it('should render a single empty field by default', function() {
		comp = new MultiInput();

		const element = comp.element;
		assert.strictEqual(1, element.childNodes.length);
		assert.strictEqual('', getFieldFromWrapper(element.childNodes[0]).value);
	});

	it('should add placeholder to all fields', function() {
		comp = new MultiInput({
			placeholder: 'Test',
			values: ['foo', 'bar']
		});

		const children = comp.element.childNodes;
		assert.strictEqual('Test', getFieldFromWrapper(children[0]).placeholder);
		assert.strictEqual('Test', getFieldFromWrapper(children[1]).placeholder);
		assert.strictEqual('Test', getFieldFromWrapper(children[2]).placeholder);
	});

	it('should add name to all fields except the last one', function() {
		comp = new MultiInput({
			name: 'test',
			values: ['foo', 'bar']
		});

		const children = comp.element.childNodes;
		assert.strictEqual('test1', getFieldFromWrapper(children[0]).name);
		assert.strictEqual('test2', getFieldFromWrapper(children[1]).name);
		assert.strictEqual('', getFieldFromWrapper(children[2]).name);
	});

	it('should add another empty field if the last one is typed on', function(done) {
		comp = new MultiInput({
			values: ['foo', 'bar']
		});

		let lastField = getFieldFromWrapper(comp.element.childNodes[2]);
		lastField.value = 'last';
		dom.triggerEvent(lastField, 'input');

		comp.once('stateSynced', function() {
			assert.deepEqual(['foo', 'bar', 'last'], comp.values);
			assert.strictEqual(4, comp.element.childNodes.length);

			lastField = getFieldFromWrapper(comp.element.childNodes[3]);
			assert.strictEqual('', lastField.value);
			done();
		});
	});

	it('should not add another text field if field before the last one is typed on', function(done) {
		comp = new MultiInput({
			values: ['foo', 'bar']
		});

		let lastField = getFieldFromWrapper(comp.element.childNodes[1]);
		lastField.value = 'bar2';
		dom.triggerEvent(lastField, 'input');

		comp.once('stateSynced', function() {
			assert.deepEqual(['foo', 'bar2'], comp.values);
			assert.strictEqual(3, comp.element.childNodes.length);
			done();
		});
	});

	it('should render a remove button for each field except the last one', function() {
		comp = new MultiInput({
			values: ['foo', 'bar']
		});

		const children = comp.element.children;
		assert.ok(children[0].querySelector('button'));
		assert.ok(children[1].querySelector('button'));
		assert.ok(!children[2].querySelector('button'));
	});

	it('should remove field when the remove button is clicked', function(done) {
		comp = new MultiInput({
			values: ['foo', 'bar']
		});

		let removeButton = comp.element.childNodes[0].querySelector('button');
		dom.triggerEvent(removeButton, 'click');

		comp.once('stateSynced', function() {
			assert.deepEqual(['bar'], comp.values);
			assert.strictEqual(2, comp.element.childNodes.length);
			done();
		});
	});

	function getFieldFromWrapper(wrapper) {
		return wrapper.childNodes[0].childNodes[0];
	}
});
