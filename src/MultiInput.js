'use strict';

import templates from './MultiInput.soy.js';
import Component from 'metal-component';
import Soy from 'metal-soy';

/**
 * This component automatically adds new fields to guarantee that there will
 * always be an empty field at the end of the list.
 */
class MultiInput extends Component {
	handleInput_(event) {
		var element = event.delegateTarget;
		var value = element.value;
		var index = parseInt(element.getAttribute('data-index'), 10);
		if (index === -1) {
			this.values.push(value);
		} else {
			this.values[index] = value;
		}
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
