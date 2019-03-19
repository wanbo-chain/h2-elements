/*

```html

<h2-grid>
  <h2-grid-header>
    <h2-grid-header-cell></h2-grid-header-cell>
    <h2-grid-header-cell>name</h2-grid-header-cell>
    <h2-grid-header-cell>age</h2-grid-header-cell>
    <h2-grid-header-cell>sex</h2-grid-header-cell>
  </h2-grid-header>

  <h2-grid-body>
    <h2-grid-row>
      <h2-grid-cell>zhang san</h2-grid-cell>
      <h2-grid-cell>li si</h2-grid-cell>
      <h2-grid-cell>wang wu</h2-grid-cell>
    </h2-grid-row>

    <h2-grid-row>
      <h2-grid-cell>zhang san</h2-grid-cell>
      <h2-grid-cell>li si</h2-grid-cell>
      <h2-grid-cell>wang wu</h2-grid-cell>
    </h2-grid-row>

  </h2-grid-body>
</h2-grid>
```
*/

import './h2-pagination.js';
import {html, PolymerElement} from "@polymer/polymer";

/**
 * `h2-grid`
 *
 * @customElement
 * @polymer
 * @demo demo/h2-grid/index.html
 */
class H2Grid extends PolymerElement {
  static get template() {
    return html`
    <style>
      :host {
        display: table;
        font-family: "Helvetica Neue", Helvetica, Microsoft Yahei, Hiragino Sans GB, WenQuanYi Micro Hei, sans-serif;
        font-size: 14px;
        background: #fdfdfd;
      }

    </style>
    <slot></slot>
`;
  }

  static get properties() {
    return {};
  }

  static get is() {
    return "h2-grid";
  }
}

window.customElements.define(H2Grid.is, H2Grid);
