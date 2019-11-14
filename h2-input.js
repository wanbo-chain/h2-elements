/*

Example:
```html
<h2-input label="文本框"></h2-input>
<h2-input label="数字框" type="number"></h2-input>
<h2-input label="电话" type="tel" maxlength="11"></h2-input>
<h2-input label="密码框" type="password"></h2-input>
<h2-input label="颜色框" type="color"></h2-input>
<h2-input label="日期框" type="date"></h2-input>
<h2-input label="日期时间框" type="datetime-local"></h2-input>
```

## Styling

The following custom properties and mixins are available for styling:

|Custom property | Description | Default|
|----------------|-------------|----------|
|`--h2-input-label` | Mixin applied to the label of input | {}
|`--h2-input` | Mixin applied to the input | {}
|`--h2-input-unit` | Mixin applied to unit of the input value | {}

*/

import {mixinBehaviors} from "@polymer/polymer/lib/legacy/class";
import {html, PolymerElement} from "@polymer/polymer";
import '@polymer/iron-input';
import '@polymer/iron-icon';
import '@polymer/iron-icons/social-icons';

import {BaseBehavior} from "./behaviors/base-behavior";
import './behaviors/h2-elements-shared-styles.js';

/**
 * @customElement
 * @polymer
 * @demo demo/h2-input/index.html
 */
class H2Input extends mixinBehaviors([BaseBehavior], PolymerElement) {
  static get template() {
    return html`
    <style include="h2-elements-shared-styles">
      :host {
        display: flex;
        width: 300px;
        height: 34px;
        line-height: 34px;
        font-family: var(--h2-ui-font-family), sans-serif;
        font-size: var(--h2-ui-font-size);
      }

      :host .input__container {
        flex: 1;
        display: flex;
        line-height: inherit;
        min-width: 0;
        position: relative;
      }
      
      :host([readonly]) .input__container {
        pointer-events: none;
        opacity: 0.5;
        cursor: no-drop;
      }

      #input {
        height: inherit;
        min-width: inherit;
        display: flex;
        flex: 1;
      }

      #innerInput {
        flex: 1;
        font-family: 'Microsoft Yahei', sans-serif;
        font-size: inherit;
        height: inherit;
        padding: 4px 8px;
        width: 100%;
        min-width: inherit;
        background-color: #fff;
        border: 1px solid #ccc;
        border-radius: 4px;

        -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);
        box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);
        -webkit-transition: border-color ease-in-out .15s, -webkit-box-shadow ease-in-out .15s;
        -o-transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
        transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
        @apply --h2-input;
      }

      :host(:not([readonly])) input:focus {
        border-color: #66afe9;
        outline: 0;
        -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 8px rgba(102, 175, 233, .6);
        box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 8px rgba(102, 175, 233, .6);
      }

      :host .input-unit {
        background: var(--h2-ui-bg);
        color: var(--h2-ui-color_white);
        white-space: nowrap;

        height: inherit;
        line-height: inherit;

        padding-left: 8px;
        padding-right: 8px;
        @apply --h2-input-unit;
      }

      /*前缀单位*/
      :host .prefix-unit {
        border: 1px solid #ccc;
        border-right: none;
        border-radius: 4px 0 0 4px;
      }

      /*后缀单位*/
      :host .suffix-unit {
        border: 1px solid #ccc;
        border-left: none;
        border-radius: 0 4px 4px 0;
      }

      :host([prefix-unit]) input {
        border-left: none !important;
        border-top-left-radius: 0 !important;
        border-bottom-left-radius: 0 !important;
      }

      :host([suffix-unit]) input {
        border-right: none !important;
        border-top-right-radius: 0 !important;
        border-bottom-right-radius: 0 !important;
      }

      /*隐藏输入框的上下小箭头Chrome*/
      :host input::-webkit-outer-spin-button,
      :host input::-webkit-inner-spin-button {
        -webkit-appearance: none !important;
        margin: 0;
      }

      /*隐藏输入框的上下小箭头Firefox*/
      :host input {
        -moz-appearance: textfield;
      }

      :host input::-moz-placeholder {
        color: #999;
        opacity: 1;
      }

      :host input:-ms-input-placeholder {
        color: #999;
      }

      :host input::-webkit-input-placeholder {
        color: #999;
      }

      :host([readonly]) input {
        cursor: default;
      }

      :host([required]) .input__container::before {
        content: "*";
        color: red;
        position: absolute;
        left: -10px;
        line-height: inherit;
      }

      :host([data-invalid]) #innerInput {
        border-color: var(--h2-ui-color_pink);
      }

    </style>
    <template is="dom-if" if="[[ toBoolean(label) ]]">
       <div class="h2-label">[[label]]</div>
    </template>
    
    <!--可编辑状态-->
    <div class="input__container">
      <template is="dom-if" if="[[prefixUnit]]">
        <div class="prefix-unit input-unit">[[prefixUnit]]</div>
      </template>
      <iron-input bind-value="{{value}}" id="input">
        <input id="innerInput" placeholder$="[[placeholder]]" type$="[[type]]" minlength$="[[minlength]]" maxlength$="[[maxlength]]" min$="[[min]]" max$="[[max]]" readonly$="[[readonly]]" autocomplete="off" step="any" spellcheck="false">
      </iron-input>
      <template is="dom-if" if="[[suffixUnit]]">
        <div class="suffix-unit input-unit">[[suffixUnit]]</div>
      </template>
      
      <div class="prompt-tip__container" data-prompt$="[[prompt]]">
      <div class="prompt-tip">
        <iron-icon class="prompt-tip-icon" icon="social:sentiment-very-dissatisfied"></iron-icon>
        [[prompt]]
      </div>
    </div>
    <!--add mask when the componet is disabled or readonly-->
    <div class="mask"></div>
    
    </div>
    
    
`;
  }

  static get properties() {
    return {
      /**
       * The label of the input.
       */
      label: {
        type: String
      },
      /**
       * The placeholder of the input.
       */
      placeholder: {
        type: String
      },
      /**
       * Bound to input' `type` attribute. [Input types](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/Input)
       * @attribute type
       * @type {string}
       * @default 'text'
       */
      type: {
        type: String,
        value: "text"
      },
      /**
       * A regexp to validate user input.
       * @type {string}
       */
      allowedPattern: {
        type: String
      },
      /**
       * Value of the input.
       * @type {string}
       */
      value: {
        type: String,
        notify: true
      },
      /**
       * Set to true, if the input is required.
       * @type {boolean}
       * @default false
       */
      required: {
        type: Boolean,
        value: false
      },
      /**
       * Set to true, if the input is readonly.
       * @type {boolean}
       * @default false
       */
      readonly: {
        type: Boolean,
        value: false
      },
      /**
       * Prefix unit to show（i.e. ￥$元吨托）
       * @type {string}
       */
      prefixUnit: {
        type: String
      },
      /**
       * Suffix unit to show（i.e. ￥$元吨托）
       * @type {string}
       */
      suffixUnit: {
        type: String
      },
      /**
       * The minimum length user can input.
       * @type {number}
       */
      minlength: {
        type: Number
      },
      /**
       * The maximum length user can input.
       * @type {number}
       */
      maxlength: {
        type: Number
      },

      /**
       * The minimum value user can input or choose.
       * @type {string}
       */
      min: {
        type: String
      },
      /**
       * The maximum value user can input or choose
       * @type {string}
       */
      max: {
        type: String
      },

      /**
       * The prompt tip to show when input is invalid.
       * @type {String}
       */
      prompt: {
        type: String
      }
    };
  }

  static get is() {
    return "h2-input";
  }

  static get observers() {
    return [
      '__refreshUIState(required, min, max, value)',
      '__allowedPatternChanged(allowedPattern)'
    ];
  }

  __allowedPatternChanged() {
    if (this.allowedPattern) {
      this._patternRegExp = new RegExp(this.allowedPattern);
      this.__refreshUIState();
    }
  }

  __refreshUIState() {
    if (!this.validate()) {
      this.setAttribute("data-invalid", "");
    } else {
      this.removeAttribute("data-invalid");
    }
  }

  /**
   * Set focus to input.
   */
  doFocus() {
    this.root.querySelector("#innerInput").focus();
  }

  /**
   * Validates the input element.
   *
   * First check the iron-input.validate(),
   * Then if required = true check (value != undefined && value !== '')
   * And if allowPattern is defined , use the regexp to test the value
   *
   * @returns {boolean}
   */
  validate() {
    let valid = this.root.querySelector("#input").validate();

    if (this.required) {
      valid = valid && (this.value != undefined && this.value !== '');
    }

    if (this._patternRegExp) {
      valid = valid && this._patternRegExp.test(this.value);
    }

    return valid;
  }
}

window.customElements.define(H2Input.is, H2Input);
