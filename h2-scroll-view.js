/*
`h2-scroll-view`

Example:
```html
<h2-scroll-view>
  <p>Alice was beginning to get very tired of sitting by her sisteron the bank, and of having nothing to do</p>
</h2-scroll-view>
```
*/
import {html, PolymerElement} from "@polymer/polymer";
import {mixinBehaviors} from "@polymer/polymer/lib/legacy/class";

/**
 * @customElement
 * @polymer
 * @demo demo/h2-scroll-view/index.html
 */
class H2ScrollView extends mixinBehaviors([], PolymerElement) {
  static get template() {
    return html`
    <style>
      :host {
        display: flex;
      }

      #scroll-container {
        flex: 1;
        display: flex;
      }

      #inner-container {
        flex: 1;
      }
    </style>
    <paper-dialog-scrollable id="scroll-container">
      <div id="inner-container">
        <slot></slot>
      </div>
    </paper-dialog-scrollable>
`;
  }

  static get properties() {
    return {};
  }

  static get is() {
    return "h2-scroll-view";
  }
}

window.customElements.define(H2ScrollView.is, H2ScrollView);
