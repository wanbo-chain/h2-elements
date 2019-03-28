/*
`h2-textarea`

Example:
```html
<h2-textarea label="备注"></h2-textarea>
<h2-textarea label="备注" required></h2-textarea>
```


## Styling

The following custom properties and mixins are available for styling:

|Custom property | Description | Default|
|----------------|-------------|----------|
|`--h2-textarea` | Mixin applied to the textarea | {}
|`--h2-textarea-placeholder` | Mixin applied to placeholder of the textarea | {}

*/

import {html, PolymerElement} from "@polymer/polymer";
import '@polymer/iron-icon';
import '@polymer/iron-icons/social-icons';
import './behaviors/h2-elements-shared-styles.js';
import {mixinBehaviors} from "@polymer/polymer/lib/legacy/class";
import {BaseBehavior} from "./behaviors/base-behavior";
/**
 * `h2-textarea`
 *
 * @customElement
 * @polymer
 * @demo demo/h2-textarea/index.html
 */
class H2Textarea extends mixinBehaviors(BaseBehavior, PolymerElement) {
  static get template() {
    return html`
    <style include="h2-elements-shared-styles">
      :host {
        display: flex;
        flex-wrap: nowrap;
        font-family: var(--h2-ui-font-family), sans-serif;
        font-size: var(--h2-ui-font-size);
        width: 400px;
        height: 68px;
        position: relative;
        background: white;
      }

      #textarea-wrapper {
        flex: 1;
        display: flex;
        position: relative;
      }

      #textarea {
        flex: 1;

        border: 1px solid #ccc;
        border-radius: 4px;
        padding: 6px;
        outline: none;
        resize: none;
        background: inherit;
        color: inherit;
        font-size: inherit;
        font-family: inherit;
        line-height: inherit;
        text-align: inherit;

        @apply --h2-textarea;
      }

      :host([data-invalid]) #textarea {
        border-color: var(--h2-ui-color_pink);
      }


      textarea::-webkit-input-placeholder {
        color: #999;
        @apply --h2-textarea-placeholder;
      }

      textarea:-moz-placeholder {
        color: #999;
        @apply --h2-textarea-placeholder;
      }

      textarea::-moz-placeholder {
        color: #999;
        @apply --h2-textarea-placeholder;
      }

      textarea:-ms-input-placeholder {
        color: #999;
        @apply --h2-textarea-placeholder;
      }

    </style>
    <template is="dom-if" if="[[ toBoolean(label) ]]">
      <div class="h2-label">[[label]]</div>
    </template>
    
    <div id="textarea-wrapper">
      <textarea id="textarea" value="{{value::input}}" aria-label$="[[label]]" autocomplete$="[[autocomplete]]" autofocus$="[[autofocus]]" inputmode$="[[inputmode]]" placeholder$="[[placeholder]]" readonly$="[[readonly]]" required$="[[required]]" disabled$="[[disabled]]" rows$="[[rows]]" minlength$="[[minlength]]" maxlength$="[[maxlength]]"></textarea>
      <div class="mask"></div>
    </div>
    <div class="prompt-tip__container" data-prompt$="[[prompt]]">
      <div class="prompt-tip">
        <iron-icon class="prompt-tip-icon" icon="social:sentiment-very-dissatisfied"></iron-icon>
        [[prompt]]
      </div>
    </div>
`;
  }

  static get properties() {
    return {
      /**
       * The value of the textarea.
       * @type {string|number}
       */
      value: {
        type: String,
        notify: true
      },

      /**
       * The initial number of rows.
       *
       * @attribute rows
       * @type number
       * @default 1
       */
      rows: {
        type: Number,
        value: 1
      },

      /**
       * Bound to the textarea's `autocomplete` attribute.
       * @default 'off'
       */
      autocomplete: {
        type: String,
        value: 'off'
      },

      /**
       * Bound to the textarea's `autofocus` attribute.
       * @default false
       */
      autofocus: {
        type: Boolean,
        value: false
      },

      /**
       * Bound to the textarea's `inputmode` attribute.
       */
      inputmode: {
        type: String
      },

      /**
       * Bound to the textarea's `placeholder` attribute.
       */
      placeholder: {
        type: String
      },

      /**
       * Bound to the textarea's `readonly` attribute.
       */
      readonly: {
        type: Boolean
      },

      /**
       * Set to true to mark the textarea as required.
       */
      required: {
        type: Boolean
      },

      /**
       * The minimum length of the input value.
       */
      minlength: {
        type: Number
      },

      /**
       * The maximum length of the input value.
       */
      maxlength: {
        type: Number
      },

      /**
       * Bound to the textarea's `aria-label` attribute.
       */
      label: {
        type: String
      },
      /**
       * The prompt to show when textarea is invalid.
       */
      prompt: {
        type: String
      }
    };
  }

  static get is() {
    return "h2-textarea";
  }
  static get observers() {
    return [
      '__refreshUIState(required)',
      '__refreshUIState(value)'
    ];
  }

  /**
   * Returns the underlying textarea.
   * @type HTMLTextAreaElement
   */
  get textarea() {
    return this.$.textarea;
  }

  /**
   * Returns textarea's selection start.
   * @type Number
   */
  get selectionStart() {
    return this.$.textarea.selectionStart;
  }

  /**
   * Returns textarea's selection end.
   * @type Number
   */
  get selectionEnd() {
    return this.$.textarea.selectionEnd;
  }

  /**
   * Sets the textarea's selection start.
   */
  set selectionStart(value) {
    this.$.textarea.selectionStart = value;
  }

  /**
   * Sets the textarea's selection end.
   */
  set selectionEnd(value) {
    this.$.textarea.selectionEnd = value;
  }

  __refreshUIState() {
    if (!this.validate()) {
      this.setAttribute("data-invalid", "");
    } else {
      this.removeAttribute("data-invalid");
    }
  }

  /**
   * Returns true if `value` is valid. Use`textarea`'s `validity` attribute.
   *
   * @return {boolean} True if the value is valid.
   */
  validate() {
    return this.$.textarea.validity.valid;
  }

  /**
   * Set focus to textarea.
   */
  doFocus() {
    this.$.textarea.focus();
  }
}

window.customElements.define(H2Textarea.is, H2Textarea);
