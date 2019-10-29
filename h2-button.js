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

  static get properties() {
    return {
      type: {
        type: String,
        value: 'primary',
        reflectToAttribute: true
      },
      size: {
        type: String,
        value: 'normal',
        reflectToAttribute: true
      }
    }
  }

  static get template() {
    return html`
    <style include="h2-elements-shared-styles">
      :host {
        display: inline-block;
        font-family: var(--h2-ui-font-family) sans-serif;;
        font-size: var(--h2-ui-font-size);
        border-radius: 4px;
        outline: none;
        height: 34px;
      }

      :host([hidden]) {
        display: none;
      }

      .btn {
        padding: 5px 10px;
        width: 100%;
        height: 100%;
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
        min-width: 0;
        font-size: inherit;
        text-transform: none;
        @apply --h2-button;
      }
      
      :host([disabled]) .btn {
        background: #aeaeae !important;
        cursor: not-allowed;
      }
      
      :host(:hover) .btn {
        opacity: 0.8;
      }
      
      :host([type=danger]) .btn {
        background: var(--h2-ui-red);
      }
      
     :host([type=warning]) .btn {
        background: var(--h2-ui-orange);
      }
      
      :host([type=fresh]) .btn {
        background: var(--h2-ui-green);
      }
      
     :host([size=small]) {
        width: 50px;
        height: 30px;
     }
     
     :host([size=large]) {
        width: 100px;
        height: 40px;
     }
    </style>
    <paper-button class="btn" disabled="[[disabled]]" noink>
      <slot></slot>
    </paper-button>
`;
  }
  
  static get is() {
    return "h2-button";
  }
}

window.customElements.define(H2Button.is, H2Button);
