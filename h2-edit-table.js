/*

```html

```
*/

import {html, PolymerElement} from "@polymer/polymer";
import {mixinBehaviors} from "@polymer/polymer/lib/legacy/class";
import * as Gestures from '@polymer/polymer/lib/utils/gestures.js';
import {BaseBehavior} from "./behaviors/base-behavior";
import './behaviors/h2-elements-shared-styles.js';
import './h2-input';
import './h2-button';

/**
 * `h2-table`
 *
 * @customElement
 * @polymer
 * @demo demo/h2-table/index.html
 */
class H2EditTable extends mixinBehaviors([BaseBehavior], PolymerElement) {
  static get template() {
    return html`
    <style include="h2-elements-shared-styles">
      :host {
        font-family: var(--h2-ui-font-family), sans-serif;
        font-size: var(--h2-ui-font-size);
        display: block;
      }
      
      .h2-edit-table {
        overflow-x: auto;
      }
      
      .h2-edit-table td, .h2-edit-table th {
        padding: 10px;
        margin: 0;
        box-sizing: border-box;
        text-overflow: ellipsis;
        vertical-align: middle;
        text-align: left;
        border-bottom: 1px solid #ebeef5;
        line-height: 25px;
      }
      
       .h2-edit-table__head, .h2-edit-table__body {
        width: 100%;
      }
      
      .h2-edit-table__head {
        color: #909399;
        font-weight: 500;
        table-layout: fixed;
      }
      
      .h2-edit-table__head th {
        white-space: nowrap;
        overflow: hidden;
        user-select: none;
      }
      
      .h2-edit-table__body {
        color: #606266;
        table-layout: fixed;
        border-collapse: separate;
      }
      
      th div.header__cell {
        display: flex;
        align-items: center;
      }
      
      .h2-td-input {
        width: 100%;
        height: 100%;
      }
      
    </style>
    
     
    <!--<slot id="columnSlot"></slot>-->
    <div class="h2-edit-table">
      <div class="h2-edit-table__header__container">
        <table class="h2-edit-table__head" cellpadding="0" cellspacing="0" border="0">
          <colgroup>
            <template is="dom-repeat" items="[[columnInfos]]">
              <col width="[[item.width]]">
            </template>
          </colgroup>
          <thead>
            <tr>
              <template is="dom-repeat" items="[[columnInfos]]">
                <th>
                  <div class="header__cell">
                  <div class="table__cell">[[item.label]]</div>
                </th>
              </template>
            </tr>
          </thead>
        </table>
      <div class="h2-edit-table__body__container">
        <table id="tableBody" class="h2-edit-table__body" cellpadding="0" cellspacing="0" border="0">
          <colgroup>
            <template is="dom-repeat" items="[[columnInfos]]">
              <col width="[[item.width]]">
            </template>
          </colgroup>
          <tbody>
          <template is="dom-repeat" items="{{data}}" as="row" index-as="rowIndex">
            <tr>
              <template is="dom-repeat" items="[[columnInfos]]" as="column" index-as="columnIndex">
                <td id="row_[[rowIndex]]_column_[[columnIndex]]">
                  <template is="dom-if" if="[[ isOneOf(column.type, 'view', 'operate') ]]">
                    [[ computeContent(row, rowIndex, column, columnIndex) ]]
                  </template>
                  <template is="dom-if" if="[[ isEqual(column.type, 'input') ]]">
                    <h2-input class="h2-td-input" value="{{ computeContent(row, rowIndex, column) }}" on-value-changed="valueChanged"></h2-input>
                  </template>
                  <template is="dom-if" if="[[ isEqual(column.type, 'delete') ]]">
                    <h2-button on-click="delete">删除</h2-button>
                  </template>
                  <template is="dom-if" if="[[ isEqual(column.type, 'add') ]]">
                    <h2-button on-click="add">新增</h2-button>
                  </template>
                  <template is="dom-if" if="[[ isEqual(column.type, 'deleteAndAdd') ]]">
                    <h2-button on-click="delete">删除</h2-button>
                    <h2-button on-click="add">新增</h2-button>
                  </template>
                </td>
              </template>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
`;
  }

  connectedCallback() {
    super.connectedCallback();
    const columnInfos = [...this.children];
    this.set('columnInfos', columnInfos);
  }

  delete({model: {rowIndex}}) {
    this.splice('data', rowIndex, 1);
  }

  add({model: {rowIndex}}) {
    this.splice('data', rowIndex + 1, 0, {})
  }
  
  __appendTmplContent(targetSelector, model, rowIndex,  columnTag) {
    const parent = this.shadowRoot.querySelector(targetSelector);
    const {root} = columnTag.stampTemplate(model) || {};
    if (root) {
      parent.innerHTML = '';
      parent.appendChild(root);
    }
  }
  
  computeContent(row, rowIndex, column, columnIndex) {
    if (column.tmpl && column.type === 'operate') {
      
      setTimeout(() => {
        this.__appendTmplContent(`#row_${rowIndex}_column_${columnIndex}`, row, rowIndex, column);
      }, 0, this);
      
      return null;
    }
    
    if(column.props) {
      return column.props.split(",").map(p => this.getValueByKey(row, p.trim())).join(column.separator || ',');
    }
    
    return this.getValueByKey(row, column.prop);
  }

  static get properties() {
    return {
      data: {
        type: Array,
        value: []
      },
      columnInfos: {
        type: Array
      }
    };
  }

  static get is() {
    return "h2-edit-table";
  }
}

window.customElements.define(H2EditTable.is, H2EditTable);
