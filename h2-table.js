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
import './h2-dialog'

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
        position: relative;
      }
      
      .h2-table td, .h2-table th {
        padding: 0 10px;
        margin: 0;
        box-sizing: border-box;
        vertical-align: middle;
        text-align: left;
        border-bottom: 1px solid #ebeef5;
        height: 44px;
        line-height: 44px;
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
      
      .table__row:hover, .table__summary {
        background: #ecf5ff;
      }
      
      .table__row:hover .fixed-left,.table__row:hover .fixed-right, .table__row:hover .selectable, .table__row:hover .show-expansion, .table__row:hover .show-index {
        background: #ecf5ff;
      }
      
      .row-high-light {
        background: #ffebee!important;
      }
      
      .column-high-light {
        background: #e8eaf6!important;
      }
      
      .column-high-light.row-high-light {
        background: #ffcdd2!important;
      }
      
      .expand-icon {
        cursor:pointer;
        color: grey;
        transition: transform .2s ease-in-out
      }
      
      .expand-icon-td {
        padding: 0 !important;
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
      
      .row__expansion {
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
        z-index: 1;
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
        /*position: relative;*/
        /*display: inline-block;*/
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
      
      .table__body__container{
        overflow: auto;
      }
      
      .table__body__container > table {
        width: 100%;
      }
      .fixed_right_expansion > div {
        opacity: 0;
      }
      
      .table__scroll__head {
        overflow: auto;
      }
      
      .table__scroll__head::-webkit-scrollbar{
        display: none!important;
      }
      
      .table__scroll__head_fixed {
        position: sticky;
        top: 0;
        background-color: rgba(255, 255, 255, 1);
        z-index: 1;
      }
      .hidden {
        display: none;
      }
      .head-fixed {
        position: sticky;
        background: #fff;
        z-index: 10;
      }
      .fixed-left {
        position: sticky;
        background: #fff;
        border-right: 1px solid #eee;
        box-shadow: 5px 0px 10px -3px rgba(0,0,0,.1);
      }
      .fixed-right {
        position: sticky;
        background: #fff;
        border-left: 1px solid #eee;
        box-shadow: -5px 0px 10px -3px rgba(0,0,0,.1);
      }
      .head-selectable, .selectable, .show-expansion, .show-index {
        position: sticky;
        background: #fff;
      }
      #dialogFilterList {
        --h2-dialog-width: auto;
        --h2-dialog-height: auto;
        --h2-dialog-content_-_padding: 20px 50px 20px 30px!important;
      }
      .table__filter__icon {
        width: 18px;
        height: 18px;
        cursor: pointer;
      }
      .filter-icon-selected {
        color: #2196F3;
      }
    </style>
    
    <slot id="columnSlot"></slot>
    
    <div class="h2-table">
      <div class="table_box">
        <div class$="table__scroll__head [[optional(unsetHeadFixed,'','table__scroll__head_fixed')]]" id="tableHeader">
        <div class="table__scroll__head__inner"></div>
          <table class="table__head" cellpadding="0" cellspacing="0" border="0">
            <colgroup>
              <template is="dom-if" if="[[ selectable ]]">
                <col width="40">
              </template>
              <template is="dom-if" if="[[ __showExpansion ]]">
                <col width="20">
              </template>
              <template is="dom-if" if="[[ showIndex ]]">
                <col width="52">
              </template>
              <template is="dom-repeat" items="[[columnInfos]]">
                  <template is="dom-if" if="[[!isEqual(item.type, 'expand')]]">
                    <col width="[[item.width]]">
                  </template>
              </template>
            </colgroup>
            <thead>
              <tr>
                <template is="dom-if" if="[[ selectable ]]">
                   <th id="selectable" class="head-selectable">
                    <template is="dom-if" if="[[ !radio ]]">
                      <paper-checkbox class="checkbox-item" noink checked="{{__selectedState}}" on-click="__rowSelectionAll"></paper-checkbox>
                    </template>
                   </th>
                </template>
                <template is="dom-if" if="[[ __showExpansion ]]">
                   <th id="__showExpansion" class="show-expansion"></th>
                </template>
                <template is="dom-if" if="[[ showIndex ]]">
                   <th id="showIndex" class="show-index">序号</th>
                </template>
                <template is="dom-repeat" items="[[__columnInfos(columnInfos)]]" as="column" index-as="columnIndex">
                  <th class$="table__column  [[__getHeadFixedClass(column)]]" style$="[[column.cellStyle]][[__getFixedLeftStyle(column)]][[__getFixedRightStyle(column)]]" aria-frozen$="[[column.frozen]]" on-dblClick="__columnClick">
                    <div class="header__cell">
                      <div class="table__cell">[[column.label]]</div>
                      <template is="dom-if" if="[[ column.sortable ]]">
                        <div class="table__sort__icons" on-tap="__sortTheColumn">
                          <iron-icon class="table__sort__icon ascending" icon="icons:arrow-drop-up"></iron-icon>
                          <iron-icon class="table__sort__icon descending" icon="icons:arrow-drop-down"></iron-icon>
                        </div>
                      </template>
                      <template is="dom-if" if="[[ column.filterable ]]">
                        <iron-icon class="table__filter__icon" icon="icons:filter-list" on-click="__clickFilter" data-prop$="[[column.prop]]"></iron-icon>
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
                 <col width="20">
              </template>
              <template is="dom-if" if="[[ showIndex ]]">
                 <col width="52">
              </template>
              
              <template is="dom-repeat" items="[[columnInfos]]">
                <template is="dom-if" if="[[!isEqual(item.type, 'expand')]]">
                    <col width="[[item.width]]">
                  </template>
              </template>
            </colgroup>
            
            <tbody id="content-body">
              <template is="dom-if" if="[[ isArrayEmpty(data) ]]">
                <tr class="table__row">
                  <td class="table__nodata" colspan$="[[ colspan ]]">无数据</td>
                </tr>
              </template>
              <template is="dom-repeat" items="[[__tableData]]" as="row" index-as="rowIndex">
              <tr class="table__row" id="row_ctn_[[rowIndex]]" on-dblClick="__rowClick" style$="[[setRowCustomStyle(row)]]">
                  [[ __generateRowContent(columnInfos, row, rowIndex) ]]
               </tr>
              
                <template is="dom-if" if="[[ __showExpansion ]]">
                  <tr class="row__expansion row__expansion-hidden">
                    <td id="row_[[rowIndex]]" class="row__expansion-col" colspan$="[[ colspan ]]"></td>
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
    </div>
    <h2-dialog id="dialogFilterList">
      <h2-select label="筛选条件" value="{{filterSelectedValue}}" items="[[filterList]]" placeholder="请选择" on-item-selected="__filterValueSelected"></h2-select>
    </h2-dialog>
`;
  }

  __sortTheColumn({currentTarget: container, model}) {
    const sortType = model.column.sortType;
    const sortEnum = model.column.sortEnum;
    const prop = model.column.prop;

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

    this.sortingCache = {sortType, sortEnum, direction, prop};
    this.__sortMethod(sortType, sortEnum, direction, prop);
    if (this.filterSelectedValue) {
      this.resetFilterClass();
    }
    if (this.dblClickColumnIndexs.length) {
      this.resetDblClickClass();
    }
  }

  resetDblClickClass() {
    this.dblClickColumnIndexs.forEach(item => {
      const elements = Array.from(this.shadowRoot.querySelectorAll(`.table__column__${item}`));
      elements.forEach(fi => fi.classList.remove('column-high-light'));
    })
    this.dblClickColumnIndexs = [];
  }

  __sortMethod(sortType, sortEnum, direction, prop) {
    const ASCENDING = 'ascending';
    const DESCENDING = 'descending';

    if (sortEnum) {
      let enums = [];
      let result = [];

      switch (direction) {
        case DESCENDING:
          enums = sortEnum.map(mi => mi.value).reverse();
          enums.forEach((item, index) => {
            const array = this.data.filter(fi => fi[prop] === item);
            result = result.concat(array);
          })
          this.__tableData = result.length ? result : this.data;
          break;
        case ASCENDING:
          enums = sortEnum.map(mi => mi.value);
          enums.forEach((item, index) => {
            const array = this.data.filter(fi => fi[prop] === item);
            result = result.concat(array);
          })
          this.__tableData = result.length ? result : this.data;
          break;
        default:
          this.__tableData = this.data;
          break;
      }
    } else {
      let cmpFn;
      switch (direction) {
        case DESCENDING:
          cmpFn = field => {
            if (sortType === 'number') {
              return (a, b) => parseFloat(b[field]) - parseFloat(a[field]);
            }
            return (a, b) => (b[field] || '').toString().localeCompare((a[field] || '').toString());
          };
          break;
        case ASCENDING:
          cmpFn = field => {
            if (sortType === 'number') {
              return (a, b) => parseFloat(a[field]) - parseFloat(b[field]);
            }
            return (a, b) => (a[field] || '').toString().localeCompare((b[field] || '').toString());
          };
          break;
        default:
          cmpFn = () => undefined;
          break;
      }

      const cache = this.data.slice();
      cache.sort(cmpFn(prop));
      this.__tableData = cache;
    }
  }

  __calColspan(columnInfos = []) {
    const [first] = columnInfos;
    let length = columnInfos.length;

    if (first.type === 'expand') length -= 1;
    if (this.showIndex || this.selectable) length += 1;

    return length;
  }

  __columnInfos(columnInfos) {
    return columnInfos.filter(col => col.type !== 'expand')
  }

  __shareOpenExpanderHandler(icon, rowIndex, target) {
    this.toggleClass(icon, 'expand-icon_opened');
    const expansion = this.shadowRoot.querySelector(target).parentElement;
    this.toggleClass(expansion, 'row__expansion-hidden');
  }

  __openExpanderHandler(icon, rowIndex) {
    this.__shareOpenExpanderHandler(icon, rowIndex, `#row_${rowIndex}`);
  }

  __rowSelection(e, row) {

    if (this.radio) {
      const selectedRow = this.__tableData.find(val => val.__selected);

      if (selectedRow && selectedRow.checkbox) {
        selectedRow.checkbox.checked = false;
        selectedRow.__selected = false;
      }
      if (row.checkbox) {
        row.checkbox.checked = e.currentTarget.checked;
      }
    }
    row.__selected = e.currentTarget.checked;
    if (!this.radio) this.__selectedState = this.__tableData.some(d => d.__selected);

    this.dispatchEvent(new CustomEvent('row-selection-changed', {detail: {row, selected: row.__selected}}));
  }

  __rowSelectionAll() {
    this.__tableData =
        this.__tableData.map(d => Object.assign({}, d, {__selected: this.__selectedState}));
    this.dispatchEvent(new CustomEvent('rows-all-selection-changed', {detail: {selectedRows: this.getSelectedRows()}}));
  }

  __appendTmplContent(targetSelector, model, rowIndex, columnTag) {
    const parent = this.shadowRoot.querySelector(targetSelector);
    const {root} = columnTag.stampTemplate(model) || {};
    if (root) {
      this.clearChildren(parent);
      parent.appendChild(root);
    }
  }

  clearChildren(parent) {
    while (parent.firstChild) {
      parent.firstChild.remove();
    }
  }

  isDataNotChanged(data) {
    return JSON.stringify(this.__tableData) === JSON.stringify(data);
  }

  __dataChanged(data = []) {
    if (this.__tableData && this.isDataNotChanged(data)) {
      return;
    }
    this.__tableData = data.slice();
    this.cacheTableData = data.slice();
    this.setThreeLeft();
    // 如果有点击排序，跳页后继续按照规则排好序
    if (this.sortingCache && this.sortingCache.direction) {
      const {sortType, sortEnum, direction, prop} = this.sortingCache;
      this.__sortMethod(sortType, sortEnum, direction, prop);
    }
    if (this.filterSelectedValue) {
      this.resetFilterClass();
    }
    //如果展开过，数据变化时关闭掉并清除内容，避免展示的数据混乱
    const expandRows = Array.from(this.shadowRoot.querySelectorAll('.row__expansion'));
    if (expandRows.length) {
      expandRows.forEach(fi => {
        fi.classList.add('row__expansion-hidden');
        if (fi.firstElementChild.hasChildNodes()) {
          const childNodes = fi.firstElementChild.childNodes;
          for (let i = childNodes.length - 1; i >= 0; i--) {
            fi.firstElementChild.removeChild(childNodes[i]);
          }
        }
      });
    }
  }

  resetFilterClass() {
    this.filterSelectedValue = '';
    this.shadowRoot.querySelectorAll('.table__filter__icon').forEach(fi => fi.classList.remove('filter-icon-selected'))
  }

  __calShowExpansion(columnMetas = []) {
    return columnMetas.some(meta => meta.type === 'expand');
  }

  isDisabledSelection(row) {
    if (!this.selectionFilter) return false;
    return !this.selectionFilter(row);
  }

  /**
   * 触发全选
   */
  selectAll() {
    this.__selectedState = true;
    this.__rowSelectionAll();
  }

  /**
   * 触发全不选
   */
  unSelectAll() {
    this.__selectedState = false;
    this.__rowSelectionAll();
  }

  /**
   * 获取选中的行
   * @return {any}
   */
  getSelectedRows() {
    return this.selectable ? (this.__tableData || []).filter(d => d.__selected) : [];
  }

  computeExpansion(row, rowIndex) {
    const column = (this.columnInfos || []).find(col => col.type === 'expand');
    if (column) {
      this.__appendTmplContent(`#row_${rowIndex}`, row, rowIndex, column);
    }
  }

  __generateRowContent(columns = [], row, rowIndex) {
    const fragment = document.createDocumentFragment();

    const tmpOpContainer = document.createElement('tr');
    tmpOpContainer.innerHTML = this.optional(this.selectable, `<td class="selectable"><paper-checkbox class="checkbox-item" noink ></paper-checkbox></td>`)
        + this.optional(this.__showExpansion, `<td class="expand-icon-td show-expansion"><iron-icon class="expand-icon" icon="icons:chevron-right"></iron-icon></td>`)
        + this.optional(this.showIndex, `<td class="show-index">${rowIndex + 1}</td>`);

    if (tmpOpContainer.hasChildNodes()) {
      fragment.append(...tmpOpContainer.querySelectorAll('td'));
      const checkbox = fragment.querySelector('paper-checkbox');
      if (checkbox) {

        this.isDisabledSelection(row) && checkbox.setAttribute("disabled", true);
        row.__selected && checkbox.setAttribute("checked", true)
        row.checkbox = checkbox;
        checkbox.addEventListener('change', (e) => this.__rowSelection(e, row, rowIndex));
      }
      const expandIcon = fragment.querySelector('iron-icon');
      expandIcon && expandIcon.addEventListener('click', (e) => {
        const iconIsOpen = Array.from(expandIcon.classList).includes('expand-icon_opened');
        if (!iconIsOpen && !this.shadowRoot.querySelector(`#row_${rowIndex}`).hasChildNodes()) {
          this.computeExpansion(this.__tableData[rowIndex], rowIndex);
        }
        this.__openExpanderHandler(e.currentTarget, rowIndex);
      });
    }
    columns.filter(column => column.type !== 'expand').forEach((column, columnIndex) => {
      const contentStyle = this.__getContentFixedStyle(columns, column);
      const columnFrag = document.createDocumentFragment();
      const tmpContainer = document.createElement('tr');

      tmpContainer.innerHTML = `
        <td style="${column.cellStyle || ''} ${contentStyle || ''} ${column.fixed === '' || column.fixed === 'right' ? this.setRowCustomStyle && this.setRowCustomStyle(row) : ''}" class="table__column table__column__${columnIndex} ${column.fixed === '' ? 'fixed-left' : ''} ${column.fixed === 'right' ? 'fixed-right' : ''}" role="${column.type}" id="row_${rowIndex}_column_${columnIndex}" aria-frozen="${column.frozen}">
          <div class="td_cell">
            <div class="table__cell"></div>
            <paper-tooltip position="top" animation-delay="10" offset="5" fit-to-visible-bounds></paper-tooltip>
          </div>
        </td>
      `;

      columnFrag.append(tmpContainer);

      let content = document.createDocumentFragment();
      let tip = document.createDocumentFragment();
      if (column.tmpl && column.type === 'operate') {
        content.append((column.stampTemplate(row) || {}).root);
      } else if (column.props) {
        const text = column.props.split(",").map(p => this.getValueByKey(row, p.trim())).join(column.separator || ',')
        content.append(text);
        tip.append(text);
      } else if (Function.prototype.isPrototypeOf(column.formatter)) {
        const text = column.formatter.call(this, this.getValueByKey(row, column.prop, column.defaultValue));
        content.append(text);
        tip.append(text);
      } else {
        const text = this.getValueByKey(row, column.prop, column.defaultValue);
        content.append(text);
        tip.append(text);
      }

      columnFrag.querySelector('.table__cell').append(content);
      columnFrag.querySelector('paper-tooltip').append(tip);
      fragment.appendChild(columnFrag.querySelector('td'));
    });

    //sticky布局导致z-index失效无法显示下拉框，原因未知（暂时解决方案：鼠标进入时动态添加z-index，移除时unset）
    const fixedRight = fragment.querySelector('.fixed-right');
    fixedRight && fixedRight.addEventListener('mouseenter', (e) => {
      const ele = e.path.find(fi => fi.className.includes('fixed-right'));
      ele.style.zIndex = 1000000;
    });
    fixedRight && fixedRight.addEventListener('mouseleave', (e) => {
      const ele = e.path.find(fi => fi.className.includes('fixed-right'));
      ele.style.zIndex = 'unset';
    });

    for (let i = 0, len = this.colspan - fragment.querySelectorAll('td').length; i < len; i++) {
      fragment.appendChild(document.createElement('td'));
    }

    setTimeout(() => {
      const parent = this.shadowRoot.querySelector(`#row_ctn_${rowIndex}`);
      if (parent) {
        this.clearChildren(parent);
        parent.appendChild(document.createElement('td'));
        const io = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting) {
            this.clearChildren(parent);
            parent.appendChild(fragment);
            io.disconnect();
          }
        })
        io.observe(parent);
      }
      this.setThreeLeft();
    }, 0);

  }

  setThreeLeft() {
    if (this.selectable) {
      const arr1 = Array.from(this.shadowRoot.querySelectorAll('.head-selectable')).filter(fi => !fi.style.left);
      const arr2 = Array.from(this.shadowRoot.querySelectorAll('.selectable')).filter(fi => !fi.style.left);
      arr1.forEach(fi => fi.style = this.__getSelectableStyle());
      arr2.forEach(fi => fi.style = this.__getSelectableStyle());
    }
    if (this.__showExpansion) {
      const arr = Array.from(this.shadowRoot.querySelectorAll('.show-expansion')).filter(fi => !fi.style.left)
      arr.forEach(fi => fi.style = this.__getShowExpansionStyle());
    }
    if (this.showIndex) {
      const arr = Array.from(this.shadowRoot.querySelectorAll('.show-index')).filter(fi => !fi.style.left)
      arr.forEach(fi => fi.style = this.__getShowIndexStyle());
    }
  }

  __getContentFixedStyle(columns, column) {
    const contentBodyWidth = this.shadowRoot.querySelector('#content-body').offsetWidth;
    let totalWidth = columns.map(mi => mi.width).reduce((pre, next) => pre + next, 0);
    if (this.selectable) totalWidth += 40;
    if (this.__showExpansion) totalWidth += 20;
    if (this.showIndex) totalWidth += 52;
    const percent = contentBodyWidth / totalWidth;
    let style = '', leftStyle = '', left = 0, rightStyle = '', right = 0;
    const leftArr = columns.filter(fi => fi.fixed === '');
    const leftFindIndex = leftArr.findIndex(fi => fi.label === column.label);
    const rightArr = columns.filter(fi => fi.fixed === 'right');
    const rightFindIndex = rightArr.findIndex(fi => fi.label === column.label);
    if (rightFindIndex !== -1) {
      for (let i = rightFindIndex + 1; i < rightArr.length; i++) {
        right += parseFloat(rightArr[i].width) * percent;
      }
      rightStyle = `right:${right}px;`;
      if (rightFindIndex != Object.keys(rightArr)[0]) {
        rightStyle += 'border-left:none;box-shadow:none;'
      }
      style = rightStyle;
    }
    if (leftFindIndex !== -1) {
      for (let i = leftFindIndex - 1; i >= 0; i--) {
        left += parseFloat(leftArr[i].width);
      }
      if (this.selectable) {
        left += 40;
      }
      if (this.__showExpansion) {
        left += 20;
      }
      if (this.showIndex) {
        left += 52;
      }
      leftStyle = `left:${left / totalWidth * 100}%;`;
      if (leftFindIndex != Object.keys(leftArr)[leftArr.length - 1]) {
        leftStyle += 'border-right:none;box-shadow:none;'
      }
      style = leftStyle;
    }
    return style;
  }


  connectedCallback() {
    super.connectedCallback();
    this.$.columnSlot.addEventListener('slotchange', e => {
      const columnInfos = e.target.assignedElements()
          .filter(_ => _.tagName.toLowerCase() === 'h2-table-column');
      const __tableFixed = columnInfos.filter(itm => itm.fixed === "" && itm.type !== 'expand');
      const __tableFixedRight = columnInfos.filter(itm => itm.fixed === "right" && itm.type !== 'expand');
      const columnInfosSort = __tableFixed.concat(columnInfos.filter(itm => __tableFixed.concat(__tableFixedRight).indexOf(itm) === -1)).concat(__tableFixedRight);
      this.set('columnInfos', columnInfosSort);
    });

    this.$.tableBody.addEventListener('scroll', () => {
      this.$.tableHeader.scrollLeft = this.$.tableBody.scrollLeft;
    });

    if (this.height) {
      this.set('tableBodyStyle', `overflow: auto; height: ${this.height - 68}px;`)
    }
  }

  selectableChanged(value) {
    if (!value) {
      const arr = Array.from(this.shadowRoot.querySelectorAll('.selectable'));
      arr.forEach(item => item.style.display = 'none');
    }
  }

  __getHeadFixedClass(column) {
    return column.fixed === 'right' || column.fixed === '' ? 'head-fixed' : '';
  }

  __getSelectableStyle() {
    return 'left:0px;';
  }

  __getShowExpansionStyle() {
    const contenBodyWidth = this.shadowRoot.querySelector('#content-body').offsetWidth;
    let totalWidth = this.columnInfos.map(mi => mi.width).reduce((pre, next) => pre + next, 0);
    if (this.selectable) totalWidth += 40;
    if (this.__showExpansion) totalWidth += 20;
    if (this.showIndex) totalWidth += 52;
    const percent = contenBodyWidth / totalWidth;
    if (this.selectable) {
      return `left:${40 / totalWidth * 100}%`;
    } else {
      return 'left:0px;'
    }
  }

  __getShowIndexStyle() {
    const contenBodyWidth = this.shadowRoot.querySelector('#content-body').offsetWidth;
    let totalWidth = this.columnInfos.map(mi => mi.width).reduce((pre, next) => pre + next, 0);
    if (this.selectable) totalWidth += 40;
    if (this.__showExpansion) totalWidth += 20;
    if (this.showIndex) totalWidth += 52;
    const percent = contenBodyWidth / totalWidth;
    if (this.selectable && !this.__showExpansion) {
      return `left:${40 / totalWidth * 100}%`;
    } else if (!this.selectable && this.__showExpansion) {
      return `left:${20 / totalWidth * 100}%;`
    } else if (this.selectable && this.__showExpansion) {
      return `left:${60 / totalWidth * 100}%;`
    } else {
      return 'left:0px;'
    }
  }


  __getFixedLeftStyle(column) {
    const contenBodyWidth = this.shadowRoot.querySelector('#content-body').offsetWidth;
    let totalWidth = this.columnInfos.map(mi => mi.width).reduce((pre, next) => pre + next, 0);
    if (this.selectable) totalWidth += 40;
    if (this.__showExpansion) totalWidth += 20;
    if (this.showIndex) totalWidth += 52;
    const percent = contenBodyWidth / totalWidth;
    const leftArr = this.columnInfos.filter(fi => fi.fixed === '');
    const leftFindIndex = leftArr.findIndex(fi => fi.label === column.label);
    if (leftFindIndex !== -1) {
      let left = 0;
      for (let i = leftFindIndex - 1; i >= 0; i--) {
        left += parseFloat(leftArr[i].width);
      }
      if (this.selectable) {
        left += 40;
      }
      if (this.__showExpansion) {
        left += 20;
      }
      if (this.showIndex) {
        left += 52;
      }
      return `left:${left / totalWidth * 100}%;`;
    } else {
      return '';
    }
  }

  __getFixedRightStyle(column) {
    const rightArr = this.columnInfos.filter(fi => fi.fixed === 'right');
    const rightFindIndex = rightArr.findIndex(fi => fi.label === column.label);
    if (rightFindIndex !== -1) {
      let right = 0;
      for (let i = rightFindIndex + 1; i < rightArr.length; i++) {
        right += parseFloat(rightArr[i].width);
      }
      return `right:${right}px;`;
    } else {
      return '';
    }
  }

  __rowClick({model: {rowIndex}}) {
    const rows = Array.from(this.shadowRoot.querySelectorAll('.table__row')).filter(fi => fi.style.display !== 'none');
    const childrens = Array.from(rows[rowIndex].children);
    const classList = new Set(childrens.map(mi => Array.from(mi.classList)).flat());
    if ([...classList].includes('row-high-light')) {
      childrens.forEach(fi => {
        fi.classList.remove('row-high-light');
      })
    } else {
      childrens.forEach(fi => {
        fi.classList.add('row-high-light');
      })
    }
  }

  __columnClick({model: {columnIndex}}) {
    const elements = Array.from(this.shadowRoot.querySelectorAll(`.table__column__${columnIndex}`));
    if (this.dblClickColumnIndexs.includes(columnIndex)) {
      elements.forEach(fi => fi.classList.remove('column-high-light'));
      this.dblClickColumnIndexs = this.dblClickColumnIndexs.filter(fi => fi !== columnIndex);
    } else {
      elements.forEach(fi => fi.classList.add('column-high-light'));
      this.dblClickColumnIndexs.push(columnIndex);
    }
  }

  __clickFilter({model: {column: {prop, filterEnum}, columnIndex}}) {
    let list = [];
    if (filterEnum) {
      const arr = this.cacheTableData.map(mi => mi[prop]).filter(fi => fi);
      list = filterEnum.filter(fi => arr.includes(fi.value));
      list.unshift({value: '全部', label: '全部'});
      this.filterList = list;
    } else {
      list = this.cacheTableData.map(mi => mi[prop]).filter(fi => fi);
      list.unshift('全部');
      list = Array.from(new Set(list));
      this.filterList = list.map((mi) => {
        return {value: mi, label: mi}
      });
    }

    const elements = this.shadowRoot.querySelectorAll('.table__filter__icon');
    const ele = [...elements].find(fi => [...fi.classList].includes('filter-icon-selected'));

    if (ele && ele.dataset.prop === prop) {
      this.filterSelectedValue = this.__tableData[0][prop];
    } else {
      this.filterSelectedValue = '全部';
    }

    this.filterProp = prop;
    this.$.dialogFilterList.open();
  }

  __filterValueSelected({detail: {value}}) {
    if (value) {
      this.filterSelectedValue = value;
      if (value === '全部') {
        this.__tableData = this.cacheTableData.slice();
      } else {
        this.__tableData = this.cacheTableData.filter(fi => fi[this.filterProp] === value);
      }

      this.$.dialogFilterList.close();
      this.changeFilterIconClass();
      this.resetSortClass();
    }

  }

  changeFilterIconClass() {
    const elements = this.shadowRoot.querySelectorAll('.table__filter__icon');
    elements.forEach(fi => fi.classList.remove('filter-icon-selected'));
    const ele = [...elements].find(fi => fi.dataset.prop === this.filterProp);
    if (this.filterSelectedValue !== '全部') {
      ele.classList.add('filter-icon-selected');
    } else {
      ele.classList.remove('filter-icon-selected');
    }
  }

  resetSortClass() {
    this.shadowRoot.querySelectorAll('.table__sort__icons').forEach(fi => fi.classList.remove('descending', 'ascending'));
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
        value: false,
        observer: 'selectableChanged'
      },

      radio: {
        type: Boolean,
        value: false
      },

      unsetHeadFixed: {
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
      sortingCache: Object,
      setRowCustomStyle: Function,
      filterList: Array,
      filterSelectedValue: String,
      cacheTableData: Array,
      filterProp: String,
      dblClickColumnIndexs: {
        type: Array,
        value: []
      }
    };
  }

  static get is() {
    return "h2-table";
  }
}

window.customElements.define(H2Table.is, H2Table);
