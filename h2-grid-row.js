/*

```html
<h2-grid-row></h2-grid-row>
```
*/
import {html, PolymerElement} from "@polymer/polymer";

/**
 * @customElement
 * @polymer
 */
class H2GridRow extends PolymerElement {
  static get template() {
    return html`
    <style>
      :host {
        display: table-row;
        padding: 0;
        margin: 0;
        border-top: 1px solid #ddd;
        border-bottom: 1px solid #ddd;
        position: relative;
      }

      :host(:hover) {
        background: #CAF1FF !important;
      }

      :host(:nth-of-type(odd)) {
        background: #ffffff;
      }

      :host(:nth-of-type(even)) {
        background: #efefef;
      }

      ::slotted([slot=subItem]) {
        padding: 10px;
      }

    </style>

    <slot></slot>
`;
  }

  static get properties() {
    return {};
  }

  static get is() {
    return "h2-grid-row";
  }
}

window.customElements.define(H2GridRow.is, H2GridRow);
