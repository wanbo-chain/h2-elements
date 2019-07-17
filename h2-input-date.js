/*
`h2-input-date`

Example:
```html
<h2-input-date class="input-date" label="日期"></h2-input-date>
<h2-input-date class="input-date" label="默认value" value="2017-10-26"></h2-input-date>
<h2-input-date class="input-date" label="默认time" timestamp="1509008130349"></h2-input-date>

```
## Styling

The following custom properties and mixins are available for styling:

|Custom property | Description | Default|
|----------------|-------------|----------|
|`--h2-input-date-label` | Mixin applied to the label of input | {}


*/
import {html, PolymerElement} from "@polymer/polymer";
import '@polymer/paper-dialog';
import './h2-grid-layout';
import './behaviors/h2-elements-shared-styles';
import {mixinBehaviors} from "@polymer/polymer/lib/legacy/class";
import {BaseBehavior} from "./behaviors/base-behavior";
import '@polymer/iron-icon';
import '@polymer/iron-icons';
import './h2-select';

/**
 * @customElement
 * @polymer
 * @demo demo/h2-input-date/index.html
 */
class H2InputDate extends mixinBehaviors([BaseBehavior], PolymerElement) {
  static get template() {
    return html`
    <style include="h2-elements-shared-styles">
      :host {
        display: flex;
        width: 380px;
        height: 34px;
        line-height: 34px;
        font-family: var(--h2-ui-font-family), sans-serif;
        font-size: var(--h2-ui-font-size);
      }
      
      :host([readonly]) input {
        cursor: default;
      }

      :host([required]) .input__container::before {
        content: "*";
        color: red;
        position: absolute;
        left: -10px;
        line-height: inherit;
      }
      
      :host([readonly]) .input__container {
        pointer-events: none;
        cursor: default;
      }

      :host([data-invalid]) .input__container {
        border-color: var(--h2-ui-color_pink)!important;
      }
      
      .input__container {
        flex: 1;
        display: flex;
        align-items: center;
        line-height: inherit;
        min-width: 0;
        border: 1px solid #ccc;
        border-radius: 4px;
        padding: 2px 5px;
        position: relative;
        cursor: pointer;
      }
      
      .date-range {
        width: 16px;
        height: 16px;
        color: #ccc;
      }
      
      .clear {
        width: 12px;
        padding: 0 5px;
        z-index: 1;
      }
      
      .icon-clear {
        width: 12px;
        height: 12px;
        border: 1px solid #ccc;
        border-radius: 50%;
        color: #ccc;
        display: none;
      }
      
      .input__container:hover .icon-clear {
        display: inline-block;
      }
      
      .separator {
        padding: 0 5px;
      }
      
      .item-date {
        flex: 1;
        padding: 0 5px;
        text-align: center;
      }
      
      .box-value {
        flex: 1;
        padding: 0 5px;
      }
      
      .item-date > span {
        width: 100%;
        color: #ccc;
      }
      
      #targetDate {
        position: absolute;
        bottom: -5px;
        left: 0;
        width: inherit;
      }
      
      #dateBox {
        position: absolute!important;
        width: 300px;
        height: auto;
        margin: 0;
      }
      
      .box-content {
        width: inherit;
        background-color: #fff;
      }
      
      .date-body {
        margin: 0;
        padding: 5px;
      }
      
      .box-datetime {
        display: flex;
        justify-content: space-around;
        align-items: center;
      }
      
      .datetime {
        padding: 0 6px;
        height: 26px;
        line-height: 26px;
        outline: none;
        border: 1px solid #f0f0f0;
        --h2-select-dropdown: {
          height: 200px;
        }
        --h2-select__container: {
          border: none;
        }
        --h2-select-tag: {
          background: #fff;
          border: none;
          /*line-height: 27px;*/
          padding: 0;
          color: var(--h2-ui-color_skyblue);
        }
        
        --h2-select-tag-deleter: {
          display: none;
        }
      }
      
      .date-header {
        display: flex;
        justify-content: space-around;
        font-size: 18px;
        height: 40px;
        align-items: center;
      }
      
      .chevron-iron {
        width: 30px;
        height: 30px;
        color: var(--h2-ui-color_skyblue);
      }
      
      .box-today {
        /*width: 24px;*/
        padding: 0 5px;
        height: 24px;
        font-size: 14px;
        line-height: 24px;
        text-align: center;
        color: var(--h2-ui-color_skyblue);
      }

            
      .date-content {
        width: 100%;
        padding: 5px;
        box-sizing: border-box;
        text-align: center;
      }
      
      .date-title {
        border-bottom: 1px solid #ccc;
        padding-bottom: 10px;
      }
      
      .item-day {
        margin: 5px 0;
        cursor: pointer;
      }
      
      .item-day:hover {
        color: var(--h2-ui-color_skyblue);
      }
      
      .item-day > div {
        padding: 5px;
        margin: 0 5px;
      }
      
      .currMonth {
        color: #ccc;
      }
      
      .item-y-m {
        margin: 15px;
        height: 36px;
        line-height: 36px;
      }
      
      .select-item {
        background-color: var(--h2-ui-color_skyblue);
        color: #fff;
        border-radius: 20px;
      }
      
      .select-range {
        background-color: var(--h2-ui-color_skyblue);
        color: #fff;
      }
      
      .select-start {
        padding-right: 10px!important;
        margin-right: 0!important;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }
      
      .select-end {
        padding-left: 10px!important;
        margin-left: 0!important;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
      
      .disabled {
        background-color: #f1f6fa;
        cursor: not-allowed;
        color: #000!important;
      }
      
      .disabled > div {
        pointer-events: none;
      }

    </style>
    <template is="dom-if" if="[[ toBoolean(label) ]]">
      <div class="h2-label">[[label]]</div>
    </template>
    <div class="input__container" on-click="openDialog">
      <iron-icon class="date-range" icon=icons:date-range></iron-icon>
      <template is="dom-if" if="[[ isOneOf(type, 'dateRange', 'datetimeRange') ]]">
        <div class="item-date">
          [[startDate]]
          <!--<template is="dom-if" if="[[ !toBoolean(startDate) ]]"><span>开始日期</span></template>-->
        </div>
        <div class="separator">至</div>
        <div class="item-date">
          [[endDate]]
          <!--<template is="dom-if" if="[[ !toBoolean(endDate) ]]"><span>结束日期</span></template>-->
        </div>
      </template>
      <template is="dom-if" if="[[ !isOneOf(type, 'dateRange', 'datetimeRange') ]]">
        <div class="box-value">[[value]]</div>
      </template>
      <template is="dom-if" if="[[ toBoolean(value) ]]">
        <div class="clear" on-click="clear"><iron-icon class="icon-clear" icon=icons:clear></iron-icon></div>
      </template>
      <div id="targetDate">
      </div>
    </div>
    
    <paper-dialog id="dateBox" no-auto-focus no-overlap horizontal-align="auto" vertical-align="auto">
      <div class="date-body">
        <template is="dom-if" if="[[ isEqual(type, 'datetimeRange') ]]">
          <div class="box-datetime">
            <h2-select class="datetime" items="[[startDateTimeList]]" value="{{startDate}}"></h2-select>
          </div>
          <div class="box-datetime">
            <h2-select class="datetime" items="[[endDateTimeList]]" value="{{endDate}}"></h2-select>
          </div>
        </template>
        <template is="dom-if" if="[[ isOneOf(type, 'datetime') ]]">
          <div class="box-datetime">
            <h2-select class="datetime" items="[[startDateTimeList]]" value="{{value}}"></h2-select>
          </div>
        </template>
        <div class="date-header">
          <div class="box-today" on-click="selectToday">今日</div>
          <div class="box-chevron">
            <iron-icon class="chevron-iron" icon="icons:chevron-left" on-click="yearMinus"></iron-icon>
            <span on-click="yearOpen">[[year]]年</span>
            <iron-icon class="chevron-iron" icon="icons:chevron-right" on-click="yearAdd"></iron-icon>
          </div>
          <div class="box-chevron">
            <iron-icon class="chevron-iron" icon="icons:chevron-left" on-click="monthMinus"></iron-icon>
            <span on-click="monthOpen">[[month]]月</span>
            <iron-icon class="chevron-iron" icon="icons:chevron-right" on-click="monthAdd"></iron-icon>
          </div>
        </div>
        <div class="date-content">
          <template is="dom-if" if="[[!showDashboard]]">
            <h2-grid-layout columns="7" column-gap="0" row-gap="0" class="day-layout">
              <div class="date-title">日</div>
              <div class="date-title">一</div>
              <div class="date-title">二</div>
              <div class="date-title">三</div>
              <div class="date-title">四</div>
              <div class="date-title">五</div>
              <div class="date-title">六</div>
              <template is="dom-repeat" items="[[dayList]]">
                <div class$="[[optionalClass(item)]]">
                  <div class$="[[selectDate(item)]]" on-click="selectDay">[[item.date]]</div>
                </div>
              </template>
            </h2-grid-layout>
          </template>
          <template is="dom-if" if="[[showDashboard]]">
            <h2-grid-layout columns="3" column-gap="0" row-gap="0">
              <template is="dom-repeat" items="[[yearList]]">
                <template is="dom-if" if="[[isOneOf(item, year, month)]]">
                  <div class="item-y-m select-item" on-click="selectYearOrMonth">[[item]]</div>
                </template>
                <template is="dom-if" if="[[!isOneOf(item, year, month)]]">
                  <div class$="[[optionalClassYM(item)]]">
                    <div on-click="selectYearOrMonth">[[item]]</div>
                  </div>
                </template>
              </template>
            </h2-grid-layout>
          </template>
        </div>
      </div>
    </paper-dialog>
`;
  }

  static get properties() {
    return {
      /**
       * The value of the input, return a date string format to `yyyy-MM-dd`.
       * @type {string}
       */
      value: {
        type: String,
        notify: true
      },
      /**
       * The timestamp of the date selected.
       * @type {number}
       */
      timestamp: {
        type: Number,
        notify: true
      },
      /**
       * The label of the input.
       */
      label: {
        type: String
      },
      /**
       * The placeholder of the input.
       */
      placeholder: {
        type: String
      },
      /**
       * Set to true, if the input is required.
       * @type {boolean}
       * @default false
       */
      required: {
        type: Boolean,
        value: false
      },
      /**
       * Set to true, if the input is readonly.
       * @type {boolean}
       * @default false
       */
      readonly: {
        type: Boolean,
        value: false
      },
      /**
       * The minimum date which can be chosen. It should be a string format to `yyyy-MM-dd`.
       * @type {string}
       */
      min: {
        type: String
      },
      /**
       * The maximum date which can be chosen. It should be a string format to `yyyy-MM-dd`.
       * @type {string}
       */
      max: {
        type: String
      },
      dayList: Array,
      yearList: Array,
      year: Number,
      month: Number,
      date: Number,
      showDashboard: {
        type: Boolean,
        value: false
      },
      type: {
        type: String,
        value: 'date'
      },
      rangeList: {
        type: Array,
        value: ['dateRange', 'datetimeRange']
      },
      startDate: String,
      endDate: String,
      startDateTimeList: Array,
      endDateTimeList: Array,
      stepTime: {
        type: Number,
        value: 30
      }
    };
  }

  static get is() {
    return "h2-input-date";
  }

  static get observers() {
    return [
      '__refreshUIState(required)',
      '_valueChanged(value)',
      '_timestampChanged(timestamp)'
    ];
  }

  ready() {
    super.ready();
    if (this.startDate && this.endDate) {
      this.getTimeList(this.startDate, 'start');
      this.getTimeList(this.endDate, 'end');
      this.set('value', `${this.startDate},${this.endDate}`)
    }
  };
  /**
   * @param value
   * @private
   */
  _valueChanged(value) {
    this.__refreshUIState();
    if (!this.value && !this.rangeList.includes(this.type)) {
      this.set("timestamp", undefined);
      return;
    }
    if (!this.rangeList.includes(this.type)) {
      let time = new Date(`${value}${this.type === 'date' && value.indexOf(':') > -1 ? ' 00:00:00' : ''}`).getTime();
      this.set("timestamp", time);
    }
    // if (value && this.rangeList.includes(this.type)) {
      // let time = new Date(`${value}${this.type === 'date' && value.indexOf(':') > -1 ? ' 00:00:00' : ''}`).getTime();
      // this.set("timestamp", time);
    // }
    //   console.log(value, 99991203);
    //   const arr = value.split(',');
    //   this.set('startDate', arr[0]);
    //   this.set('endDate', arr[1]);
    // } else if (this.rangeList.includes(this.type) && !value) {
      // this.set('startDate', '');
      // this.set('endDate', '');
    // }
    this.getDayList();
  }

  __refreshUIState() {
    if (!this.validate()) {
      this.setAttribute("data-invalid", "");
    } else {
      this.removeAttribute("data-invalid");
    }
  }

  /**
   * @param time
   * @private
   */
  _timestampChanged(time) {
    if (!time) {
      if (!this.rangeList.includes(this.type)) this.set("value", undefined);
      return;
    }
    const date = new Date(time);
    let value = `${date.getFullYear()}-${this._preReplenish(date.getMonth() + 1, 2, "0")}-${this._preReplenish(date.getDate(), 2, "0")}`;
    if (this.type.includes('time')) value += ` ${this.getTime(date)}`;
    if (!this.rangeList.includes(this.type)) {
      if (this.type === 'datetime') this.getTimeList(value, 'start');
      this.set("value", value);
      if (this.type !== 'datetime') this.$.dateBox.close();
      return
    }
    if (this.rangeList.includes(this.type) && !this.startDate) {
      this.getTimeList(value, 'start');
      this.set('startDate', value);
      return
    }
    if (this.rangeList.includes(this.type) && this.startDate) {
      const timestamp = new Date(this.startDate.indexOf(':') > -1 ? this.startDate : this.startDate + ' 00:00');
      if (time >= timestamp) {
        this.getTimeList(value, 'end');
        this.set('endDate', value)
      } else {
        this.getTimeList(this.startDate, 'end');
        this.getTimeList(value, 'start');
        this.set('endDate', this.startDate);
        this.set('startDate', value);
      }
      this.set('value', `${this.startDate},${this.endDate}`);
      if (this.type !== 'datetimeRange') this.$.dateBox.close();
      if (this.rangeList.includes(this.type) && this.value) {
        this.getDayList();
      }
    }
  }

  getTime(date) {
    return `${this._preReplenish(date.getHours(), 2, '0')}:${this._preReplenish(date.getMinutes(), 2, '0')}:${this._preReplenish(date.getSeconds(), 2, '0')}`
  }

  getTimeList(date, type) {
    const listLength = 24 / (this.stepTime / 60);
    let startDateTimeList = [];
    for (let i = 0; i < listLength; i++) {
      const datetime = new Date(0, 0, 0, 0, i * this.stepTime);
      const value = `${date.split(' ')[0]} ${this.getTime(datetime)}`;
      startDateTimeList.push({value, label: value})
    }
    this.set(`${type}DateTimeList`, startDateTimeList);
  }

  clear(e) {
    e.stopPropagation();
    this.value = '';
  }

  /*
  * 单个日期class控制
  * */
  selectDate(item) {
    let classStr = item.select ? 'select-item' : '';
    classStr += this.value && item.position === 'start' ? ' select-start' : '';
    classStr += this.value && item.position === 'end' ? ' select-end' : '';
    return classStr;
  }

  optionalClass(item) {
    let str = item.currMonth ? 'item-day' : 'item-day currMonth';
    str += item.disabled ? ' disabled' : '';
    str += item.select && this.rangeList.includes(this.type) && this.value && item.position !== 'start' && item.position !== 'end' && item.position !== 'all' ? ' select-range' : '';
    return str;
  }

  /**
   * 前置填充
   * @param {*} str
   * @param {number} totalLen 填充后的长度
   * @param {string} replenisher 填充的字符
   */
  _preReplenish(str, totalLen = 0, replenisher = "") {
    return `${String(replenisher).repeat(Number(totalLen) - String(str).length)}${String(str)}`;
  }

  /**
   * Set focus to input.
   */
  doFocus() {
    this.$.input.doFocus();
  }

  openDialog() {
    this.$.dateBox.positionTarget = this.$.targetDate;
    const date = this.value && !this.rangeList.includes(this.type) ? new Date(this.value) : this.value && this.rangeList.includes(this.type) ? new Date(this.startDate) : this.min ? new Date(this.min) : this.max ? new Date(this.max) : new Date();
    this.year = date.getFullYear();
    this.month =  date.getMonth() + 1;
    this.date = date.getDate();
    this.getDayList();
    this.$.dateBox.open();
  }

  yearOpen() {
    let yearList = [];
    const year = this.year;
    for (let i = year - 5, max = year + 6; i <= max; i++) {
      yearList.push(i);
    }
    this.set('yearList', yearList);
    this.set('showDashboard', true);
  }

  monthOpen() {
    this.set('yearList', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    this.set('showDashboard', true);
  }

  getDayList() {
    const totalDays = new Date(this.year, this.month, 0).getDate();
    const min = 1 - (new Date(this.year, this.month - 1, 1).getDay() || 7);
    const max = min + 42;
    this.dayList = [];
    let minTimestamp, maxTimestamp, startDate, endDate;
    if (this.min)  minTimestamp = new Date(this.min).getTime();
    if (this.max) maxTimestamp = new Date(this.max).getTime();
    if (this.startDate) startDate = new Date(this.startDate.indexOf(':') > -1 ? this.startDate : this.startDate + ' 00:00');
    if (this.endDate) endDate = new Date(this.endDate.indexOf(':') > -1 ? this.endDate : this.endDate + ' 00:00');
    for (let i = min; i < max; i++) {
      const obj = new Date(this.year, this.month - 1, i);
      const startObj = new Date(this.year, this.month - 1, i + 1) - 1;
      const currMonth = i > 0 && i <= totalDays;
      const select = (!this.rangeList.includes(this.type) && obj.getDate() === this.date && this.value && currMonth) || (this.rangeList.includes(this.type) && this.value && startDate <= startObj && endDate >= obj);
      this.push('dayList', {
        date: obj.getDate(),
        currMonth,
        select,
        disabled: minTimestamp > obj.getTime() || maxTimestamp < obj.getTime()
      })
    }
    if (this.value && this.rangeList.includes(this.type)) {
      const dayList = this.dayList.slice();
      const startIndex = dayList.findIndex(val => val.select);
      const endIndex = dayList.length - 1 - dayList.reverse().findIndex(val => val.select);
      if (startIndex === endIndex) {
        this.set(`dayList.${startIndex}`, Object.assign({position: 'all'}, this.dayList[startIndex]));
        return;
      }
      this.set(`dayList.${startIndex}`, Object.assign({position: 'start'}, this.dayList[startIndex]));
      this.set(`dayList.${endIndex}`, Object.assign({position: 'end'}, this.dayList[endIndex]));
    }
  }

  yearMinus() {
    const min = this.min ? this.min.split('-')[0] : 1970;
    this.year > min && this.year--;
    if (this.showDashboard && this.yearList[0] > this.year) this.yearOpen();
    this.showDashboard = false;
    this.getDayList();
  }

  yearAdd() {
    const max = this.max ? this.max.split('-')[0] : 9999;
    this.year < max && this.year++;
    if (this.showDashboard && this.yearList[11] < this.year) this.yearOpen();
    this.showDashboard = false;
    this.getDayList();
  }

  optionalClassYM(item) {
    let str = 'item-y-m';
    if (this.min) {
      console.log(this.year, 12333, this.year >= this.min.split('-')[0]);
      str += item <= 12 && item < this.min.split('-')[1] && this.year <= this.min.split('-')[0] ? ' disabled' : '';
      str += item > 12 && item < this.min.split('-')[0] ? ' disabled' : '';
    }
    if (this.max) {
      str += item <= 12 && item > this.max.split('-')[1] && this.year >= this.max.split('-')[0] ? ' disabled' : '';
      str += item > 12 && item > this.max.split('-')[0] ? ' disabled' : '';
    }
    return str;
  }

  monthMinus() {
    const min = this.min ? this.min.split('-')[1] : 0;
    if (this.month === 1 && !this.min) {
      this.month = 12;
      this.yearMinus();
    } else {
      this.month > min && this.month--;
      this.getDayList();
    }
  }

  monthAdd() {
    const max = this.max ? this.max.split('-')[1] : 13;
    if (this.month === 12 && !this.max) {
      this.month = 1;
      this.yearAdd();
    } else {
      this.month < max && this.month++;
      this.getDayList();
    }
  }

  selectDay({model: {item, index}}) {
    if (this.rangeList.includes(this.type) && this.value) {
      this.set('value', '');
      this.set('startDate', '');
      this.set('endDate', '');
      this.getDayList();
    }
    if (!this.rangeList.includes(this.type)) {
      const findIndex = this.dayList.findIndex(val => val.select);
      if (findIndex > -1) this.set(`dayList.${findIndex}`, Object.assign({}, item, {select: false}));
    }
    this.set(`dayList.${index}`, Object.assign({}, item, {select: true}));
    this.date = item.date;
    const month = item.currMonth ? this.month - 1 : item.date >= 24 ? this.month - 2 : this.month;
    if (!this.rangeList.includes(this.type) && !item.currMonth) {
      item.date >= 24 ? this.monthMinus() : this.monthAdd();
    }
    const timestamp = new Date(this.year, month, this.date).getTime();
    if (this.rangeList.includes(this.type) && timestamp === this.timestamp) this._timestampChanged(timestamp);
    this.set('timestamp', timestamp);
  }

  selectYearOrMonth({model: {item}}) {
    this[item <= 12 ? 'month' : 'year'] = item;
    if (this.min && item <= 12) {
      if (this.month < this.min.split('-')[1] && this.year <= this.min.split('-')[0]) this.month = this.min.split('-')[1];
    }
    if (this.max && item <= 12) {
      if (this.month > this.max.split('-')[1] && this.year >= this.max.split('-')[0]) this.month = this.max.split('-')[1];
    }
    this.getDayList();
    this.showDashboard = false;
  }

  selectToday() {
    const date = new Date();
    this.year = date.getFullYear();
    this.month = date.getMonth() + 1;
    this.date = date.getDate();
    this.timestamp = new Date(this.year, this.month - 1, this.date).getTime();
    if (!this.rangeList.includes(this.type)) this.$.dateBox.close();
  }

  /**
   * Validates the input element.
   *
   * First check the iron-input.validate(),
   * Then if required = true check (value != undefined && value !== '')
   * And if allowPattern is defined , use the regexp to test the value
   *
   * @returns {boolean}
   */
  validate() {
    return this.required ? this.value && this.value.length > 0 : true;
  }
}

window.customElements.define(H2InputDate.is, H2InputDate);
