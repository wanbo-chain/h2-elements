import {html, PolymerElement} from "@polymer/polymer";
import {BaseBehavior} from "./behaviors/base-behavior";
import {mixinBehaviors} from "@polymer/polymer/lib/legacy/class";
import '@polymer/iron-selector/iron-selector';
import './behaviors/h2-elements-shared-styles.js';

class H2TreeNode extends mixinBehaviors([BaseBehavior], PolymerElement) {
  static get template() {
    return html`
    <style include="h2-elements-shared-styles">
      :host {
        font-family: var(--h2-ui-font-family), sans-serif;
        font-size: var(--h2-ui-font-size);
      }

      li{
        list-style: none;
      }
      
      #children{
        display: none;
      }
      
      #children.active{
        display: block;
        border-left: 2px solid var(--h2-ui-color_purple);
        margin-left: -18px;
      }
      
      .nav-item{
        color: var(--h2-ui-color_skyblue);
        display: flex;
        align-items: center;
        position:relative;
      }
      
      .nav-item.active{
        color: var(--h2-ui-color_purple);
      }
      
      .nav-item:before{
        content: "";
        width: 4px;
        height: 4px;
        top: 8px;
        left: -18px;
        display: block;
        position: absolute;
        background: #C6CAD3;
      }
      
      .children-toggle{
        width: 20px;
        height: 20px;
        background: #C6CAD3;
        border-radius: 50%;
        position:absolute;
        top: 0;
        left: -26px;
        cursor: pointer;
      }
      
      .children-toggle:hover{
        background: var(--h2-ui-color_purple);
      }
      
      .children-toggle:before,.children-toggle:after{
        content: "";
        position: absolute;
        display: block;
        background: #fff;
        transition: all .3s;
      }
      
      .children-toggle:before{
        top: 4px;
        left: 9px;
        height: 12px;
        width: 2px;
      }
      
      .children-toggle:after{
        top: 9px;
        left: 4px;
        height: 2px;
        width: 12px;
      }
      
      .children-toggle.active{
        background: var(--h2-ui-color_purple);
      }
      
      .children-toggle.active:before{
        transform: rotate(90deg);  
      }
      
      .children-toggle.active:after{
        transform: rotate(180deg);  
      }
      
      .title:hover{
        color: var(--h2-ui-color_purple);
      }
      
      .no-children-title{
        color: #756A85;
      }
      
      .no-children-title:hover{
        color: var(--h2-ui-color_purple);
      }
      
      .checkbox{
        width: 16px;
        height: 16px;
        margin-right: 6px;
        cursor: pointer;
        background: #fff;
        border: 2px solid #000;
      }
      
      .checked,.partial-checked{
        background: var(--h2-ui-color_skyblue);
        border: 2px solid var(--h2-ui-color_skyblue);
      }
      
      .checked:before{
        content: "";
        border: 2px solid #fff;
        border-left: 0;
        border-top: 0;
        height: 10px;
        left: 7px;
        position: absolute;
        transform: rotate(45deg);
        width: 4px;
      }
      
      .partial-checked:before{
        content: "";
        position: absolute;
        display: block;
        width: 10px;
        background-color: #fff;
        height: 2px;
        left: 5px;
        top: 9px;
      }
      
      /*禁用勾选*/
      .disabled{
        border: 2px solid var(--h2-ui-color_pink);
        border-radius: 50%;
        pointer-events: none;
      }
      
      .disabled:before{
        content: "";
        position: absolute;
        display: block;
        width: 20px;
        background-color: var(--h2-ui-color_pink);
        height: 2px;
        left: 0px;
        top: 9px;
        transform: rotate(45deg);
      }
      /*隐藏*/
      .display-none{
        display: none;
      }

    </style>
    <ul>
      <li id="navItem" class="nav-item">
        <div id="childrenToggle" class$="[[getToggleClass(item)]]" on-click="onToggle"></div>
        <div id="checkbox" class$="checkbox [[optional(showCheckBox,'','display-none')]] [[optional(item.disabled,'disabled','')]]" on-click="onCheck"></div>
        <div class$="[[getTextClass(item)]]">[[getValueByKey(item, attrForLabel)]]</div>
      </li>
      <li id="children">
        <template is="dom-repeat" items="[[item.children]]" as="itm">
          <h2-tree-node accordion="{{accordion}}" on-tree-node-toggle="onTreeNodeToggle" keyword="{{keyword}}" default-open="[[defaultOpen]]" show-check-box="[[showCheckBox]]" attr-for-label="[[attrForLabel]]" item="[[itm]]" on-tree-node-selected="onTreeNodeSelected" node-selected-item="{{nodeSelectedItem}}"></h2-tree-node>
        </template>
      </li>
    </ul>
`;
  }

  static get properties() {
    return {
      /**
       * The tree node data.
       * @type {Array}
       */
      item: Object,
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
       * Attribute name for label.
       * @type {object}
       * @default 'label'
       */
      attrForLabel: {
        type: String,
        value: "label"
      },
      /**
       * The selected item.
       * @type {object}
       */
      nodeSelectedItem: {
        type: Object,
        notify: true
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
       * The keyword for filter.
       * @type {String}
       */
      keyword: {
        type: String,
        observer: 'onKeywordChanged'
      },
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
    return "h2-tree-node";
  }

  static get observers() {
    return [
      'onItemCheckedChange(item.checked)',
      'onItemOpenedChange(item.opened)',
      'onDefaultOpenChange(defaultOpen)'
    ];
  }

  onToggle() {
    this.set('item.opened', !this.item.opened);
    this.dispatchEvent(new CustomEvent('tree-node-toggle'));
  }

  onCheck() {
    this.set('item.checked', this.item.checked === 'uncheck' ? 'checked' : 'uncheck');
  }

  getTextClass(item) {
    return !item.children ? 'no-children-title' : 'title';
  }

  getToggleClass(item) {
    return item.children ? 'children-toggle' : 'display-none';
  }

  onItemCheckedChange(value) {
    this.nodeSelectedItem = Object.assign({}, this.item);
    if (value === 'checked' && !this.item.disabled) {
      this.$.checkbox.classList.add('checked');
      this.$.checkbox.classList.remove('partial-checked');
    } else if (value === 'partialChecked' && !this.item.disabled) {
      this.$.checkbox.classList.add('partial-checked');
      this.$.checkbox.classList.remove('checked');
    } else if (value === 'uncheck' && !this.item.disabled) {
      this.$.checkbox.classList.remove('checked', 'partial-checked');
    }
    // 若有children，改children的checked
    if (this.item.children && value !== 'partialChecked') {
      this.set('item.children', this.item.children.map(mi => {
        if (!mi.disabled) mi.checked = value;
        return Object.assign({}, mi);
      }))
    }
    // 抛出事件给父级监听
    this.dispatchEvent(new CustomEvent('tree-node-selected', {
      detail: {value}
    }));
  }

  onItemOpenedChange(value) {
    if (value) {
      this.$.children.classList.add('active');
      this.$.navItem.classList.add('active');
      this.$.childrenToggle.classList.add('active');
    } else {
      this.$.children.classList.remove('active');
      this.$.navItem.classList.remove('active');
      this.$.childrenToggle.classList.remove('active');
    }
  }

  onDefaultOpenChange(value) {
    if (value) {
      this.item.opened = true;
    }
  }

  onTreeNodeSelected() {
    if (this.item.children.every(item => item.checked === 'checked')) {
      this.set('item.checked', 'checked');
    } else if (this.item.children.every(item => item.checked === 'uncheck')) {
      this.set('item.checked', 'uncheck');
    } else {
      this.set('item.checked', 'partialChecked');
    }
  }

  onKeywordChanged(value) {
    this.$.navItem.classList.remove('display-none');
    this.filterByKeyword(value);
  }

  filterByKeyword(value) {
    if (this.item[this.attrForLabel].includes(value)) {
      return;
    } else if (!this.item[this.attrForLabel].includes(value)) {
      if (this.item.children && this.item.children.length) {
        if (this.item.children.some(item => item[this.attrForLabel].includes(value))) {
          return;
        } else {
          this.$.navItem.classList.add('display-none');
        }
      } else if (!this.item.children) {
        this.$.navItem.classList.add('display-none');
      }
    }
  }

  onTreeNodeToggle({model: {itm}}) {
    if (this.accordion && itm.opened) {
      this.set('item.children', this.item.children.map(mi => {
        if (mi[this.attrForLabel] !== itm[this.attrForLabel]) {
          mi.opened = false;
        }
        return Object.assign({}, mi);
      }))
    }
  }

}

window.customElements.define(H2TreeNode.is, H2TreeNode);
