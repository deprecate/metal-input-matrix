'use strict';

import templates from './MultiInput.soy.js';
import Component from 'metal-component';
import Soy from 'metal-soy';

/**
 * This component automatically adds new fields to guarantee that there will
 * always be an empty field at the end of the list.
 */
class MultiInput extends Component {
	/**
	 * Handles an `input` event from one of the text fields. Updates the values
	 * and adds an extra field when necessary.
	 * @param {!Event} event
	 * @protected
	 */
	handleInput_(event) {
		const element = event.delegateTarget;
		const value = element.value;
		const index = parseInt(element.getAttribute('data-index'), 10);
		if (index === -1) {
			this.values.push(value);
		} else {
			this.values[index] = value;
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
		const index = parseInt(element.getAttribute('data-index'), 10);
		this.values.splice(index, 1);
		this.values = this.values;
	}
}
Soy.register(MultiInput, templates);

MultiInput.STATE = {
	values: {
		valueFn: () => []
	}
};

export default MultiInput;
