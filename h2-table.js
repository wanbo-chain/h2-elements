/*

```html

```
*/

import './h2-pagination.js';
import {html, PolymerElement} from "@polymer/polymer";
import './h2-table-column'
import {mixinBehaviors} from "@polymer/polymer/lib/legacy/class";
import {BaseBehavior} from "./behaviors/base-behavior";
import './behaviors/h2-elements-shared-styles.js';
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
    <style include="h2-elements-shared-styles">
      :host {
        font-family: var(--h2-ui-font-family), sans-serif;
        font-size: var(--h2-ui-font-size);
        display: block;
      }
      
      .h2-table {
        overflow-y: hidden;
      }
      
      .h2-table td, .h2-table th {
        padding: 10px;
        margin: 0;
        box-sizing: border-box;
        overflow: hidden;
        text-overflow: ellipsis;
        vertical-align: middle;
        text-align: left;
        border-bottom: 1px solid #ebeef5;
        line-height: 25px;
      }
      
      .table__head, .table__body {
        width: 100%;
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
      }
      
      .table__body {
        color: #606266;
        table-layout: fixed;
        border-collapse: separate;
      }
      
      .table__row:hover > td, .table__summary {
        background: #ecf5ff;
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
      
      .row__expansion-hidden {
        visibility: collapse;
      }
      
      :host([border]) .h2-table {
        border: 1px solid #ebeef5;
      }
      
      :host([border]) td,
      :host([border]) th {
        border-right: 1px solid #ebeef5;
      }
      
      :host([border]) td:last-of-type,
      :host([border]) th:last-of-type {
        border-right: none;
      }
      
      .table__sort__icons {
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        height: 46px;
        width: 20px;
        vertical-align: middle;
        cursor: pointer;
        overflow: initial;
        position: relative;
        
      }
      
      .table__sort__icon.ascending {
        top: 7px;
      }
      
      .table__sort__icon.descending {
        bottom: 9px;
      }
      
      th div.header__cell {
        display: flex;
        align-items: center;
      }
      
      .table__sort__icons.ascending .table__sort__icon.ascending,
      .table__sort__icons.descending .table__sort__icon.descending {
        color: var(--h2-ui-color_skyblue)
      }
      
      /*.table__column[aria-frozen] {*/
        /*position: absolute;*/
        /*background: white;*/
        /*width: 4em;*/
      /*}*/
      
    </style>
    
    <slot id="columnSlot"></slot>
    
    <div class="h2-table">
      <div class="table__header__container">
        <table class="table__head" cellpadding="0" cellspacing="0" border="0">
          <colgroup>
            <template is="dom-if" if="[[ __showExpansion ]]">
              <col width="48">
            </template>
            <template is="dom-if" if="[[ showIndex ]]">
              <col width="52">
            </template>
            <template is="dom-repeat" items="[[columnInfos]]">
                <col width="[[item.width]]">
            </template>
          </colgroup>
          <thead>
            <tr id="headerRow">
              <template is="dom-if" if="[[ __showExpansion ]]">
                 <th></th>
              </template>
              <template is="dom-if" if="[[ showIndex ]]">
                 <th>序号</th>
              </template>
              <template is="dom-repeat" items="[[columnInfos]]" as="column">
                <th class="table__column" aria-frozen$="[[column.frozen]]">
                  <div class="header__cell">
                    <div class="table__cell">[[column.label]]</div>
                    <template is="dom-if" if="[[ column.sortable ]]">
                      <div class="table__sort__icons" on-click="__sortTheColumn">
                        <iron-icon class="table__sort__icon ascending" icon="icons:arrow-drop-up"></iron-icon>
                        <iron-icon class="table__sort__icon descending" icon="icons:arrow-drop-down"></iron-icon>
                      </div>
                    </template>
                  </div>
                </th>
              </template>
            </tr>
          </thead>
        </table>
      </div>
      <div class="table__body__container">
        <table id="tableBody" class="table__body" cellpadding="0" cellspacing="0" border="0">
          <colgroup>
            <template is="dom-if" if="[[ __showExpansion ]]">
               <col width="48">
            </template>
            <template is="dom-if" if="[[ showIndex ]]">
               <col width="52">
            </template>
            
            <template is="dom-repeat" items="[[columnInfos]]">
              <col width="[[item.width]]">
            </template>
          </colgroup>
          
          <tbody>
            <template is="dom-repeat" items="[[__tableData]]" as="row" index-as="rowIndex">
              <tr class="table__row">
                <template is="dom-if" if="[[ __showExpansion ]]">
                  <td><iron-icon class="expand-icon" icon="icons:chevron-right" item="[[item]]" onclick="[[ __openExpanderHandler(rowIndex) ]]"></iron-icon></td>
                </template>
                <template is="dom-if" if="[[ showIndex ]]">
                   <td>[[ compute(rowIndex, '+', 1) ]]</td>
                </template>
                
                <template is="dom-repeat" items="[[columnInfos]]" index-as="columnIndex">
                  <td class="table__column" id="row_[[rowIndex]]_column_[[columnIndex]]" aria-frozen$="[[item.frozen]]">
                      [[ computeContent(row, rowIndex, item, columnIndex) ]]
                  </td>
                </template>
              </tr>
              
              <template is="dom-if" if="[[ __showExpansion ]]">
                <tr class="row__expansion row__expansion-hidden">
                  <td id="row_[[rowIndex]]" class="row__expansion-col" colspan$="[[ colspan ]]">
                    [[ computeExpansion(row, rowIndex) ]]
                  </td>
                </tr>
              </template>
            </template>
            
            <template is="dom-if" if="[[showSummary]]">
              <tr class="table__summary"><td colspan$="[[ colspan ]]"><slot name="summarySlot"></slot></td></tr>
            </template>
            
          </tbody>
        </table>
      </div>
    </div>
`;
  }
  
  __sortTheColumn(e) {
    const container = e.currentTarget;
  
    const ASCENDING = 'ascending';
    const DESCENDING = 'descending';
  
    const sortableContainers = this.$.headerRow.querySelectorAll('.table__sort__icons');
    
    Array.from(sortableContainers).filter(node => node !== container)
      .forEach(node => node.classList.remove(ASCENDING, DESCENDING));
    
    let direction;
    if(container.classList.contains(ASCENDING)) {
      container.classList.remove(ASCENDING);
      container.classList.add(DESCENDING);
      direction = DESCENDING;
    } else if(container.classList.contains(DESCENDING)) {
      container.classList.remove(DESCENDING);
      direction = null;
    } else {
      container.classList.add(ASCENDING);
      direction = ASCENDING;
    }
    
    let cmpFn;
    switch (direction) {
    case DESCENDING:
      cmpFn = field => {
        return (a, b) => (b[field] || '').toString().localeCompare((a[field] || '').toString());
      };
      break;
    case ASCENDING:
      cmpFn = field => {
        return (a, b) => (a[field] || '').toString().localeCompare((b[field] || '').toString());
      };
      break;
    default:
      cmpFn = () => undefined;
      break;
    }
    
    const cache = this.data.slice();
    cache.sort(cmpFn(e.model.column.prop));
    this.__tableData = cache;
  }
  
  __calColspan(columnInfos = []) {
    const [first] = columnInfos;
    let length = columnInfos.length;
    if(first.type === 'expand') {
      length += 1;
    }
    if(this.showIndex) {
      length += 1;
    }
    return length;
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
    if (root) {
      parent.innerHTML = '';
      parent.appendChild(root);
    }
  }
  
  __dataChanged(data) {
    this.__tableData = data.slice();
  }
  
  __calShowExpansion([first] = [{}]) {
    return first.type === 'expand';
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
  
  connectedCallback() {
    super.connectedCallback();
    this.$.columnSlot.addEventListener('slotchange', e => {
      const columnInfos = this.$.columnSlot.assignedElements().filter(_ => _.tagName.toLowerCase() === 'h2-table-column');
      this.set('columnInfos', columnInfos);
    });
  }
  
  static get properties() {
    return {
      data: {
        type: Array,
        observer: '__dataChanged'
      },
      
      sort: {
        type: Function,
        observer: '__sortChanged'
      },
      
      colspan: {
        type: Number,
        computed: '__calColspan(columnInfos)'
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
      },
      
      _tableData: {
        type: Array
      },
  
      showSummary: {
        type: Boolean,
        value: false
      },
      
      showIndex: {
        type: Boolean,
        value: false
      },
      
      __showExpansion: {
        type: Boolean,
        computed: '__calShowExpansion(columnInfos)'
      }
    };
  }
  
  static get is() {
    return "h2-table";
  }
}

window.customElements.define(H2Table.is, H2Table);
