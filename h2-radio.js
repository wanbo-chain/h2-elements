/*
`h2-radio`

Example:
```html
<h2-radio id="radio" label="性别" value=1></h2-radio>
<h2-radio id="radio2" label="姓名" attr-for-value="id" attr-for-label="name" value="3"></h2-radio>

<script>
    radio.items = [{value: 1, label: "男"}, {value: 2, label: "女"}];
    radio2.items = [{id: 1, name: "张三"}, {id: 2, name: "李四"}, {id: 3, name: "王五"}]
</script>
```

*/

import {html, PolymerElement} from "@polymer/polymer";
import {BaseBehavior} from "./behaviors/base-behavior";
import {mixinBehaviors} from "@polymer/polymer/lib/legacy/class";
import '@polymer/iron-selector/iron-selector';
import './behaviors/h2-elements-shared-styles.js';
/**
 * @customElement
 * @polymer
 * @demo demo/h2-radio/index.html
 */
class H2Radio extends mixinBehaviors([BaseBehavior], PolymerElement) {
  static get template() {
    return html`
    <style include="h2-elements-shared-styles">
      :host {
        display: inline-block;
        height: 34px;
        line-height: 32px;
        font-family: var(--h2-ui-font-family), sans-serif;
        font-size: var(--h2-ui-font-size);
      }

      :host([hidden]) {
        display: none;
      }

      .radio-wrapper {
        display: flex;
      }

      .candidate-wrapper {
        display: inline-block;
        position: relative;
      }

      .candidate-items {
        display: flex;
        flex-wrap: nowrap;
        vertical-align: middle;
      }

      .candidate__item:first-of-type {
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
      }

      .candidate__item:last-of-type {
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
      }

      .candidate__item {
        height: inherit;
        line-height: inherit;
        padding: 0 8px;
        font-size: inherit;
        cursor: pointer;
        border: 1px solid #ccc;
        background-color: #ffffff;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }

      .candidate__item:not(:last-of-type) {
        border-right: none;
      }

      .candidate__item:hover,
      .candidate__item.iron-selected {
        background: var(--h2-ui-bg);
        color: #fff;
      }

    </style>
    <div class="radio-wrapper">
      <template is="dom-if" if="[[ toBoolean(label) ]]">
        <div class="h2-label">[[label]]</div>
      </template>
      
      <div class="candidate-wrapper">
        <iron-selector class="candidate-items" selected="{{value}}" attr-for-selected="radio-item">
          <template is="dom-repeat" items="[[items]]">
            <span class="candidate__item" radio-item="[[ getValueByKey(item, attrForValue) ]]">
              [[ getValueByKey(item, attrForLabel) ]]
            </span>
          </template>
        </iron-selector>
        <div class="mask"></div>
      </div>
    </div>
`;
  }

  static get properties() {
    return {
      /**
       * The label of the radio.
       * @attribute label
       * @type {string}
       */
      label: {
        type: String
      },
      /**
       * The selected value of radio group.
       * @attribute selected
       * @type {string}
       */
      value: {
        type: String,
        notify: true
      },
      /**
       * Candidates of the radio group.
       * @attribute items
       * @type {array}
       */
      items: {
        type: Array
      },
      /**
       * Set to true, if the selection is required.
       * @type {boolean}
       * @default false
       */
      required: {
        type: Boolean,
        value: false
      },
      /**
       * Set to true, if the radio is readonly.
       * @type {boolean}
       * @default false
       */
      readonly: {
        type: Boolean,
        value: false
      },
      /**
       * Attribute name for value.
       * @type {string}
       * @default 'value'
       */
      attrForValue: {
        type: String,
        value: "value"
      },
      /**
       * Attribute name for label.
       * @type {string}
       * @default 'label'
       */
      attrForLabel: {
        type: String,
        value: "label"
      }
    };
  }

  static get is() {
    return "h2-radio";
  }

  static get observers() {
    return [
      '_requiredChanged(value, required, items)',
    ];
  }

  _requiredChanged(value, required, items = []) {
    if(required && items.length > 0 && value == undefined) {
      // 如果必填， 默认选中第一项
      this.value = items[0][this.attrForValue];
    }
  }

  /**
   * Always return true.
   * @returns {boolean}
   */
  validate() {
    return true;
  }
}

window.customElements.define(H2Radio.is, H2Radio);
