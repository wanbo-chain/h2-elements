/*
`h2-select`

Example:
```html
<h2-select label="球员" placeholder="选择球员" items="[[items]]"></h2-select>
<h2-select label="球员" placeholder="选择球员" multi items="[[items]]" value="1,2"></h2-select>

<script>
  items = [
    {"label": "梅西", "value": 1},
    {"label": "C罗", "value": 2},
    {"label": "苏亚雷斯", "value": 3},
    {"label": "库蒂尼奥", "value": 4},
    {"label": "特尔斯特根", "value": 5},
    {"label": "保利尼奥", "value": 6},
    {"label": "内马尔", "value": 13}
  ];
```
## Styling

The following custom properties and mixins are available for styling:

|Custom property | Description | Default|
|----------------|-------------|----------|
|`--h2-label` | Mixin applied to the select label | {}
|`--h2-select-tag` | Mixin applied to the selected tag | {}
|`--h2-select-tag-deleter` | Mixin applied to the deleter of each tag| {}
|`--h2-select-tag-cursor` | Mixin applied to the cursor of the select | {}
|`--h2-select-dropdown` | Mixin applied to the dropdown snippet of the select | {}

*/
import {mixinBehaviors} from "@polymer/polymer/lib/legacy/class";
import {html, PolymerElement} from "@polymer/polymer";
import '@polymer/iron-icon/iron-icon';
import '@polymer/iron-icons/iron-icons';
import '@polymer/iron-selector/iron-selector';
import './behaviors/base-behavior.js';
import './behaviors/h2-elements-shared-styles.js';
import {BaseBehavior} from "./behaviors/base-behavior";
/**
 *
 * @customElement
 * @polymer
 * @demo demo/h2-select/index.html
 */
class H2Select extends mixinBehaviors([BaseBehavior], PolymerElement) {
  static get template() {
    return html`
    <style include="h2-elements-shared-styles">
      :host {
        display: flex;
        width: 300px;
        height: 34px;
        line-height: 34px;
        font-size: 14px;
        position: relative;
        background: white;
      }

      #select__container {
        flex: 1;
        display: flex;
        /*height: inherit;*/
        border: 1px solid #CCC;
        border-radius: 4px;
        position: relative;
        @apply --h2-select__container;
      }

      .tags__container {
        flex: 1;
        position: relative;
        display: flex;
        text-align: left;
      }

      .select__container__viewer {
        flex: 1;
        display: flex;
        flex-wrap: nowrap;
      }

      :host([opened]) #caret {
        transform: rotate(180deg);
        transition: transform .2s ease-in-out;
      }
      
      #caret {
        height: inherit;
        transition: transform .2s ease-in-out;
        color: var(--h2-ui-color_skyblue);
      }

      #tag-content {
        flex: 1;

        display: flex;
        flex-wrap: wrap;
        align-content: flex-start;
        overflow-y: auto;
        padding: 4px;
      }

      .tag {
        color: #fff;
        background: var(--h2-ui-bg);
        border-radius: 4px;

        margin: 2px 2px 3px 2px;
        padding: 0 4px;
        height: 22px;
        line-height: 22px;
        max-width: 200px;

        display: flex;
        font-size: 14px;
        white-space: nowrap;
        cursor: default;
        @apply --h2-select-tag;
      }

      .tag-name {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .tag-deleter {
        margin-left: 6px;
        width: 18px;
        color: #fff;
        cursor: pointer;
        @apply --h2-select-tag-deleter;
      }

      .tag-deleter:hover {
        color: var(--h2-ui-red);
      }

      .tag-cursor {
        font-size: 16px;
        line-height: 30px;
        height: 30px;

        @apply --h2-select-tag-cursor;

        border: none;
        outline: none;
        padding: 0;
        margin: 0;
        width: 1px;
      }

      #select-collapse {
        -webkit-transition: max-height 200ms ease-in;
        -moz-transition: max-height 200ms ease-in;
        -ms-transition: max-height 200ms ease-in;
        -o-transition: max-height 200ms ease-in;
        transition: max-height 200ms ease-in;

        max-height: 0;
        position: absolute;
        width: 100%;
        overflow-y: auto;
        z-index: 99;
        margin-top: 1px;

        font-size: 14px;
        text-align: left;
        background-color: #fff;
        -moz-border-radius: 4px;
        -webkit-border-radius: 4px;
        border-radius: 4px;
        -moz-box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
        -webkit-box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
        background-clip: padding-box;
        @apply --h2-select-dropdown;
      }

      #select-collapse[data-collapse-open] {
        max-height: 300px;
      }
      
      #select-collapse[data-collapse-open-top] {
        top: 100%;
      }
      
      #select-collapse[data-collapse-open-bottom] {
        bottom: 100%;
      }

      .selector-panel {
        display: block;
        padding: 5px;
      }

      .candidate-item {
        text-align: left;
        padding: 0 8px;
        margin-bottom: 1px;
        font-size: 12px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        height: 22px;
        line-height: 22px;
        cursor: pointer;
      }

      .candidate-item:not([class*='iron-selected']):hover {
        background: var(--h2-ui-bg);
        color: #fff
      }

      .iron-selected {
        background: var(--h2-ui-bg);
        color: #fff;
      }

      .iron-selected:hover {
        opacity: 0.8;
      }

      #placeholder[hidden] {
        display: none;
      }

      #placeholder {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;

        opacity: 0.5;
        padding: 0 6px;
        overflow: hidden;
        white-space: nowrap;
      }

      :host([required])::after {
        content: "*";
        color: red;
        position: absolute;
        right: -15px;
        line-height: inherit;
      }
    </style>
    
    <template is="dom-if" if="[[ toBoolean(label) ]]">
      <div class="h2-label">[[label]]</div>
    </template>
    
    <div id="select__container">
      <div class="select__container__viewer" on-click="_onInputClick">
        <div class="tags__container">
          <div id="placeholder">[[placeholder]]</div>
          <div id="tag-content">
            <input class="tag-cursor" id="tag-cursor__-1" data-cursor-index="-1" on-keydown="_updatePressed" autocomplete="off">
            <template is="dom-repeat" items="[[ selectedValues ]]">
              <div class="tag">
                <div class="tag-name" title="[[getValueByKey(item, attrForLabel)]]">
                  [[getValueByKey(item, attrForLabel)]]
                </div>
                <iron-icon class="tag-deleter" icon="icons:clear" data-args="[[getValueByKey(item, attrForValue)]]" on-click="_deleteTag"></iron-icon>
              </div>
              <template is="dom-if" if="[[ multi ]]">
                <input class="tag-cursor" id="tag-cursor__[[index]]" data-cursor-index$="[[index]]" on-keydown="_updatePressed" autocomplete="off">
              </template>
            </template>
          </div>
        </div>
        <iron-icon id="caret" icon="icons:expand-more"></iron-icon>
      </div>

      <div id="select-collapse" on-click="__focusOnLast">
        <iron-selector class="selector-panel" multi="[[ multi ]]" selected="{{ __selected }}" selected-values="{{ selectedValues }}" attr-for-selected="candidate-item">
          <template is="dom-repeat" items="[[items]]">
            <div class="candidate-item" candidate-item="[[item]]" title="[[getValueByKey(item, attrForLabel)]]">
              [[getValueByKey(item, attrForLabel)]]
            </div>
          </template>
        </iron-selector>
      </div>

      <div class="mask"></div>
    </div>
`;
  }

  static get properties() {
    return {
      /**
       * The selected value of this select,  if `multi` is true,
       * the value will join with comma ( `selectedValues.map(selected => selected[this.attrForValue]).join(',')` ).
       * @type {String}
       */
      value: {
        type: String,
        notify: true
      },

      /**
       * The selected value objects of this select.
       * @type {array}
       */
      selectedValues: {
        type: Array,
        notify: true
      },

      /**
       *
       * The candidate selection of this select.
       *
       * @attribute items
       * @type {array}
       */
      items: {
        type: Array
      },

      __selected: {
        type: Object
      },

      /**
       *
       * @attribute label
       * @type {String}
       */
      label: {
        type: String
      },
      /**
       * The placeholder of the select.
       * @type {String}
       */
      placeholder: {
        type: String
      },
      /**
       * If true, multiple selections are allowed.
       * @type {boolean}
       * @default false
       */
      multi: {
        type: Boolean,
        value: false
      },

      opened: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
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
       * Set to true, if the select is readonly.
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
       *
       * Attribute name for label.
       *
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
    return "h2-select";
  }

  static get observers() {
    return [
      '_valueChanged(value, items)',
      '_selectedValuesChanged(selectedValues.splices)',
      '__selectedChanged(__selected)'
    ];
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('blur', e => {
      this.closeCollapse();
    });
  }

  /**
   * 点击事件
   */
  _onInputClick({target: {classList}}) {
    if (classList.contains('tag-deleter') || classList.contains('tag-cursor')) {
      return;
    }

    this.toggleCollapse();
  }

  _valueChanged(value, items = []) {
    const values = String(value).split(",").map(str => str.trim());
    const flatValues = [...(new Set(values))];

    const dirty = (this.selectedValues || []).map(selected => selected[this.attrForValue]).join(',');
    if (dirty !== value) {
      this.selectedValues =
        flatValues.map(val => items.find(item => item[this.attrForValue] == val))
          .filter(selected => typeof selected !== 'undefined');

      if (!this.multi) {
        this.__selected = items.find(item => item[this.attrForValue] == flatValues[0]);
      }
    }

    this._displayPlaceholder(this.selectedValues.length === 0)
  }

  _selectedValuesChanged() {
    if(this.selectedValues.length > 0) {
      this.value = this.selectedValues.map(selected => selected[this.attrForValue]).join(',');
    } else {
      this.value = undefined;
    }
    this.closeCollapse();
  }

  __selectedChanged() {
    this.selectedValues = this.__selected ? [this.__selected] : [];
  }

  /**
   * 删除Tag项，事件处理函数
   */
  _deleteTag(e) {
    let value = e.target.dataArgs;
    const ind = this.selectedValues.findIndex(selected => selected[this.attrForValue] == value);
    this.splice("selectedValues", ind, 1);
  }

  /**
   * @param event
   * @private
   */
  _updatePressed(event) {
    let cursorIndex = event.target.dataset.cursorIndex;
    switch (event.key) {
      case "ArrowLeft":
        cursorIndex = cursorIndex > 0 ? --cursorIndex : -1;
        break;
      case "ArrowRight":
        const max = this.selectedValues.length - 1;
        cursorIndex = cursorIndex < max ? ++cursorIndex : max;
        break;
      case "Backspace":
        if (cursorIndex >= 0) {
          this.splice('selectedValues', cursorIndex, 1);
        }
        cursorIndex = cursorIndex > 0 ? --cursorIndex : -1;
        break;
    }

    const currCursor = this.shadowRoot.querySelector(`#tag-cursor__${cursorIndex}`);
    currCursor && currCursor.focus();
  }

  __focusOnLast() {
    const lastCursor = this.shadowRoot.querySelector(`#tag-cursor__${this.selectedValues.length - 1}`);
    lastCursor && lastCursor.focus();
  }

  _displayPlaceholder(display) {
    this.$.placeholder.hidden = !display;
  }

  /**
   * Open collapse.
   */
  openCollapse() {
    this.$["select-collapse"].setAttribute('data-collapse-open', '');
    this.opened = true;
  }

  /**
   * Close collapse.
   */
  closeCollapse() {
    this.$["select-collapse"].removeAttribute('data-collapse-open');
    this.opened = false;
  }

  /**
   * Toggle collapse.
   */
  toggleCollapse() {
    if (this.$["select-collapse"].hasAttribute('data-collapse-open')) {
      this.$["select-collapse"].removeAttribute('data-collapse-open');
    } else {
      this.$["select-collapse"].setAttribute('data-collapse-open', '');
    }
    this.opened = !this.opened;
    this.__focusOnLast();
  }

  /**
   * Set focus to select.
   */
  doFocus() {
    this.__focusOnLast();
  }

  /**
   * Validate, true if the select is set to be required and this.selectedValues.length > 0, or else false.
   * @returns {boolean}
   */
  validate() {
    return this.required ? (this.selectedValues && this.selectedValues.length > 0) : true;
  }

  connectedCallback() {
    super.connectedCallback();
    console.log(document.documentElement.clientHeight, this.offsetTop, 22 * (items.length), this);
    const flag = this.offsetTop + 22 * (items.length) < document.documentElement.clientHeight / 2;
    flag ? this.$['select-collapse'].style['top'] = '100%' : this.$['select-collapse'].style['bottom'] = '100%';
  }
}

window.customElements.define(H2Select.is, H2Select);
