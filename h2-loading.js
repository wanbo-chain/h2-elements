/*
`h2-loading`

Example:
```html
<h2-loading opened></h2-loading>
```
*/
import {mixinBehaviors} from "@polymer/polymer/lib/legacy/class";
import {html, PolymerElement} from "@polymer/polymer";
import {IronOverlayBehavior} from "@polymer/iron-overlay-behavior";

/**
 * @customElement
 * @polymer
 * @demo demo/h2-loading/index.html
 */
class H2Loading extends mixinBehaviors([IronOverlayBehavior], PolymerElement) {
  static get template() {
    return html`
    <style>
      :host {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 9999;
        display: flex;
      }

      .loading-container {
        width: 80px;
        height: 80px;
        margin: auto;
        background: black;
        opacity: 0.5;
        border-radius: 6px;
        display: flex;
      }
      
      img {
        width: 40px;
        margin: auto;
      }
    </style>
    <div class="loading-container">
      <img src="[[importPath]]/img/loading-4.gif">
    </div>
    
`;
  }

  static get properties() {
    return {};
  }

  static get is() {
    return "h2-loading";
  }
}

window.customElements.define(H2Loading.is, H2Loading);
