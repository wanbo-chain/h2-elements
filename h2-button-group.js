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
        position: relative;
        /*font: inherit;*/
        display: inline-block;
        min-width: 80px;
        outline: none;
        font-family: var(--h2-ui-font-family), sans-serif;
        font-size: var(--h2-ui-font-szie);
      }

      .trigger {
        width: 100%;
        height: 100%;
        -moz-border-radius: 4px;
        -webkit-border-radius: 4px;
        border-radius: 4px;
        display: flex;
        padding: 0;
        @apply --h2-button-group-button;
      }

      .trigger__label {
        flex: 1;
      }
      
      /*下拉列表*/
      :host .dropdown-menu {
        position: absolute;
        display: flex;
        background: #fff;
        color: #fff;
        flex-flow: column nowrap;
        box-sizing: border-box;
        top: 100%;
        left: 0;
        z-index: 99;
        width: 100%;
        margin-top: 1px;
        list-style: none;
        font-size: 1em;
        text-align: center;
        -moz-border-radius: 4px;
        -webkit-border-radius: 4px;
        border-radius: 4px;
        background-clip: padding-box;

        @apply --h2-button-group-dropdown;
      }

      .item, ::slotted(*) {
        background: var(--h2-ui-bg);
        cursor: pointer;
        line-height: 30px;
        white-space: nowrap;
        font-size: 0.9em;
        text-align: center;
        border: none;
        outline: none;
        border-bottom: 1px solid #fff;
        margin-top: 1px;
      }
      .item:first-of-type {
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
      }
      .item:last-of-type {
        border-bottom: none;
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
      }
      
      /*hover*/
      .item:hover {
        opacity: 0.8;
      }
      
      .trigger__icon {
        transition: transform .2s ease-in-out
      }
      
      :host([opened]) .trigger__icon {
        transform: rotate(180deg);
        transition: transform .2s ease-in-out
      }
      
    </style>

    <h2-button class="trigger" on-tap="toggle">
      <div class="trigger__label">[[ label ]]</div>
        <iron-icon class="trigger__icon" icon="icons:expand-more"></iron-icon>
    </h2-button>

    <iron-collapse id="collapse" class="dropdown-menu" opened="[[ opened ]]" on-click="_onButtonDropdownClick">
      <template is="dom-repeat" items="[[ items ]]">
        <div class="item" bind-item="[[ item ]]">[[ getValueByKey(item, attrForLabel, 'Unknown') ]]</div>
      </template>
      <slot></slot>
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
    this.addEventListener('blur', e => {
      // make sure other event can happen on slotted element before the iron-collapse closed.
      setTimeout(this.close.bind(this), 100);
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
  toggle() {
    this.opened = !this.opened;
  }
  
  _onButtonDropdownClick(e) {
    const target = e.target,
      bindItem = e.target.bindItem || e.target.getAttribute('bind-item');
    this.onItemClick && this.onItemClick({target, bindItem});
  }
}

window.customElements.define(H2ButtonGroup.is, H2ButtonGroup);
