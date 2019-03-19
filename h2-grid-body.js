/*

```html
<h2-grid-body></h2-grid-body>
```
*/

import {html, PolymerElement} from "@polymer/polymer";

/**
 * @customElement
 * @polymer
 */
class H2GridBody extends PolymerElement {
  static get template() {
    return html`
    <style>
      :host {
        display: table-row-group;
      }
    </style>

    <slot></slot>
`;
  }

  static get properties() {
    return {};
  }

  static get is() {
    return "h2-grid-body";
  }
}

window.customElements.define(H2GridBody.is, H2GridBody);
