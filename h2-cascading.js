/*

```html

```
*/

import {html, PolymerElement} from "@polymer/polymer";
import {mixinBehaviors} from "@polymer/polymer/lib/legacy/class";
import '@polymer/iron-icon';
import '@polymer/iron-icons';
import '@polymer/paper-dialog';

import {BaseBehavior} from "./behaviors/base-behavior";
import './behaviors/h2-elements-shared-styles.js';

/**
 * `h2-cascading`
 *
 * @customElement
 * @polymer
 * @demo demo/h2-cascading/index.html
 */
class H2Cascading extends mixinBehaviors([BaseBehavior], PolymerElement) {
  static get template() {
    return html`
    <style include="h2-elements-shared-styles">
      :host {
        font-family: var(--h2-ui-font-family), sans-serif;
        font-size: var(--h2-ui-font-size);
        display: flex;
        height: 34px;
        line-height: 34px;
        min-width: 200px;
      }
      
      .cascading__container {
        flex: 1;
        display: flex;
        align-items: center;
        line-height: inherit;
        min-width: 200px;
        border: 1px solid #ccc;
        border-radius: 4px;
        padding: 2px 5px;
        position: relative;
        cursor: pointer;
      }
      
      :host([readonly]) .cascading__container {
        pointer-events: none;
        opacity: 0.5;
        z-index: 10;
        cursor: no-drop;
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
        color: #999;
        opacity: 1;
        padding: 0 6px;
        overflow: hidden;
        white-space: nowrap;
      }
      
      #targetDialog {
        position: absolute;
        bottom: -5px;
        left: 0;
        width: inherit;
      }
      
      :host([opened]) .caret {
        transform: rotate(180deg);
        transition: transform .2s ease-in-out;
      }
      
      .caret {
        transition: transform .2s ease-in-out;
        color: var(--h2-ui-color_skyblue);
        position: absolute;
        right: 0;
        top: 0;
        height: 34px;
        line-height: 34px;
      }
      
      #boxDialog {
        position: absolute!important;
        margin: 0;
        max-width: initial!important;
      }
      
      .dialog-container {
        margin: 0;
        padding: 0;
        display: flex;
      }
      
      .view-container {
        flex: 1;
        width: 400px;
        min-height: 200px;
        max-height: 300px;
        overflow-y: auto;
        margin: 0;
        padding: 10px;
        box-sizing: border-box;
        background: #fff;
        position: relative;
        top: 36px;
        left: 0;
        box-shadow: 0 0 10px 5px #ccc;
        z-index: 1;
        @apply --h2-view-container;
      }
      
      .view-container:last-of-type {
        border-right: none;
      }
      
      .view-list {
        display: flex;
        justify-content: flex-start;
        max-width: 500px;
        flex-wrap: wrap;
      }
      .view-item {
        position: relative;
        padding: 0 12px;
        height: 30px;
        line-height: 30px;
        background: #eee;
        border-radius: 5px;
        margin-right: 10px;
        margin-bottom: 10px;
        cursor: pointer;
        user-select: none;
      }
      .view-item:hover, .view-item-active {
        color: #fff;
        background: linear-gradient(315deg, #8FCDFF 0%, #2196F3 100%);
      }
      
      :host([required]) .cascading__container::before {
        content: "*";
        color: red;
        position: absolute;
        left: -10px;
        line-height: inherit;
      }
      
      :host([data-invalid]) .cascading__container {
        border-color: var(--h2-ui-color_pink);
      }
      
      .icon-clear {
        position: absolute;
        right: 5px;
        width: 12px;
        height: 12px;
        line-height: 34px;
        border: 1px solid #ccc;
        border-radius: 50%;
        color: #ccc;
        display: none;
      }
      
      .cascading__container:hover .icon-clear {
        display: inline-block;
      }
      .cascading__container:hover .caret {
        display: none;
      }
      
      .header{
        display: flex;
        justify-content: space-around;
        align-items: center;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 36px;
        background: linear-gradient(315deg, #8FCDFF 0%, #2196F3 100%);
        z-index: 2;
      }
      
      .display-none {
        display: none;
      }
      
      .head-item {
        width: 100%;
        height: 36px;
        line-height: 36px;
        text-align: center;
        color: #fff;
        cursor: pointer;
        border-right: 1px solid #fff;
        user-select: none;
      }
      
      .head-item:last-of-type {
        border-right: none;
      }
      
      .head-active {
        background: #fff;
        font-weight: bold;
        color: var(--h2-ui-color_skyblue);
        transition: all ease .1s;
      }
    </style>
    
    <template is="dom-if" if="[[ toBoolean(label) ]]">
      <div class="h2-label">[[label]]</div>
    </template>
    
    <div class="cascading__container" on-click="_onInputClick">
      <div id="placeholder">[[placeholder]]</div>
      <div class="box-value">[[valueLabel]]</div>
      <iron-icon class="caret" icon="icons:expand-more"></iron-icon>
      <iron-icon class="icon-clear" icon=icons:clear on-click="clear"></iron-icon>
      <div id="targetDialog">
      </div>
    </div>
    
    <paper-dialog id="boxDialog" no-overlap horizontal-align="auto" vertical-align="auto" on-iron-overlay-closed="__cancelClick">
      <div class="dialog-container">
        <div class="header">
          <template is="dom-repeat" items="{{headItems}}" as="head" index-as="headIndex">
            <div class$="head-item [[optional(head.active,'head-active','')]]" on-click="__selectByHead">[[head.name]]</div>
          </template>
        </div>
        <template is="dom-repeat" items="{{treeItems}}" as="tree" index-as="treeIndex">
            <div class$="[[__setViewContainerClass(tree)]]">
              <div class="view-list">
                <template is="dom-repeat" items="[[tree]]">
                  <div class$="view-item [[__setViewClass(item.__select)]]" on-click="__viewItemClick">
                    [[getValueByKey(item, attrForLabel)]]
                  </div>
                </template>
              </div>
            </div>
        </template>
      </div>
    </paper-dialog>
`;
  }

  static get properties() {
    return {
      label: {
        type: String
      },
      placeholder: {
        type: String,
        value: '请选择'
      },
      opened: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      items: {
        type: Array,
        observer: '__itemsChanged',
        value: []
      },
      treeItems: {
        type: Array,
        notify: true,
        observer: '__treeItemsChanged',
        value: []
      },
      value: {
        type: Array,
        notify: true,
        value: [],
        observer: '__valueChanged'
      },
      selectedValues: {
        type: Array,
        notify: true,
        value: []
      },
      valueLabel: {
        type: String,
        notify: true
      },
      lazy: Boolean,
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
      },
      separator: {
        type: String,
        value: '/'
      },
      required: {
        type: Boolean,
        value: false
      },
      readonly: {
        type: Boolean,
        value: false
      },
      headItems: Array,
      currentHeadLevel: {
        type: Number,
        value: 1,
        observer: '__currentHeadLevelChanged'
      }
    };
  }

  __itemsChanged() {
    if (this.items.length) this.set('treeItems', [this.items]);
  }

  __valueChanged(value) {
    !this.validate() ? this.setAttribute("data-invalid", "") : this.removeAttribute("data-invalid");
    if (this.treeItems && this.treeItems.length && !this.lazy && value) {
      let treeItems = [].concat(this.treeItems), selectedValues = [];
      value.forEach((item, index) => {
        const findIndex = treeItems[index].findIndex(itm => itm[this.attrForValue] === item);
        treeItems[index][findIndex].__select = true;
        selectedValues.push(treeItems[index][findIndex]);
        if (treeItems[index][findIndex].children) treeItems.push(treeItems[index][findIndex].children);
      });
      this.set('selectedValues', selectedValues);
      this.set('valueLabel', selectedValues.map(itm => itm[this.attrForLabel]).join(this.separator));
      this.set('treeItems', treeItems);
      this.$.placeholder.hidden = this.valueLabel;
    }
  }

  __treeItemsChanged(treeItems) {
    if (treeItems && treeItems.length && this.lazy && this.value) {
      let selectedValues = [];
      this.value.forEach((item, index) => {
        const findIndex = treeItems[index].findIndex(itm => itm[this.attrForValue] === item);
        if (treeItems[index] && treeItems[index].length && findIndex >= 0) {
          treeItems[index][findIndex].__select = true;
          selectedValues.push(treeItems[index][findIndex]);
        }
      });
      this.set('selectedValues', selectedValues);
      this.set('valueLabel', selectedValues.map(itm => itm[this.attrForLabel]).join(this.separator));
      this.set('treeItems', treeItems);
      if (treeItems[0].length) this.set('currentHeadLevel', treeItems[treeItems.length - 1][0].level);
      this.$.placeholder.hidden = this.valueLabel;
    }
  }

  __setViewClass(select) {
    return select ? 'view-item-active' : ''
  }

  _onInputClick() {
    this.opened = !this.opened;
    this.$.boxDialog.positionTarget = this.$.targetDialog;
    this.opened ? this.$.boxDialog.open() : this.$.boxDialog.close();
  }

  __cancelClick() {
    this.opened = !this.opened;
  }

  __viewItemClick({model}) {
    const {index, item, parentModel} = model;
    let treeItems = this.treeItems.slice(0, parentModel.treeIndex + 1);
    const treeItem = parentModel.tree.map((itm, idx) => Object.assign({}, itm, {__select: idx === index}));
    treeItems[parentModel.treeIndex] = treeItem;
    if (item.children) {
      parentModel.treeIndex + 1 >= this.treeItems.length ? treeItems.push(item.children) : treeItems.splice(parentModel.treeIndex + 1, 1, item.children);
    }
    let selectedValues = this.selectedValues.slice(0, parentModel.treeIndex + 1);
    selectedValues[parentModel.treeIndex] = item;
    this.set('selectedValues', selectedValues);
    if (!item.children) {
      this.set('valueLabel', selectedValues.map(itm => itm[this.attrForLabel]).join(this.separator));
      this.set('value', selectedValues.map(itm => itm[this.attrForValue]));
    }
    this.set('treeItems', treeItems);
    this.$.placeholder.hidden = this.valueLabel;
  }

  close() {
    this.$.boxDialog.close()
  }

  clear(e) {
    e.stopPropagation();
    this.set('value', []);
    this.set('valueLabel', null);
  }

  __setViewContainerClass(item) {
    if (item.length) {
      if (this.currentHeadLevel == item[0].level) {
        return 'view-container'
      } else {
        return 'display-none';
      }
    }
  }

  __selectByHead({model: {head}}) {
    if (!this.treeItems.find(fi => fi[0].level == head.level)) return;
    this.set('currentHeadLevel', head.level);
  }

  __currentHeadLevelChanged(){
    this.refreshStyle();
  }

  refreshStyle() {
    this.headItems.forEach((fi, index) => {
      this.set(`headItems.${index}.active`, true);
      if (fi.level != this.currentHeadLevel) this.set(`headItems.${index}.active`, false);
    });

    const cacheItems = this.treeItems;
    this.set('treeItems', []);
    cacheItems.forEach(fi => {
      let arr = [];
      fi.forEach(ffi => arr.push(ffi));
      this.push('treeItems', arr);
    });
  }

  /**
   * Validate, true if the select is set to be required and this.selectedValues.length > 0, or else false.
   * @returns {boolean}
   */
  validate() {
    return this.required ? this.value && this.value.length : true;
  }

  static get is() {
    return "h2-cascading";
  }
}

window.customElements.define(H2Cascading.is, H2Cascading);
