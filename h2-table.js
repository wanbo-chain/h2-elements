/*

```html

```
*/

import {html, PolymerElement} from "@polymer/polymer";
import {mixinBehaviors} from "@polymer/polymer/lib/legacy/class";
import '@polymer/iron-icon';
import '@polymer/iron-icons';
import '@polymer/paper-checkbox/paper-checkbox';
import '@polymer/paper-tooltip/paper-tooltip';

import {BaseBehavior} from "./behaviors/base-behavior";
import './behaviors/h2-elements-shared-styles.js';
import './h2-table-column'

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
        overflow-x: auto;
        overflow-y: hidden;
      }
      
      .h2-table td, .h2-table th {
        padding: 10px;
        margin: 0;
        box-sizing: border-box;
        vertical-align: middle;
        text-align: left;
        border-bottom: 1px solid #ebeef5;
        line-height: 25px;
      }
      
      .h2-table th {
        border-bottom-width: 2px;
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
      
      .table__cell {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space : nowrap;
      }
      
      .table__sort__icons.ascending .table__sort__icon.ascending,
      .table__sort__icons.descending .table__sort__icon.descending {
        color: var(--h2-ui-color_skyblue)
      }
      
      .table__column[role=operate] {
        overflow: unset;
      }
      
      /*.table__column[aria-frozen] {*/
        /*position: absolute;*/
        /*background: white;*/
        /*width: 4em;*/
      /*}*/
      
      :host paper-tooltip {
        display: none;
        --paper-tooltip-opacity: 1;
        --paper-tooltip: {
          font-size: 12px;
        }
      }
      
      :host([tooltip]) paper-tooltip {
        display: block;
      }
      
      .table__nodata {
        text-align: center !important;
      }
      
      .checkbox-item {
        --paper-checkbox-checked-color: var(--h2-ui-color_skyblue);
      }
      
    </style>
    
    <slot id="columnSlot"></slot>
    
    <div class="h2-table">
      <div class="table__scroll__head">
        <div class="table__scroll__head__inner"></div>
        <table class="table__head" cellpadding="0" cellspacing="0" border="0">
          <colgroup>
            <template is="dom-if" if="[[ selectable ]]">
              <col width="40">
            </template>
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
              <template is="dom-if" if="[[ selectable ]]">
                 <th><paper-checkbox class="checkbox-item" noink checked="{{__selectedState}}" on-click="__rowSelecttionAll"></paper-checkbox></th>
              </template>
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
                      <div class="table__sort__icons" on-tap="__sortTheColumn">
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
            <template is="dom-if" if="[[ selectable ]]">
               <col width="40">
            </template>
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
            <template is="dom-if" if="[[ isArrayEmpty(data) ]]">
              <tr class="table__row">
                <td class="table__nodata" colspan$="[[ colspan ]]">无数据</td>
              </tr>
            </template>
            
            <template is="dom-repeat" items="[[__tableData]]" as="row" index-as="rowIndex">
              <tr class="table__row">
                <template is="dom-if" if="[[ selectable ]]">
                  <td><paper-checkbox class="checkbox-item" noink checked="{{ row.__selected }}" on-change="__rowSelecttion"></paper-checkbox></td>
                </template>
                <template is="dom-if" if="[[ __showExpansion ]]">
                  <td><iron-icon class="expand-icon" icon="icons:chevron-right" on-click="__openExpanderHandler"></iron-icon></td>
                </template>
                <template is="dom-if" if="[[ showIndex ]]">
                   <td>[[ calc(rowIndex, '+', 1) ]]</td>
                </template>
                <template is="dom-repeat" items="[[columnInfos]]" index-as="columnIndex">
                  <td style$="[[item.cellStyle]]" class="table__column table__cell" role$="[[item.type]]" id="row_[[rowIndex]]_column_[[columnIndex]]" aria-frozen$="[[item.frozen]]">
                      [[ computeContent(row, rowIndex, item, columnIndex) ]]
                      <paper-tooltip position="top" animation-delay="10" offset="-10" fit-to-visible-bounds>[[ computeContent(row, rowIndex, item, columnIndex) ]]</paper-tooltip>
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
              <tr class="table__summary">
                <td colspan$="[[ colspan ]]">
                  <slot name="summarySlot"></slot>
                </td>
              </tr>
            </template>
            
          </tbody>
        </table>
      </div>
    </div>
`;
  }
  
  __sortTheColumn({currentTarget: container, model}) {
    const ASCENDING = 'ascending';
    const DESCENDING = 'descending';
    
    const sortableContainers = this.$.headerRow.querySelectorAll('.table__sort__icons');
    
    // clear other sortable states.
    Array.from(sortableContainers).filter(node => node !== container)
      .forEach(node => node.classList.remove(ASCENDING, DESCENDING));
    
    let direction;
    if (container.classList.contains(ASCENDING)) {
      container.classList.remove(ASCENDING);
      container.classList.add(DESCENDING);
      direction = DESCENDING;
    } else if (container.classList.contains(DESCENDING)) {
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
    cache.sort(cmpFn(model.column.prop));
    this.__tableData = cache;
  }
  
  __calColspan(columnInfos = []) {
    const [first] = columnInfos;
    let length = columnInfos.length;
    
    if (first.type === 'expand') length += 1;
    if (this.showIndex) length += 1;
    
    return length;
  }
  
  __openExpanderHandler({path: [icon], model: {rowIndex}}) {
    this.toggleClass(icon, 'expand-icon_opened');
    const expansion = this.shadowRoot.querySelector(`#row_${rowIndex}`).parentElement;
    this.toggleClass(expansion, 'row__expansion-hidden');
  }
  
  __rowSelecttion({model: {row}}) {
    this.__selectedState = this.__tableData.some(d => d.__selected);
    this.dispatchEvent(new CustomEvent('row-selection-changed', {detail: {row, selected: row.__selected}}));
  }
  
  __rowSelecttionAll() {
    this.__tableData =
      this.__tableData.map(d => Object.assign({}, d, {__selected: this.__selectedState}));
    this.dispatchEvent(new CustomEvent('rows-all-selection-changed', {detail: {selectedRows:  this.getSelectedRows()}}));
  }
  
  __appendTmplContent(targetSelector, model, rowIndex, columnTag) {
    const parent = this.shadowRoot.querySelector(targetSelector);
    const {root} = columnTag.stampTemplate(model) || {};
    if (root) {
      parent.innerHTML = '';
      parent.appendChild(root);
    }
  }
  
  __dataChanged(data = []) {
    this.__tableData = data.slice();
  }
  
  __calShowExpansion([first] = [{}]) {
    return first.type === 'expand';
  }
  
  /**
   * 获取选中的行
   * @return {any}
   */
  getSelectedRows() {
    return this.selectable ? (this.__tableData || []).filter(d => d.__selected) : [];
  }
  
  computeExpansion(row, rowIndex) {
    const [column] = this.columnInfos || [];
    if (column && column.type === 'expand') {
      setTimeout(() => {
        this.__appendTmplContent(`#row_${rowIndex}`, row, rowIndex, column);
      }, 0, this);
    }
  }
  
  computeContent(row, rowIndex, column, columnIndex) {
    if (column.tmpl && column.type === 'operate') {
      
      setTimeout(() => {
        this.__appendTmplContent(`#row_${rowIndex}_column_${columnIndex}`, row, rowIndex, column);
      }, 0, this);
      
      return null;
    }
    
    if (column.props) {
      return column.props.split(",").map(p => this.getValueByKey(row, p.trim())).join(column.separator || ',');
    }
    
    if (Function.prototype.isPrototypeOf(column.formatter)) {
      return column.formatter.call(this, this.getValueByKey(row, column.prop))
    }
    
    return this.getValueByKey(row, column.prop);
  }
  
  connectedCallback() {
    super.connectedCallback();
    this.$.columnSlot.addEventListener('slotchange', e => {
      const columnInfos = e.target.assignedElements()
        .filter(_ => _.tagName.toLowerCase() === 'h2-table-column');
      this.set('columnInfos', columnInfos);
    });
  }
  
  static get properties() {
    return {
      data: {
        type: Array,
        observer: '__dataChanged',
        value: function () {
          return [];
        }
      },
      
      sort: {
        type: Function,
        observer: '__sortChanged'
      },
      
      colspan: {
        type: Number,
        computed: '__calColspan(columnInfos)'
      },
      
      columnInfos: {
        type: Array
      },
      
      assignedElements: {
        type: Object
      },
      
      __tableData: {
        type: Array
      },
      
      showSummary: {
        type: Boolean,
        value: false
      },
      
      tooltip: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      
      showIndex: {
        type: Boolean,
        value: false
      },
      
      selectable: {
        type: Boolean,
        value: false
      },
      
      __showExpansion: {
        type: Boolean,
        computed: '__calShowExpansion(columnInfos)'
      },
      
      __selectedState: Boolean
    };
  }
  
  static get is() {
    return "h2-table";
  }
}

window.customElements.define(H2Table.is, H2Table);
