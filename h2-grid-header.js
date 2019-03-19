/*

```html
<h2-grid-header></h2-grid-header>
```
*/
import {html, PolymerElement} from "@polymer/polymer";

/**
 * @customElement
 * @polymer
 */
class H2GridHeader extends PolymerElement {
  static get template() {
    return html`
    <style>
      :host {
        display: table-header-group;
        vertical-align: middle;
        border-color: inherit;
        background-color: #595959;
      }

      .header {
        background: inherit;
        display: table-row;
      }

    </style>

    <div class="header">
      <slot></slot>
    </div>
`;
  }

  static get properties() {
    return {};
  }

  static get is() {
    return "h2-grid-header";
  }
}

window.customElements.define(H2GridHeader.is, H2GridHeader);
