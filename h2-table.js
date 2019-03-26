/*

```html

```
*/

import './h2-pagination.js';
import {html, PolymerElement} from "@polymer/polymer";
import './h2-table-column'
import {mixinBehaviors} from "@polymer/polymer/lib/legacy/class";
import {BaseBehavior} from "./behaviors/base-behavior";
import '@polymer/iron-icon';
import '@polymer/iron-icons';

/**
 * `h2-table`
 *
 * @customElement
 * @polymer
 * @demo demo/h2-table/index.html
 */
class H2Table extends mixinBehaviors([BaseBehavior], PolymerElement) {
  static get template() {
    return html`
    <style>
      :host {
      
      }
      
      .h2-table td, .h2-table th {
        padding: 12px 0;
        min-width: 0;
        box-sizing: border-box;
        text-overflow: ellipsis;
        vertical-align: middle;
        position: relative;
        text-align: left;
        border-bottom: 1px solid #ebeef5;
      }
      
      .table__head {
        color: #909399;
        font-weight: 500;
        table-layout: fixed;
      }
      
      .table__head th {
        white-space: nowrap;
        overflow: hidden;
        user-select: none;
        background-color: #fff;
      }
      
      .table__body {
        table-layout: fixed;
        border-collapse: separate;
      }
      
      .table__row:hover {
        background: #ecf5ff;
      }
      
      .table__cell {
        box-sizing: border-box;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: normal;
        word-break: break-all;
        line-height: 23px;
        padding-left: 10px;
        padding-right: 10px;
      }
      
      .expand-icon {
        cursor:pointer;
        color: grey;
        transition: transform .2s ease-in-out
      }
      
      .row__expansion-col {
        padding: 20px 50px !important;
        color: #99a9bf;
      }
      
      .expand-icon_opened {
        transform: rotate(90deg);
        transition: transform .2s ease-in-out
      }
      
      .row__expansion {
      }
      
      .row__expansion-hidden {
        visibility: collapse;
      }
      
    </style>
    <slot id="columnSlot"></slot>
    
    <div class="h2-table">
      <table class="table__head" cellpadding="0" cellspacing="0" border="0">
        <colgroup>
          <template is="dom-repeat" items="[[columnInfos]]">
              <template is="dom-if" if="[[ isEqual(item.type, 'expand') ]]">
                 <col width="48">
              </template>
              <col width="[[item.width]]">
          </template>
        </colgroup>
        <thead>
          <tr>
            <template is="dom-repeat" items="[[columnInfos]]">
              <template is="dom-if" if="[[ isEqual(item.type, 'expand') ]]">
                 <th></th>
              </template>
                <th>
                  <div class="table__cell">[[item.label]]</div>
                </th>
            </template>
          </tr>
        </thead>
      </table>
      
      <table id="tableBody" class="table__body" cellpadding="0" cellspacing="0" border="0">
        <colgroup>
          <template is="dom-repeat" items="[[columnInfos]]">
          <template is="dom-if" if="[[ isEqual(item.type, 'expand') ]]">
             <col width="48">
          </template>
             <col width="[[item.width]]">
          </template>
        </colgroup>
        <tbody>
          <template is="dom-repeat" items="[[data]]" as="row" index-as="rowIndex">
            <tr class="table__row">
              <template is="dom-repeat" items="[[columnInfos]]" index-as="columnIndex">
                <template is="dom-if" if="[[ isEqual(item.type, 'expand') ]]">
                  <td><iron-icon class="expand-icon" icon="icons:chevron-right" item="[[item]]" onclick="[[ __openExpanderHandler(rowIndex) ]]"></iron-icon></td>
                </template>
                <td class="table__column" id="row_[[rowIndex]]_column_[[columnIndex]]">
                    [[ computeContent(row, rowIndex, item, columnIndex) ]]
                </td>
              </template>
            </tr>
            <template is="dom-if" if="[[ isEqual(columnInfos.0.type, 'expand') ]]">
              <tr class="row__expansion row__expansion-hidden">
                <td id="row_[[rowIndex]]" class="row__expansion-col" colspan$="[[ colspan ]]">
                  [[ computeExpansion(row, rowIndex) ]]
                </td>
              </tr>
            </template>
          </template>
        </tbody>
      </table>
    </div>
`;
  }
  
  __computeExpansionColspan({length} = []) {
    return length + 1;
  }
  
  __openExpanderHandler(rowIndex) {
    return ({target: icon}) => {
      if(icon.classList.contains('expand-icon_opened')) {
        icon.classList.remove('expand-icon_opened');
      } else {
        icon.classList.add('expand-icon_opened');
      }
      const expansion = this.shadowRoot.querySelector(`#row_${rowIndex}`).parentElement;
  
      if (expansion.classList.contains('row__expansion-hidden')) {
        expansion.classList.remove('row__expansion-hidden');
      } else {
        expansion.classList.add('row__expansion-hidden');
      }
      
    };
  }
  
  __appendTmplContent(targetSelector, model, columnTag) {
    const parent = this.shadowRoot.querySelector(targetSelector);
    const {root} = columnTag.stampTemplate(model) || {};
    if (root) parent.appendChild(root);
  }
  
  computeExpansion(row, rowIndex) {
    const [column] = this.columnInfos || [];
    if (column && column.type === 'expand') {
      setTimeout(() => {
        this.__appendTmplContent(`#row_${rowIndex}`, row, column);
      }, 0, this);
    }
  }
  
  computeContent(row, rowIndex, column, columnIndex) {
    if (column.tmpl) {
      if(column.type === 'operate') {
        
        setTimeout(() => {
          this.__appendTmplContent(`#row_${rowIndex}_column_${columnIndex}`, row, column);
        }, 0, this);
  
        return null;
      }
    }
    return this.getValueByKey(row, column.prop);
  }
  
  static get properties() {
    return {
      data: {
        type: Array
      },
      
      sort: {
        type: Function,
        observer: '__sortChanged'
      },
      
      colspan: {
        type: Number,
        computed: '__computeExpansionColspan(columnInfos)'
      },
      /**
       * A function that can be used to filter items out of the view.  This
       * property should either be provided as a string, indicating a method
       * name on the element's host, or else be an actual function.  The
       * function should match the sort function passed to `Array.filter`.
       * Using a filter function has no effect on the underlying `items` array.
       */
      filter: {
        type: Function,
        observer: '__filterChanged'
      },
      
      columnInfos: {
        type: Array
      },
      
      assignedElements: {
        type: Object
      }
      
    };
  }
  
  __filterChanged() {
  
  }
  
  connectedCallback() {
    super.connectedCallback();
    this.$.columnSlot.addEventListener('slotchange', e => {
      const columnInfos = this.$.columnSlot.assignedElements().filter(_ => _.tagName.toLowerCase() === 'h2-table-column');
      this.set('columnInfos', columnInfos);
    });
  }
  
  static get is() {
    return "h2-table";
  }
}

window.customElements.define(H2Table.is, H2Table);
