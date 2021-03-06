/*

`h2-checkbox-group`

Example:
```html
<h2-checkbox-group label="材料" value="0" items="{{items}}"></h2-checkbox-group>

<script>
  items = [
    {label: '薄膜', value: 0},
    {label: '纤维', value: 1},
    {label: '塑料', value: 2},
    {label: '其它', value: 3}
  ];
</script>
```

## Styling

The following custom properties and mixins are available for styling:

|Custom property | Description | Default|
|----------------|-------------|----------|
|`--h2-checkbox-group-label` | Mixin applied to the label of checkbox | {}
|`--h2-checkbox-group-checked-color` | Mixin applied to color of the checkbox when it is checked | #0099FF

*/
import {html, PolymerElement} from "@polymer/polymer";
import {mixinBehaviors} from "@polymer/polymer/lib/legacy/class";

import {BaseBehavior} from "./behaviors/base-behavior";
import './behaviors/h2-elements-shared-styles.js';
import '@polymer/paper-checkbox';

/**
 * @customElement
 * @polymer
 * @demo demo/h2-checkbox-group/index.html
 */
class H2CheckboxGroup extends mixinBehaviors(BaseBehavior, PolymerElement) {
  static get template() {
    return html`
    <style include="h2-elements-shared-styles">
      :host {
        display: flex;
        flex-wrap: nowrap;
        position: relative;
        line-height: 34px;
        font-family: var(--h2-ui-font-family), sans-serif;
        font-size: var(--h2-ui-font-size);
      }

      #checkbox-container {
        position: relative;
        display: flex;
        align-items: center;
        flex-direction: row;
        @apply --h2-checkbox-group-container;
      }

      :host([direction=column]) #checkbox-container {
        flex-direction: column;
        align-items: start;
      }
      
      :host([direction=column]) .checkbox-item {
        margin-bottom: 6px;
      }
      .checkbox-item {
        margin-left: 6px;
        --paper-checkbox-checked-color: var(--h2-ui-color_skyblue);
      }
      
      
      
    </style>
    <div class="h2-label">[[label]]</div>
    <div id="checkbox-container">
      <template is="dom-repeat" items="[[ _items ]]">
        <paper-checkbox noink class="checkbox-item" checked="{{ item.checked }}" on-change="__checkedChangeHandler" value="[[ getValueByKey(item, attrForValue) ]]">
          [[ getValueByKey(item, attrForLabel) ]]
        </paper-checkbox>
      </template>
      <div class="mask"></div>
    </div>
`;
  }
  
  static get properties() {
    return {
      /**
       * The label of the Checkbox
       *
       * @attribute label
       * @type {string}
       */
      label: {
        type: String
      },
      /**
       * Candidates of the checkbox group.
       * @attribute items
       * @type {array}
       */
      items: {
        type: Array
      },
      
      _items: {
        type: Array,
        computed: '__computedInnerItems(items, value)'
      },
      /**
       * The selected value of checkbox group.
       * @attribute value
       * @type {string}
       */
      value: {
        type: String,
        notify: true
      },
      /**
       * The selected value items of checkbox group.
       * @attribute value
       * @type {array}
       */
      selectedValues: {
        type: Array,
        notify: true
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
      },
      
      /**
       * Set to true if the selection is required.
       * @type {boolean}
       * @default false
       */
      required: {
        type: Boolean,
        value: false
      }
    };
  }
  
  static get is() {
    return "h2-checkbox-group";
  }
  
  static get observers() {
    return [
      '__valueChanged(value, items)'
    ];
  }
  
  __computedInnerItems(items = [], value = "") {
    const values = this.__parseValues(value);
    return items.map(item =>
      Object.assign({}, item, {checked: values.some(val => val === item[this.attrForValue] + '')}));
  }
  
  __checkedChangeHandler() {
    const selectValues = this._items.filter(item => !!item.checked).map(item => item[this.attrForValue]);
    this.value = selectValues.length > 0 ? selectValues.join(',') : undefined;
  }
  
  /**
   * @private
   */
  __valueChanged(value = "", items = []) {
    const values = this.__parseValues(value);
    this.selectedValues = items.filter(item => values.some(val => val === item[this.attrForValue] + ''));
  }
  
  /**
   * @private
   */
  __parseValues(value = "") {
    return value.split(',').map(val => val.trim());
  }
  
  /**
   * Validate, true if the select is set to be required and this.selectedValues.length > 0, or else false.
   * @returns {boolean}
   */
  validate() {
    return this.required ? (this.selectedValues && this.selectedValues.length > 0) : true;
  }
}

window.customElements.define(H2CheckboxGroup.is, H2CheckboxGroup);
