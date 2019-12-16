/*

`h2-button-group`

Example:
```html
<h2-button-group label="测试">
  <div bind-item="1">测试1</div>
  <div bind-item="2">测试2</div>
  <div bind-item="3">测试3</div>
</h2-button-group>


<h2-button-group items="[[ items ]]" label="测试" attr-for-label="label"></h2-button-group>

items = [
    {label: "测试1", value: "1"},
    {label: "测试2", value: "2"},
    {label: "测试3", value: "3"}
]

```

## Styling

The following custom properties and mixins are available for styling:

|Custom property | Description | Default|
|----------------|-------------|----------|
|`--h2-button-group-button` | Mixin applied to the group button | {}
|`--h2-button-group-dropdown` | Mixin applied to the group dropdown | {}

*/
import {mixinBehaviors} from "@polymer/polymer/lib/legacy/class";
import {BaseBehavior} from "./behaviors/base-behavior";
import {html, PolymerElement} from "@polymer/polymer";
import '@polymer/iron-collapse';
import './behaviors/h2-elements-shared-styles';
import './h2-button';

/**
 * @customElement
 * @polymer
 * @demo demo/h2-button-group/index.html
 */
class H2ButtonGroup extends mixinBehaviors([BaseBehavior], PolymerElement) {
  static get template() {
    return html`
    <style include="h2-elements-shared-styles">
      :host {
        display: inline-block;
        min-width: 70px;
        outline: none;
        font-family: var(--h2-ui-font-family), sans-serif;
        font-size: var(--h2-ui-font-size);
      }

      /*.box {*/
        /*!*position: relative;*!*/
        /*!*width: 100%;*!*/
        /*!*height: 100%;*!*/
      /*}*/
      
      .trigger {
        width: 100%;
        height: 100%;
        display: flex;
        border-radius: var(--h2-ui-border-radius);
        @apply --h2-button-group-button;
      }
      
      .trigger:hover {
      
      }

      .trigger__label {
        flex: 1;
      }
      
      /*下拉列表*/
      :host .dropdown-menu {
        position: fixed;
        background: #fff;
        color: var(--h2-ui-color_skyblue);
        flex-flow: column nowrap;
        box-sizing: border-box;
        z-index: 999;
        /*width: 100%;*/
        /*margin-top: 2px;*/
        font-size: 1em;
        text-align: center;
        background-clip: padding-box;
        --iron-collapse-transition-duration: 200ms;
        overflow: auto;
        @apply --h2-button-group-dropdown;
      }
      
      .dropdown-menu::-webkit-scrollbar {
        display: none;
      }
      
      .container {
        border-radius: var(--h2-ui-border-radius);
        border: 1px solid var(--h2-ui-color_skyblue);
      }

      .item, ::slotted(*) {
        cursor: pointer;
        line-height: 30px;
        white-space: nowrap;
        font-size: 0.9em;
        text-align: center;
        outline: none;
      }
      
      /*hover*/
      .item:hover, ::slotted(*:hover) {
        color: #fff;
        background: var(--h2-ui-bg);
      }
      
      .trigger__icon {
        transition: transform .2s ease-in-out
      }
      
      :host([opened]) .trigger__icon {
        transform: rotate(180deg);
        transition: transform .2s ease-in-out
      }
      
    </style>
    
    <h2-button class="trigger" on-mouseover="toggle" on-mouseout="close">
      <div class="trigger__label">[[ label ]]</div>
      <iron-icon class="trigger__icon" icon="icons:expand-more"></iron-icon>
    </h2-button>

    <iron-collapse id="collapse" on-mouseover="toggle" on-mouseout="close" class="dropdown-menu" opened="[[ opened ]]" on-click="_onButtonDropdownClick">
      <div class="container">
       <template is="dom-repeat" items="[[ items ]]">
         <div class="item" bind-item="[[ item ]]">[[ getValueByKey(item, attrForLabel, 'Unknown') ]]</div>
       </template>
       <slot id="itemSlot"></slot>
      </div>
    </iron-collapse>
`;
  }
  
  static get properties() {
    return {
      /**
       * Label of the action group.
       */
      label: {
        type: String
      },
      /**
       * Return true if the action group is expanded.
       * @type {boolean}
       * @default false
       */
      opened: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      
      /**
       * The dropdown items.
       * @type Array
       */
      items: {
        type: Array
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
       * The Function called when user click on every item on dropdownlist.
       */
      onItemClick: {
        type: Object
      }
    };
  }
  
  static get is() {
    return "h2-button-group";
  }
  
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('scroll', e => {
      this.close();
    });
  }
  
  /**
   * Expand the group.
   */
  open() {
    this.opened = true;
  }
  
  /**
   * Collpase the group.
   */
  close() {
    this.opened = false;
  }
  
  /**
   * Toggle the group.
   */
  toggle(e) {
    const {top, left} = this.getElemPos(this);
    const collapseHeight = (this.items || []).length * 30 + 2;
    const totalHeight = top + collapseHeight;
    let _top;
    if(totalHeight > document.documentElement.clientHeight) {
      _top = top - collapseHeight - 4;
    } else {
      _top = top + this.clientHeight;
    }
    this.$.collapse.style.top = _top + 'px';
    this.$.collapse.style.left = left + 'px';
    this.$.collapse.style.width = this.clientWidth + 'px';
    this.opened = !this.opened;
  }
  
  getElemPos(obj) {
    const {x, y} = obj.getBoundingClientRect();
    return {top: y + 2, left: x};
  }
  
  _onButtonDropdownClick(e) {
    const target = e.target,
      bindItem = e.target.bindItem || e.target.getAttribute('bind-item');
    this.dispatchEvent(new CustomEvent('item-click', {detail: {target, bindItem}}));
  }
}

window.customElements.define(H2ButtonGroup.is, H2ButtonGroup);
