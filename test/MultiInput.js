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

	it('should render a single row with a single empty field by default', function() {
		comp = new MultiInput();
		assert.strictEqual(2, comp.element.childNodes.length);
		assert.ok(dom.hasClass(comp.element.childNodes[0], 'multi-input-labels'));

		let fields = getFieldsForRow(comp.element, 0);
		assert.strictEqual(1, fields.length);
		assert.strictEqual('', fields[0].value);
	});

	it('should render a single text field for the given value plus an empty one below', function() {
		comp = new MultiInput({
			values: [['foo']]
		});
		assert.strictEqual(3, comp.element.childNodes.length);

		let fields = getFieldsForRow(comp.element, 0);
		assert.strictEqual(1, fields.length);
		assert.strictEqual('foo', fields[0].value);

		fields = getFieldsForRow(comp.element, 1);
		assert.strictEqual(1, fields.length);
		assert.strictEqual('', fields[0].value);

		assert.deepEqual([['foo'], []], comp.values);
	});

	it('should render multiples rows with multiple text field for the given value plus empty row', function() {
		comp = new MultiInput({
			fieldsConfig: [{}, {}],
			values: [['col1.1', 'col1.2'], ['col2.1', 'col2.2']]
		});
		assert.strictEqual(4, comp.element.childNodes.length);

		let fields = getFieldsForRow(comp.element, 0);
		assert.strictEqual(2, fields.length);
		assert.strictEqual('col1.1', fields[0].value);
		assert.strictEqual('col1.2', fields[1].value);

		fields = getFieldsForRow(comp.element, 1);
		assert.strictEqual(2, fields.length);
		assert.strictEqual('col2.1', fields[0].value);
		assert.strictEqual('col2.2', fields[1].value);

		fields = getFieldsForRow(comp.element, 2);
		assert.strictEqual(2, fields.length);
		assert.strictEqual('', fields[0].value);
		assert.strictEqual('', fields[1].value);
	});

	it('should add labels as specified in "fieldsConfig"', function() {
		comp = new MultiInput({
			fieldsConfig: [
				{
					label: 'Label 1'
				},
				{
					label: 'Label 2'
				}
			],
			values: [[], []]
		});

		const labels = comp.element.childNodes[0].childNodes;
		assert.strictEqual(2, labels.length);
		assert.strictEqual('Label 1', labels[0].textContent);
		assert.strictEqual('Label 2', labels[1].textContent);
	});

	it('should add placeholders as specified in "fieldsConfig"', function() {
		comp = new MultiInput({
			fieldsConfig: [
				{
					placeholder: 'Placeholder 1'
				},
				{
					placeholder: 'Placeholder 2'
				}
			],
			values: [[], []]
		});

		assert.strictEqual(3, comp.element.childNodes.length);

		let fields = getFieldsForRow(comp.element, 0);
		assert.strictEqual(2, fields.length);
		assert.strictEqual('Placeholder 1', fields[0].placeholder);
		assert.strictEqual('Placeholder 2', fields[1].placeholder);

		fields = getFieldsForRow(comp.element, 1);
		assert.strictEqual(2, fields.length);
		assert.strictEqual('Placeholder 1', fields[0].placeholder);
		assert.strictEqual('Placeholder 2', fields[1].placeholder);
	});

	it('should add names as specified in "fieldsConfig"', function() {
		comp = new MultiInput({
			fieldsConfig: [
				{
					name: 'address'
				},
				{
					name: 'age'
				},
				{}
			],
			values: [[], []]
		});
		assert.strictEqual(3, comp.element.childNodes.length);

		let fields = getFieldsForRow(comp.element, 0);
		assert.strictEqual(3, fields.length);
		assert.strictEqual('address1', fields[0].getAttribute('name'));
		assert.strictEqual('age1', fields[1].getAttribute('name'));
		assert.strictEqual('', fields[2].getAttribute('name'));

		fields = getFieldsForRow(comp.element, 1);
		assert.strictEqual(3, fields.length);
		assert.strictEqual('address2', fields[0].getAttribute('name'));
		assert.strictEqual('age2', fields[1].getAttribute('name'));
		assert.strictEqual('', fields[2].getAttribute('name'));
	});

	it('should add new row with empty fields if field in last row is typed on', function(done) {
		comp = new MultiInput({
			values: [['foo'], ['bar'], []]
		});

		let lastField = getFieldsForRow(comp.element, 2)[0];
		lastField.value = 'last';
		dom.triggerEvent(lastField, 'input');

		comp.once('stateSynced', function() {
			assert.deepEqual([['foo'], ['bar'], ['last'], []], comp.values);
			assert.strictEqual(5, comp.element.childNodes.length);

			lastField = getFieldsForRow(comp.element, 3)[0];
			assert.strictEqual('', lastField.value);
			done();
		});
	});

	it('should not add new row with empty fields if field in last row is typed on', function(done) {
		comp = new MultiInput({
			values: [['foo'], [], []]
		});

		let lastField = getFieldsForRow(comp.element, 1)[0];
		lastField.value = 'bar';
		dom.triggerEvent(lastField, 'input');

		comp.once('stateSynced', function() {
			assert.deepEqual([['foo'], ['bar'], []], comp.values);
			assert.strictEqual(4, comp.element.childNodes.length);
			done();
		});
	});

	it('should not add new row with empty fields if field with "disableDuplication" is typed on', function(done) {
		comp = new MultiInput({
			fieldsConfig: [{
				disableDuplication: true
			}],
			values: [['foo'], ['bar'], []]
		});

		let lastField = getFieldsForRow(comp.element, 2)[0];
		lastField.value = 'last';
		dom.triggerEvent(lastField, 'input');

		comp.once('stateSynced', function() {
			assert.deepEqual([['foo'], ['bar'], ['last']], comp.values);
			assert.strictEqual(4, comp.element.childNodes.length);
			done();
		});
	});

	it('should render a remove button for each row except the last one', function() {
		comp = new MultiInput({
			values: [['foo'], ['bar'], []]
		});

		const children = comp.element.children;
		assert.ok(children[1].querySelector('button'));
		assert.ok(children[2].querySelector('button'));
		assert.ok(!children[3].querySelector('button'));
	});

	it('should remove field when the remove button is clicked', function(done) {
		comp = new MultiInput({
			values: [['foo'], ['bar'], []]
		});

		let removeButton = comp.element.childNodes[1].querySelector('button');
		dom.triggerEvent(removeButton, 'click');

		comp.once('stateSynced', function() {
			assert.deepEqual([['bar'], []], comp.values);
			assert.strictEqual(3, comp.element.childNodes.length);
			done();
		});
	});

	function getFieldsForRow(parent, rowIndex) {
		return parent.childNodes[rowIndex + 1].childNodes[0].childNodes;
	}
});
