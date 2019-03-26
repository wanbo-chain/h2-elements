/*

`h2-button`

Example:
```html
<h2-button>enable</h2-button>
<h2-button disabled>disabled</h2-button>
<h2-button><iron-icon icon="check"></iron-icon>link</h2-button>

```

## Styling

The following custom properties and mixins are available for styling:

|Custom property | Description | Default|
|----------------|-------------|----------|
|`--h2-button` | Mixin applied to the button | {}

*/

import {html, PolymerElement} from "@polymer/polymer";
import '@polymer/paper-button/paper-button'
import {mixinBehaviors} from "@polymer/polymer/lib/legacy/class";
import {PaperButtonBehavior} from "@polymer/paper-behaviors/paper-button-behavior";
import './behaviors/h2-elements-shared-styles.js';

/**
 * @customElement
 * @polymer
 * @demo demo/h2-button/index.html
 */
class H2Button extends mixinBehaviors(PaperButtonBehavior, PolymerElement) {
  
  constructor() {
    super();
    this.noink = true;
  }
  static get template() {
    return html`
    <style include="h2-elements-shared-styles">
      :host {
        display: inline-block;
        font-size: 14px;
        width: 80px;
        height: 34px;
        border-radius: 4px;
        outline: none;
      }

      :host([hidden]) {
        display: none;
      }

      .btn {
        color: #fff;
        background: var(--h2-ui-bg);
        margin: 0;
        font-weight: normal;
        text-align: center;
        vertical-align: middle;
        touch-action: manipulation;
        cursor: pointer;
        white-space: nowrap;
        line-height: 1.42857143;
        border-radius: inherit;
        width: inherit;
        height: inherit;
        min-width: 0;
        font-size: inherit;
        text-transform: none;
        @apply --h2-button;
      }
      
      :host([disabled]) .btn {
        background: #aeaeae;
      }
      
      :host(:hover) .btn {
        opacity: 0.8;
      }
      
    </style>
    <paper-button class="btn" disabled$="[[disabled]]" noink>
      <slot></slot>
    </paper-button>
`;
  }
  
  static get is() {
    return "h2-button";
  }
}

window.customElements.define(H2Button.is, H2Button);
