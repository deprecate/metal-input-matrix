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
	 * Handles an `input` event from one of the text fields. Updates the values
	 * and adds an extra field when necessary.
	 * @param {!Event} event
	 * @protected
	 */
	handleInput_(event) {
		const element = event.delegateTarget;
		const fieldIndex = this.convertAttrToInt_(element, 'data-field-index');
		const rowIndex = this.convertAttrToInt_(element, 'data-row-index');
		this.values[rowIndex][fieldIndex] = element.value;
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

	/**
	 * Sets the `values` state property. If the last row contains at least one
	 * non empty field that doesn't have `disableDuplication` set to true, a new
	 * row will be added automatically here.
	 * @param {!Array<!Array<string>} values
	 * @return {!Array<!Array<string>}
	 * @protected
	 */
	setValuesFn_(values) {
		if (!values.length) {
			values = [[]];
		}

		const lastRow = values[values.length - 1];
		for (let i = 0; i < this.fieldsConfig.length; i++) {
			var config = this.fieldsConfig[i];
			if (lastRow[i] && lastRow[i] !== '' && !config.disableDuplication) {
				values.push([]);
				break;
			}
		}

		return values;
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
	 * - {string=} label Optional label for the field.
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
	 * The values for each field in each rendered row. For example, setting this
	 * to [['foo1', 'bar1'], ['foo2', 'bar2']] will render two rows of two fields
	 * each, plus an empty row (unless "disableDuplication" was is true in
	 * `fieldsConfig`).
	 * @type {!Array<!Array<*>>}
	 */
	values: {
		setter: 'setValuesFn_',
		validator: core.isArray,
		valueFn: () => []
	}
};

export default MultiInput;
