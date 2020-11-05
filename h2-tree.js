import {html, PolymerElement} from "@polymer/polymer";
import {BaseBehavior} from "./behaviors/base-behavior";
import {mixinBehaviors} from "@polymer/polymer/lib/legacy/class";
import '@polymer/iron-selector/iron-selector';
import './behaviors/h2-elements-shared-styles.js';
import './h2-tree-node'
import './h2-input'

/**
 * @customElement
 * @polymer
 * @demo demo/h2-tree/index.html
 */
class H2Tree extends mixinBehaviors([BaseBehavior], PolymerElement) {
  static get template() {
    return html`
    <style include="h2-elements-shared-styles">
      h2-input{
        margin: 10px 0;
      }

    </style>
    <template is="dom-if" if="[[showFilter]]">
      <h2-input placeholder="输入关键字进行过滤" value="{{keyword}}"></h2-input>
    </template>
    <template is="dom-repeat" items="[[items]]">
        <h2-tree-node accordion="{{accordion}}" on-tree-node-toggle="onTreeNodeToggle" keyword="{{keyword}}" default-open="[[defaultOpen]]" show-check-box="[[showCheckBox]]" item="[[item]]" node-selected-item="{{nodeSelectedItem}}" attr-for-label="[[attrForLabel]]"></h2-tree-node>
    </template>
`;
  }

  static get properties() {
    return {
      /**
       * The tree data.
       * @type {Array}
       */
      items: {
        type: Array,
        value: []
      },
      /**
       * Show checkbox or not.
       * @type {Boolean}
       * @default false
       */
      showCheckBox: {
        type: Boolean,
        value: false
      },
      /**
       * The Selected tree node items.
       * @type {Array}
       */
      nodeSelectedItem: Array,
      /**
       * The Selected item.
       * @type {Array}
       */
      selectedItem: {
        type: Array,
        value: [],
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
       * The Selected value.
       * @type {Array}
       */
      value: {
        type: Array,
        notify: true
      },
      /**
       * Attribute name for label.
       * @type {String}
       * @default 'label'
       */
      attrForLabel: {
        type: String,
        value: "label"
      },
      /**
       * Is selected item include parent's partial checked node or not.
       * @type {Boolean}
       * @default false
       */
      includePartialChecked: {
        type: Boolean,
        value: false
      },
      /**
       * The default opened.
       * @type {Boolean}
       * @default false
       */
      defaultOpen: {
        type: Boolean,
        value: false
      },
      /**
       * Is show filter input or not.
       * @type {Boolean}
       * @default false
       */
      showFilter: {
        type: Boolean,
        value: false
      },
      /**
       * The keyword for filter.
       * @type {String}
       */
      keyword: String,
      /**
       * For nodes of the same level, you can only expand one at a time.
       * @type {Boolean}
       * @default false
       */
      accordion: {
        type: Boolean,
        value: false
      }
    };
  }

  static get is() {
    return "h2-tree";
  }

  static get observers() {
    return [
      'onNodeSelectedItemChanged(nodeSelectedItem)'
    ];
  }

  onNodeSelectedItemChanged(item) {
    if (this.includePartialChecked) {
      if (item.checked === 'checked' || item.checked === 'partialChecked') {
        this.selectedItem.push(item);
      } else {
        const index = this.selectedItem.findIndex(fi => fi.value === item.value);
        if (index != -1) {
          this.selectedItem.splice(index, 1);
        }
      }
    } else {
      if (item.checked === 'checked') {
        this.selectedItem.push(item);
      } else {
        const index = this.selectedItem.findIndex(fi => fi.value === item.value);
        if (index != -1) {
          this.selectedItem.splice(index, 1);
        }
      }
    }

    this.selectedItem = this.duplicate(this.selectedItem);
    this.value = this.selectedItem.map(mi => mi[this.attrForValue]);
  }

  //selectedItem去重
  duplicate(arr) {
    if (arr.length == 0) {
      return [];
    } else {
      let obj = {}
      let newArr = arr.reduce((cur, next) => {
        obj[next[this.attrForValue]] ? "" : obj[next[this.attrForValue]] = true && cur.push(next);
        return cur;
      }, [])
      return newArr;
    }
  }

  onTreeNodeToggle({model: {item}}) {
    if (this.accordion && item.opened) {
      this.set('items', this.items.map(mi => {
        if (mi[this.attrForLabel] !== item[this.attrForLabel]) {
          mi.opened = false;
        }
        return Object.assign({}, mi);
      }))
    }
  }

}

window.customElements.define(H2Tree.is, H2Tree);
