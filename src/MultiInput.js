'use strict';

import templates from './MultiInput.soy.js';
import Component from 'metal-component';
import Soy from 'metal-soy';

/**
 * This component automatically adds new fields to guarantee that there will
 * always be an empty field at the end of the list.
 */
class MultiInput extends Component {
}
Soy.register(MultiInput, templates);

export default MultiInput;
