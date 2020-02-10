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
        /*overflow-x: auto;*/
        /*overflow-y: hidden;*/
        position: relative;
      }
      
      .table_box {
        overflow-x: auto;
        overflow-y: hidden;
      }
      
      .h2-table td, .h2-table th {
        padding: 0 10px;
        margin: 0;
        box-sizing: border-box;
        vertical-align: middle;
        text-align: left;
        border-bottom: 1px solid #ebeef5;
        height: 44px;
        line-height: 40px;
        @apply --h2-table-line-height;
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
        padding: 10px 40px !important;
        color: #99a9bf;
        line-height: 26px !important;
      }
      
      .expand-icon_opened {
        transform: rotate(90deg);
        transition: transform .2s ease-in-out
      }
      
      .row__expansion-hidden {
        /*visibility: collapse;*/
        display: none;
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
      
      :host([height]) .table__scroll__head {
        overflow: hidden;
      }
      
      .table__sort__icons {
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        height: 40px;
        width: 18px;
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
        display: inline-flex;
        align-items: center;
      }
      
      .td_cell {
        position: relative
        display: inline-block;
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
      
      .table__fixed {
        position: absolute;
        left: 0;
        top: 0;
        overflow-x: hidden;
        overflow-y: hidden;
        background-color: rgba(255, 255, 255, 1);
        box-shadow: 10px 0 10px -10px rgba(0,0,0,.12);
        width: 0;
      }
      
      .table__fixed table {
        width: 100%;
      }
      
      .table__fixed .table__body__container {
        overflow-x: hidden;
      }
      
      .table__fixed__right {
        position: absolute;
        right: 0;
        top: 0;
        overflow-x: hidden;
        overflow-y: hidden;
        background-color: rgba(255, 255, 255, 1);
        box-shadow: -10px 0 10px -10px rgba(0,0,0,.12);
        width: 0;
      }
      
      .table__body__container > table {
        width: 100%;
      }
      .fixed_right_expansion > div {
        opacity: 0;
      }
      
      #tableBodyFixed::-webkit-scrollbar, #tableBodyFixedRight::-webkit-scrollbar {
        display: none;
      }
      
    </style>
    
    <slot id="columnSlot"></slot>
    
    <div class="h2-table">
      <div class="table_box">
        <div class="table__scroll__head" id="tableHeader">
        <div class="table__scroll__head__inner"></div>
          <table class="table__head" cellpadding="0" cellspacing="0" border="0">
            <colgroup>
              <template is="dom-if" if="[[ selectable ]]">
                <col width="40">
              </template>
              <template is="dom-if" if="[[ __showExpansion ]]">
                <col width="30">
              </template>
              <template is="dom-if" if="[[ showIndex ]]">
                <col width="52">
              </template>
              <template is="dom-repeat" items="[[columnInfos]]">
                  <col width="[[item.width]]">
              </template>
            </colgroup>
            <thead>
              <tr>
                <template is="dom-if" if="[[ selectable ]]">
                   <th id="selectable">
                    <template is="dom-if" if="[[ !radio ]]">
                      <paper-checkbox class="checkbox-item" noink checked="{{__selectedState}}" on-click="__rowSelecttionAll"></paper-checkbox>
                    </template>
                   </th>
                </template>
                <template is="dom-if" if="[[ __showExpansion ]]">
                   <th id="__showExpansion"></th>
                </template>
                <template is="dom-if" if="[[ showIndex ]]">
                   <th id="showIndex">序号</th>
                </template>
                <template is="dom-repeat" items="[[columnInfos]]" as="column">
                  <th class="table__column" style$="[[column.cellStyle]]" aria-frozen$="[[column.frozen]]">
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
        <div class="table__body__container" style$="[[tableBodyStyle]]" id="tableBody">
          <table class="table__body" cellpadding="0" cellspacing="0" border="0">
            <colgroup>
              <template is="dom-if" if="[[ selectable ]]">
                 <col width="40">
              </template>
              <template is="dom-if" if="[[ __showExpansion ]]">
                 <col width="30">
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
                    <td><paper-checkbox class="checkbox-item" noink disabled="[[isDisabledSelection(row)]]" checked="{{ row.__selected }}" on-change="__rowSelecttion"></paper-checkbox></td>
                  </template>
                  <template is="dom-if" if="[[ __showExpansion ]]">
                    <td><iron-icon class="expand-icon" icon="icons:chevron-right" on-click="__openExpanderHandler"></iron-icon></td>
                  </template>
                  <template is="dom-if" if="[[ showIndex ]]">
                     <td>[[ calc(rowIndex, '+', 1) ]]</td>
                  </template>
                  <template is="dom-repeat" items="[[columnInfos]]" index-as="columnIndex">
                    <td style$="[[item.cellStyle]]" class="table__column" role$="[[item.type]]" id="row_[[rowIndex]]_column_[[columnIndex]]" aria-frozen$="[[item.frozen]]">
                      <div class="td_cell">
                        <div class="table__cell">[[ computeContent(row, rowIndex, item, columnIndex) ]]</div>
                        <paper-tooltip position="top" animation-delay="10" offset="5" fit-to-visible-bounds>[[ computeContent(row, rowIndex, item, columnIndex) ]]</paper-tooltip>
                      </div>
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
      <template is="dom-if" if="[[!isArrayEmpty(__tableFixed)]]">
        <div class="table__fixed" style$="[[tableFixedStyle]]">
          <div class="table__scroll__head">
            <div class="table__scroll__head__inner"></div>
            <table class="table__head" cellpadding="0" cellspacing="0" border="0">
              <colgroup>
                <template is="dom-if" if="[[ selectable ]]">
                  <col width="40">
                </template>
                <template is="dom-if" if="[[ __showExpansion ]]">
                  <col width="30">
                </template>
                <template is="dom-if" if="[[ showIndex ]]">
                  <col width="52">
                </template>
                <template is="dom-repeat" items="[[__tableFixed]]">
                    <col width="[[item.width]]">
                </template>
              </colgroup>
              <thead>
                <tr>
                  <template is="dom-if" if="[[ selectable ]]">
                     <th>
                      <template is="dom-if" if="[[ !radio ]]">
                        <paper-checkbox class="checkbox-item" noink checked="{{__selectedState}}" on-click="__rowSelecttionAll"></paper-checkbox>
                      </template>
                     </th>
                  </template>
                  <template is="dom-if" if="[[ __showExpansion ]]">
                     <th></th>
                  </template>
                  <template is="dom-if" if="[[ showIndex ]]">
                     <th>序号</th>
                  </template>
                  <template is="dom-repeat" items="[[__tableFixed]]" as="column">
                    <th class="table__column" style$="[[column.cellStyle]]" aria-frozen$="[[column.frozen]]">
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
          <div class="table__body__container" style$="[[tableBodyStyle]]" id="tableBodyFixed">
          <table cellpadding="0" cellspacing="0" border="0">
            <colgroup>
              <template is="dom-if" if="[[ selectable ]]">
                 <col width="40">
              </template>
              <template is="dom-if" if="[[ __showExpansion ]]">
                 <col width="30">
              </template>
              <template is="dom-if" if="[[ showIndex ]]">
                 <col width="52">
              </template>
              
              <template is="dom-repeat" items="[[__tableFixed]]">
                <col width="[[item.width]]">
              </template>
            </colgroup>
            
            <tbody>
              <template is="dom-if" if="[[ isArrayEmpty(data) ]]">
                <tr class="table__row">
                  <td class="table__nodata" colspan$="[[ colspan ]]">&nbsp;</td>
                </tr>
              </template>
              
              <template is="dom-repeat" items="[[__tableData]]" as="row" index-as="rowIndex">
                <tr class="table__row">
                  <template is="dom-if" if="[[ selectable ]]">
                    <td><paper-checkbox class="checkbox-item" noink checked="{{ row.__selected }}" on-change="__rowSelecttion"></paper-checkbox></td>
                  </template>
                  <template is="dom-if" if="[[ __showExpansion ]]">
                    <td><iron-icon class="expand-icon" icon="icons:chevron-right" on-click="__openExpanderHandlerFixed"></iron-icon></td>
                  </template>
                  <template is="dom-if" if="[[ showIndex ]]">
                     <td>[[ calc(rowIndex, '+', 1) ]]</td>
                  </template>
                  <template is="dom-repeat" items="[[__tableFixed]]" index-as="columnIndex">
                    <template is="dom-if" if="[[ !isEqual(item.type, 'expand') ]]">
                      <td style$="[[item.cellStyle]]" class="table__column" role$="[[item.type]]" id="fixed_row_[[rowIndex]]_column_[[columnIndex]]" aria-frozen$="[[item.frozen]]">
                        <div class="td_cell">
                          <div class="table__cell">[[ computeContentFixed(row, rowIndex, item, columnIndex) ]]</div>
                          <paper-tooltip position="top" animation-delay="10" offset="5" fit-to-visible-bounds>[[ computeContentFixed(row, rowIndex, item, columnIndex) ]]</paper-tooltip>
                        </div>
                      </td>
                    </template>
                  </template>
                </tr>
           
                <template is="dom-if" if="[[ __showExpansion ]]">
                  <tr class="row__expansion row__expansion-hidden">
                    <td id="fixed_row_[[rowIndex]]" class="row__expansion-col" colspan$="[[ colspan ]]">
                      [[ computeExpansionFixed(row, rowIndex) ]]
                    </td>
                  </tr>
                </template>
              </template>
            </tbody>
          </table>
        </div>
        </div>
      </template>
      <template is="dom-if" if="[[!isArrayEmpty(__tableFixedRight)]]">
        <div class="table__fixed__right" style$="[[tableFixedRightStyle]]">
          <div class="table__scroll__head">
            <div class="table__scroll__head__inner"></div>
            <table class="table__head" cellpadding="0" cellspacing="0" border="0">
              <colgroup>
                <template is="dom-repeat" items="[[__tableFixedRight]]">
                    <col width="[[item.width]]">
                </template>
              </colgroup>
              <thead>
                <tr>
                  <template is="dom-repeat" items="[[__tableFixedRight]]" as="column">
                    <th class="table__column" style$="[[column.cellStyle]]" aria-frozen$="[[column.frozen]]">
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
          <div class="table__body__container" style$="[[tableBodyStyle]]" id="tableBodyFixedRight">
          <table cellpadding="0" cellspacing="0" border="0">
            <colgroup>
              <template is="dom-repeat" items="[[__tableFixedRight]]">
                <col width="[[item.width]]">
              </template>
            </colgroup>
            
            <tbody>
              <template is="dom-if" if="[[ isArrayEmpty(data) ]]">
                <tr class="table__row">
                  <td class="table__nodata" colspan$="[[ colspan ]]">&nbsp;</td>
                </tr>
              </template>
              
              <template is="dom-repeat" items="[[__tableData]]" as="row" index-as="rowIndex">
                <tr class="table__row">
                  <template is="dom-repeat" items="[[__tableFixedRight]]" index-as="columnIndex">
                    <td style$="[[item.cellStyle]]" class="table__column" role$="[[item.type]]" id="fixed_right_row_[[rowIndex]]_column_[[columnIndex]]" aria-frozen$="[[item.frozen]]">
                      <div class="td_cell">
                        <div class="table__cell">[[ computeContentFixedRight(row, rowIndex, item, columnIndex) ]]</div>
                        <paper-tooltip position="top" animation-delay="10" offset="5" fit-to-visible-bounds>[[ computeContentFixedRight(row, rowIndex, item, columnIndex) ]]</paper-tooltip>
                      </div>
                    </td>
                  </template>
                </tr>
           
                <template is="dom-if" if="[[ __showExpansion ]]">
                  <tr class="row__expansion row__expansion-hidden">
                    <td id="fixed_right_row_[[rowIndex]]" class="row__expansion-col fixed_right_expansion" colspan$="[[ colspan ]]">
                      [[ computeExpansionFixedRight(row, rowIndex) ]]
                    </td>
                  </tr>
                </template>
              </template>
            </tbody>
          </table>
        </div>
        </div>
      </template>
    </div>
`;
  }
  
  __sortTheColumn({currentTarget: container, model}) {
    const ASCENDING = 'ascending';
    const DESCENDING = 'descending';
    
    const sortableContainers = this.shadowRoot.querySelectorAll('.table__sort__icons');
    
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
    
    if (first.type === 'expand' || this.selectable) length += 1;
    if (this.showIndex) length += 1;
    
    return length;
  }
  
  __shareOpenExpanderHandler(icon, rowIndex, target) {
    this.toggleClass(icon, 'expand-icon_opened');
    const expansion = this.shadowRoot.querySelector(target).parentElement;
    this.toggleClass(expansion, 'row__expansion-hidden');
  }
  
  __openExpanderHandler({path: [icon], model: {rowIndex}}) {
    this.__shareOpenExpanderHandler(icon, rowIndex, `#row_${rowIndex}`);
  }
  
  __openExpanderHandlerFixed({path: [icon], model: {rowIndex}}) {
    this.__shareOpenExpanderHandler(icon, rowIndex, `#row_${rowIndex}`);
    if (this.__tableFixed.length) this.__shareOpenExpanderHandler(icon, rowIndex, `#fixed_row_${rowIndex}`);
    if (this.__tableFixedRight.length) this.__shareOpenExpanderHandler(icon, rowIndex, `#fixed_right_row_${rowIndex}`);
  }
  
  __openExpanderHandlerFixedRight({path: [icon], model: {rowIndex}}) {
    this.__shareOpenExpanderHandler(icon, rowIndex, `#fixed_right_row_${rowIndex}`);
  }
  
  __rowSelecttion({model: {row, rowIndex}}) {
    if (this.radio) {
      const findIndex = this.__tableData.findIndex(val => val.__selected);
      this.__tableData = this.__tableData.map(val => Object.assign({}, val, {__selected: false}));
      this.set(`__tableData.${rowIndex}.__selected`, findIndex > -1);
    }
    if (!this.radio) this.__selectedState = this.__tableData.some(d => d.__selected);
    this.dispatchEvent(new CustomEvent('row-selection-changed', {detail: {row, selected: row.__selected}}));
  }
  
  __rowSelecttionAll() {
    this.__tableData =
      this.__tableData.map(d => Object.assign({}, d, {__selected: this.__selectedState}));
    this.dispatchEvent(new CustomEvent('rows-all-selection-changed', {detail: {selectedRows: this.getSelectedRows()}}));
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
    this.domReady();
  }
  
  __calShowExpansion([first] = [{}]) {
    return first.type === 'expand';
  }
  
  isDisabledSelection(row) {
    if(!this.selectionFilter) return false;
    return this.selectionFilter(row);
  }
  
  /**
   * 获取选中的行
   * @return {any}
   */
  getSelectedRows() {
    return this.selectable ? (this.__tableData || []).filter(d => d.__selected) : [];
  }
  
  shareComputeExpansion(row, rowIndex, targetSelect) {
    const [column] = this.columnInfos || [];
    if (column && column.type === 'expand') {
      setTimeout(() => {
        this.__appendTmplContent(targetSelect, row, rowIndex, column);
      }, 0, this);
    }
  }
  
  computeExpansion(row, rowIndex) {
    this.shareComputeExpansion(row, rowIndex, `#row_${rowIndex}`);
  }
  
  computeExpansionFixed(row, rowIndex) {
    this.shareComputeExpansion(row, rowIndex, `#fixed_row_${rowIndex}`);
  }
  
  computeExpansionFixedRight(row, rowIndex) {
    this.shareComputeExpansion(row, rowIndex, `#fixed_right_row_${rowIndex}`);
  }
  
  shareComputeContent(row, rowIndex, column, targetSelect) {
    if (column.tmpl && column.type === 'operate') {
      
      setTimeout(() => {
        this.__appendTmplContent(targetSelect, row, rowIndex, column);
      }, 0, this);
      
      return null;
    }
    
    if (column.props) {
      return column.props.split(",").map(p => this.getValueByKey(row, p.trim())).join(column.separator || ',');
    }
    
    if (Function.prototype.isPrototypeOf(column.formatter)) {
      return column.formatter.call(this, this.getValueByKey(row, column.prop, column.defaultValue));
    }
    
    return this.getValueByKey(row, column.prop, column.defaultValue);
  }
  
  computeContent(row, rowIndex, column, columnIndex) {
    return this.shareComputeContent(row, rowIndex, column, `#row_${rowIndex}_column_${columnIndex}`)
  }
  
  computeContentFixed(row, rowIndex, column, columnIndex) {
    return this.shareComputeContent(row, rowIndex, column, `#fixed_row_${rowIndex}_column_${columnIndex}`);
  }
  
  computeContentFixedRight(row, rowIndex, column, columnIndex) {
    return this.shareComputeContent(row, rowIndex, column, `#fixed_right_row_${rowIndex}_column_${columnIndex}`);
  }
  
  connectedCallback() {
    super.connectedCallback();
    this.$.columnSlot.addEventListener('slotchange', e => {
      const columnInfos = e.target.assignedElements()
        .filter(_ => _.tagName.toLowerCase() === 'h2-table-column');
      const __tableFixed = columnInfos.filter(itm => itm.fixed === "");
      const __tableFixedRight = columnInfos.filter(itm => itm.fixed === "right");
      const columnInfosSort = __tableFixed.concat(columnInfos.filter(itm => itm.fixed !== '' && itm.fixed !== 'right')).concat(__tableFixedRight);
      this.set('columnInfos', columnInfosSort);
      this.set('__tableFixed', __tableFixed);
      this.set('__tableFixedRight', __tableFixedRight);
      
      const tableBodyFixed = this.shadowRoot.querySelector('#tableBodyFixed');
      const tableBodyFixedRight = this.shadowRoot.querySelector('#tableBodyFixedRight');
      
      this.$.tableBody.addEventListener('scroll', () => {
        this.$.tableHeader.scrollLeft = this.$.tableBody.scrollLeft;
        if (tableBodyFixed) tableBodyFixed.scrollTop = this.$.tableBody.scrollTop;
        if (tableBodyFixedRight) tableBodyFixedRight.scrollTop = this.$.tableBody.scrollTop;
      });
      
      if (__tableFixed.length > 0) {
        tableBodyFixed && tableBodyFixed.addEventListener('scroll', () => {
          this.$.tableBody.scrollTop = tableBodyFixed.scrollTop;
          if (tableBodyFixedRight) tableBodyFixedRight.scrollTop = tableBodyFixed.scrollTop;
        });
      }
      
      if (__tableFixedRight.length > 0) {
        tableBodyFixedRight && tableBodyFixedRight.addEventListener('scroll', () => {
          this.$.tableBody.scrollTop = tableBodyFixedRight.scrollTop;
          if (tableBodyFixed) tableBodyFixed.scrollTop = tableBodyFixedRight.scrollTop;
        })
      }
      
    });
    
    if (this.height) {
      this.set('tableBodyStyle', `overflow: auto; height: ${this.height - 68}px;`)
    }
  }
  
  domReady() {
    // super.ready();
    // 计算固定列总宽度
    setTimeout(() => {
      
      // const tableBodyFixed = this.shadowRoot.querySelector('#tableBodyFixed');
      // const tableBodyFixedRight = this.shadowRoot.querySelector('#tableBodyFixedRight');
      
      if (this.__tableFixed.length > 0) {
        let width = 0;
        for (let i = 0; i < this.__tableFixed.length; i++) {
          const domItem = this.shadowRoot.querySelector(`#row_0_column_${i}`);
          width += (domItem && domItem.offsetWidth) || 0;
        }
        if (this.selectable) width += this.shadowRoot.querySelector('#selectable').offsetWidth;
        if (this.__showExpansion) width += this.shadowRoot.querySelector('#__showExpansion').offsetWidth;
        if (this.showIndex) width += this.shadowRoot.querySelector('#showIndex').offsetWidth;
        const tableFixedStyle = `width: ${width}px`;
        this.set('tableFixedStyle', tableFixedStyle);
        
        // tableBodyFixed && tableBodyFixed.addEventListener('scroll', () => {
        //   this.$.tableBody.scrollTop = tableBodyFixed.scrollTop;
        //   if (tableBodyFixedRight) tableBodyFixedRight.scrollTop = tableBodyFixed.scrollTop;
        // });
      }
      if (this.__tableFixedRight.length > 0) {
        let width = 0;
        for (let i = this.columnInfos.length - 1; i > this.columnInfos.length - this.__tableFixedRight.length - 1; i--) {
          const domItem = this.shadowRoot.querySelector(`#row_0_column_${i}`);
          width += (domItem && domItem.offsetWidth) || 0;
        }
        const tableFixedRightStyle = `width: ${width}px`;
        this.set('tableFixedRightStyle', tableFixedRightStyle);
        
        // tableBodyFixedRight && tableBodyFixedRight.addEventListener('scroll', () => {
        //   this.$.tableBody.scrollTop = tableBodyFixedRight.scrollTop;
        //   if (tableBodyFixed) tableBodyFixed.scrollTop = tableBodyFixedRight.scrollTop;
        // })
      }
    }, 10);
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
      
      radio: {
        type: Boolean,
        value: false
      },
      
      __showExpansion: {
        type: Boolean,
        computed: '__calShowExpansion(columnInfos)'
      },
      
      __selectedState: Boolean,
      
      height: Number,
      tableBodyStyle: String,
      __tableFixed: Array,
      __tableFixedRight: Array,
      tableFixedStyle: String,
      tableFixedRightStyle: String,
    };
  }
  
  static get is() {
    return "h2-table";
  }
}

window.customElements.define(H2Table.is, H2Table);
