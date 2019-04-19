/*

```html

```
*/

import {html, PolymerElement} from "@polymer/polymer";
import {Templatizer} from '@polymer/polymer/lib/legacy/templatizer-behavior.js';
import {mixinBehaviors} from "@polymer/polymer/lib/legacy/class";

/**
 *
 * @customElement
 * @polymer
 * @demo demo/h2-table-column/index.html
 */
class H2EditTableColumn extends mixinBehaviors([Templatizer], PolymerElement) {
  static get template() {
    return null;
  }

  static get properties() {
    return {
      prop: {
        type: String
      },

      label: {
        type: String
      },

      width: {
        type: Number
      },

      type: {
        type: String
      }
    };
  }

  static get is() {
    return "h2-edit-table-column";
  }

  constructor() {
    super();
  }

}

window.customElements.define(H2EditTableColumn.is, H2EditTableColumn);
