'use strict';

import core from 'metal';
import templates from './MultiInput.soy.js';
import Component from 'metal-component';
import Soy from 'metal-soy';

/**
 * This component automatically adds new fields to guarantee that there will
 * always be an empty field at the end of the list.
 */
class MultiInput extends Component {
	/**
	 * Converts the specified element attribute to an integer.
	 * @param {!Element} element
	 * @param {string} attrName
	 * @return {number}
	 * @protected
	 */
	convertAttrToInt_(element, attrName) {
		return parseInt(element.getAttribute(attrName), 10);
	}

	/**
	 * Creates an empty array for a new row of field values.
	 * @return {!Array}
	 * @protected
	 */
	createValuesArr_() {
		var arr = [];
		var size = this.fieldsConfig.length;
		for (var i = 0; i < size; i++) {
			arr.push('');
		}
		return arr;
	}

	/**
	 * Handles an `input` event from one of the text fields. Updates the values
	 * and adds an extra field when necessary.
	 * @param {!Event} event
	 * @protected
	 */
	handleInput_(event) {
		const element = event.delegateTarget;
		const fieldIndex = this.convertAttrToInt_(element, 'data-field-index');
		let rowIndex = this.convertAttrToInt_(element, 'data-row-index');
		this.values[rowIndex][fieldIndex] = element.value;

		var last = rowIndex === this.values.length - 1;
		if (last && !this.fieldsConfig[fieldIndex].disableDuplication) {
			this.values.push(this.createValuesArr_());
		}
		this.values = this.values;
	}

	/**
	 * Handles a `click` event from one of the field's remove button.
	 * @param {!Event} event
	 * @protected
	 */
	handleRemoveClick_(event) {
		const element = event.delegateTarget;
		const index = this.convertAttrToInt_(element, 'data-row-index');
		this.values.splice(index, 1);
		this.values = this.values;
	}
}
Soy.register(MultiInput, templates);

MultiInput.STATE = {
	/**
	 * An array of objects representing fields that should be rendered together.
	 * Each field config can have one of the following configuration options:
	 * - {boolean=} disableDuplication Optional flag indicating that typing on
	 *     this field should not cause another row of fields to be created even if
	 *     it was on the last row.
	 * - {string=} name Optional field name, which will have a counter suffix
	 *     indicating its row position.
	 * - {string=} placeholder Optional placeholder for the field.
	 * @type {!Array<!Object>}
	 */
	fieldsConfig: {
		validator: core.isArray,
		valueFn: () => [{}]
	},

	/**
	 * The values for each field in each rendered row.
	 * @type {!Array<!Array<*>>}
	 */
	values: {
		validator: core.isArray,
		valueFn: function() {
			return [this.createValuesArr_()];
		}
	}
};

export default MultiInput;
