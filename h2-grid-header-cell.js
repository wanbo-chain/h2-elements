/*

```html
<h2-grid-header-cell></h2-grid-header-cell>
```
*/
import {html, PolymerElement} from "@polymer/polymer";

/**
 * @customElement
 * @polymer
 */
class H2GridHeaderCell extends PolymerElement {
  static get template() {
    return html`
    <style>
      :host {
        display: table-cell;
        vertical-align: inherit;
        padding: 2px 8px;
        height: 32px;
        line-height: 32px;
        background: inherit;
        color: #f7f7f7;
        font-weight: bold;
      }
    </style>

    <slot></slot>
`;
  }

  static get properties() {
    return {};
  }

  static get is() {
    return "h2-grid-header-cell";
  }
}

window.customElements.define(H2GridHeaderCell.is, H2GridHeaderCell);
