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
        min-width: 200px;
        border: 1px solid #ccc;
        border-radius: 4px;
        padding: 2px 5px;
        position: relative;
        cursor: pointer;
      }
      
      :host([type='dateRange']) .input__container {
        min-width: 300px;
        box-sizing: border-box;
      }
      
      :host([type='datetimeRange']) .input__container {
        min-width: 360px;
        box-sizing: border-box;
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
      
      .item-date > span, .box-value > span {
        width: 100%;
        color: #999;
      }
      
      #targetDate {
        position: absolute;
        bottom: -5px;
        left: 0;
        width: inherit;
      }
      
      #dateBox {
        border-radius: 4px;
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
        padding: 0 5px;
        height: 24px;
        font-size: 14px;
        line-height: 24px;
        text-align: center;
        cursor: pointer;
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
          <template is="dom-if" if="[[ !isExistTruthy(startDate, startTimestamp) ]]"><span>开始日期</span></template>
          <template is="dom-if" if="[[ isExistTruthy(startDate, startTimestamp) ]]">{{startDate}}</template>
        </div>
        <div class="separator">至</div>
        <div class="item-date">
          <template is="dom-if" if="[[ !isExistTruthy(endDate, endTimestamp) ]]"><span>结束日期</span></template>
          <template is="dom-if" if="[[ isExistTruthy(endDate, endTimestamp) ]]">{{endDate}}</template>
        </div>
      </template>
      <template is="dom-if" if="[[ !isOneOf(type, 'dateRange', 'datetimeRange') ]]">
        <div class="box-value">
          <template is="dom-if" if="[[ !isExistTruthy(value, timestamp) ]]"><span>选择日期</span></template>
          <template is="dom-if" if="[[ isExistTruthy(value, timestamp) ]]">[[value]]</template>
        </div>
      </template>
      <div class="clear">
        <template is="dom-if" if="[[ isExistTruthy(value, timestamp, startDate, endDate, startTimestamp, endTimestamp) ]]">
          <iron-icon class="icon-clear" icon=icons:clear on-click="clear"></iron-icon>
        </template>
      </div>
      <div id="targetDate">
      </div>
    </div>
    
    <paper-dialog id="dateBox" no-auto-focus no-overlap horizontal-align="auto" vertical-align="auto">
      <div class="date-body">
        <template is="dom-if" if="[[ isEqual(type, 'datetimeRange') ]]">
          <div class="box-datetime">
            <h2-select class="datetime" placeholder="开始日期时间" items="[[startDateTimeList]]" value="{{startDate}}"></h2-select>
          </div>
          <div class="box-datetime">
            <h2-select class="datetime" placeholder="结束日期时间" items="[[endDateTimeList]]" value="{{endDate}}"></h2-select>
          </div>
        </template>
        <template is="dom-if" if="[[ isOneOf(type, 'datetime') ]]">
          <div class="box-datetime">
            <h2-select class="datetime" placeholder="选择日期时间" items="[[startDateTimeList]]" value="{{value}}"></h2-select>
          </div>
        </template>
        <div class="date-header">
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
          <div class="box-today" on-click="selectToday">今日</div>
        </div>
        <div class="date-content">
          <template is="dom-if" if="[[!isOneOf(showDashboard, 'year', 'month')]]">
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
          <template is="dom-if" if="[[isOneOf(showDashboard, 'year', 'month')]]">
            <h2-grid-layout columns="3" column-gap="0" row-gap="0">
              <template is="dom-repeat" items="[[yearList]]">
                <div class$="[[optionalClassYM(item, year, month)]]">
                  <div on-click="selectYearOrMonth">[[item]]</div>
                </div>
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
        type: String,
        value: ''
      },
      type: {
        type: String,
        value: 'date',
        reflectToAttribute: true
      },
      rangeList: {
        type: Array,
        value: ['dateRange', 'datetimeRange']
      },
      startDate: {
        type: String,
        notify: true
      },
      startTimestamp: {
        type: Number,
        notify: true
      },
      endDate: {
        type: String,
        notify: true
      },
      endTimestamp: {
        type: Number,
        notify: true
      },
      startDateTimeList: Array,
      endDateTimeList: Array,
      stepTime: {
        type: Number,
        value: 30
      },
      startTime: {
        type: String,
        value: '00:00:00'
      },
      endTime: {
        type: String,
        value: '23:30:00'
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
      '_timestampChanged(timestamp)',
      '_startDateChanged(startDate)',
      '_endDateChanged(endDate)',
      '_startTimestampChanged(startTimestamp)',
      '_endTimestampChanged(endTimestamp)',
      '_minmaxChanged(min, max)'
    ];
  }
  
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
      let time = new Date(`${value}${this.type.includes('time') ? '' : ' 00:00:00'}`).getTime();
      this.set("timestamp", time);
    }
    this.getDayList();
  }
  
  _minmaxChanged() {
    this.__refreshUIState();
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
    let value = this._getTimestampToDate(time);
    
    if (this.type === 'datetime') this.getTimeList(value, 'start');
    this.set("value", value);
    
  }
  
  _getTimestampToDate(timestamp) {
    const date = new Date(timestamp);
    let value = this._getTimestampTo(timestamp);
    if (this.type.includes('time')) value += ` ${this.getTime(date)}`;
    return value;
  }
  
  _getTimestampTo(timestamp) {
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${this._preReplenish(date.getMonth() + 1, 2, "0")}-${this._preReplenish(date.getDate(), 2, "0")}`;
  }
  
  _startDateChanged(startDate) {
    if (!startDate) return;
    this.getTimeList(startDate, 'start');
    let time = new Date(`${startDate}${this.type.includes('time') ? '' : ' 00:00:00'}`).getTime();
    this.set("startTimestamp", time);
  }
  
  _endDateChanged(endDate) {
    this.__refreshUIState();
    if (!endDate) return;
    this.getTimeList(endDate, 'end');
    let time = new Date(`${endDate}${this.type.includes('time') ? '' : ' 23:59:59:999'}`).getTime();
    this.set("endTimestamp", time);
    this.getDayList();
  }
  
  _startTimestampChanged(startTimestamp) {
    if (!startTimestamp) {
      this.set("startDate", undefined);
      return;
    }
    let value = this._getTimestampToDate(startTimestamp);
    this.getTimeList(value, 'start');
    if (this.type.includes('time')) value = this.startDateTimeList.find(item => item.timestamp >= startTimestamp).value;
    this.set('startDate', value);
  }
  
  _endTimestampChanged(endTimestamp) {
    this.__refreshUIState();
    if (!endTimestamp) {
      this.set("endDate", undefined);
      return;
    }
    let value = this._getTimestampToDate(endTimestamp);
    this.getTimeList(value, 'end');
    if (this.type.includes('time')) value = this.endDateTimeList.find(item => item.timestamp >= endTimestamp).value;
    this.set('endDate', value);
    if (this.type !== 'datetimeRange') this.$.dateBox.close();
  }
  
  getTime(date) {
    return `${this._preReplenish(date.getHours(), 2, '0')}:${this._preReplenish(date.getMinutes(), 2, '0')}:${this._preReplenish(date.getSeconds(), 2, '0')}`
  }
  
  getTimeList(date, type) {
    const endTimeArr = this.endTime.split(':');
    const listLength = !this.type.includes('time') ? 24 / (this.stepTime / 60) : Math.ceil((endTimeArr[0] * 60 + +endTimeArr[1] + (+endTimeArr[2] / 60)) / this.stepTime);
    const startTimeArr = this.startTime.split(':');
    const timeI = !this.type.includes('time') ? 0 : Math.floor((startTimeArr[0] * 60 + +startTimeArr[1] + (+startTimeArr[2] / 60)) / this.stepTime);
    let startDateTimeList = [];
    for (let i = timeI; i <= listLength; i++) {
      const datetime = new Date(0, 0, 0, 0, i * this.stepTime);
      const value = `${date.split(' ')[0]} ${this.getTime(datetime)}`;
      const timestamp = new Date(value).getTime();
      startDateTimeList.push({value, label: value, timestamp})
    }
    this.set(`${type}DateTimeList`, startDateTimeList);
  }
  
  clear(e) {
    e.stopPropagation();
    if (this.rangeList.includes(this.type)) {
      this.startDate = null;
      this.endDate = null;
      this.startTimestamp = null;
      this.endTimestamp = null;
    }
    this.value = '';
  }
  
  /*
  * 单个日期class控制
  * */
  selectDate(item) {
    let classStr = item.select ? 'select-item' : '';
    classStr += this.startDate && item.position === 'start' ? ' select-start' : '';
    classStr += this.endDate && item.position === 'end' ? ' select-end' : '';
    return classStr;
  }
  
  optionalClass(item) {
    let str = item.currMonth ? 'item-day' : 'item-day currMonth';
    str += item.disabled ? ' disabled' : '';
    str += item.select && this.rangeList.includes(this.type) && this.startDate && this.endDate && item.position !== 'start' && item.position !== 'end' && item.position !== 'all' ? ' select-range' : '';
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
    const date = this.value && !this.rangeList.includes(this.type) ? new Date(this.value) : (this.startDate && this.endDate) && this.rangeList.includes(this.type) ? new Date(this.startDate) : this.min ? new Date(this.min) : this.max ? new Date(this.max) : new Date();
    this.year = date.getFullYear();
    this.month = date.getMonth() + 1;
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
    this.set('showDashboard', 'year');
    this.set('yearList', yearList);
  }
  
  monthOpen() {
    this.set('showDashboard', 'month');
    if (this.min) {
      if (this.month < this.min.split('-')[1] && this.year <= this.min.split('-')[0]) this.month = this.min.split('-')[1];
    }
    if (this.max) {
      if (this.month > this.max.split('-')[1] && this.year >= this.max.split('-')[0]) this.month = this.max.split('-')[1];
    }
    this.set('yearList', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  }
  
  getDayList() {
    const totalDays = new Date(this.year, this.month, 0).getDate();
    const min = 1 - (new Date(this.year, this.month - 1, 1).getDay() || 7);
    const max = min + 42;
    this.dayList = [];
    let minTimestamp, maxTimestamp, startDate, endDate;
    if (this.min) minTimestamp = new Date(this.min).getTime();
    if (this.max) maxTimestamp = new Date(this.max).getTime();
    if (this.startDate) startDate = new Date(this.startDate.indexOf(':') > -1 ? this.startDate : this.startDate + ' 00:00');
    if (this.endDate) endDate = new Date(this.endDate.indexOf(':') > -1 ? this.endDate : this.endDate + ' 00:00');
    const days = [];
    for (let i = min; i < max; i++) {
      const obj = new Date(this.year, this.month - 1, i);
      const startObj = new Date(this.year, this.month - 1, i + 1) - 1;
      const currMonth = i > 0 && i <= totalDays;
      let select = !this.rangeList.includes(this.type) ? obj.getDate() === this.date && this.value && currMonth : (this.startDate && startDate <= startObj && this.endDate && endDate >= obj);
      days.push({
        date: obj.getDate(),
        currMonth,
        select,
        disabled: minTimestamp > obj.getTime() || maxTimestamp < obj.getTime()
      });
    }
    
    this.set('dayList', days);
    
    if (this.startDate && this.endDate && this.rangeList.includes(this.type)) {
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
    if (this.showDashboard === 'year' && this.yearList[0] > this.year) this.yearOpen();
    if (!this.showDashboard) this.getDayList();
  }
  
  yearAdd() {
    const max = this.max ? this.max.split('-')[0] : 9999;
    this.year < max && this.year++;
    if (this.showDashboard === 'year' && this.yearList[11] < this.year) this.yearOpen();
    if (!this.showDashboard) this.getDayList();
  }
  
  optionalClassYM(item, year, month) {
    let str = 'item-y-m';
    if (this.min) {
      str += item <= 12 && item < this.min.split('-')[1] && this.year <= this.min.split('-')[0] ? ' disabled' : '';
      str += item > 12 && item < this.min.split('-')[0] ? ' disabled' : '';
    }
    if (this.max) {
      str += item <= 12 && item > this.max.split('-')[1] && this.year >= this.max.split('-')[0] ? ' disabled' : '';
      str += item > 12 && item > this.max.split('-')[0] ? ' disabled' : '';
    }
    str += item === year || item === month ? ' select-item' : '';
    return str;
  }
  
  monthMinus() {
    const min = this.min ? this.min.split('-')[1] : 0;
    if (this.month === 1) {
      this.month = 12;
      this.yearMinus();
    } else if (this.month > min || (this.min && this.year > this.min.split('-')[0])) {
      this.month--;
      this.getDayList();
    }
  }
  
  monthAdd() {
    const max = this.max ? this.max.split('-')[1] : 13;
    if (this.month === 12) {
      this.month = 1;
      this.yearAdd();
    } else if (this.month < max || (this.max && this.year < this.max.split('-')[0])) {
      this.month++;
      this.getDayList();
    }
  }
  
  selectDay({model: {item, index}}) {
    this.clearDate();
    if (!this.rangeList.includes(this.type)) {
      const findIndex = this.dayList.findIndex(val => val.select);
      if (findIndex > -1) this.set(`dayList.${findIndex}`, Object.assign({}, item, {select: false}));
    }
    this.set(`dayList.${index}`, Object.assign({}, item, {select: true}));
    this.date = item.date;
    const month = item.currMonth ? this.month - 1 : item.date >= 24 ? this.month - 2 : this.month;
  
    const transientDate = this._getTimestampTo(new Date(this.year, month, this.date));
    // const timestamp = new Date(this.year, month, this.date).getTime();
    this.setTimestamp(transientDate);
    
    if (!this.rangeList.includes(this.type) && !item.currMonth) {
      item.date >= 24 ? this.monthMinus() : this.monthAdd();
    }
  }
  
  clearDate() {
    if (this.rangeList.includes(this.type) && (this.startDate && this.endDate)) {
      this.set('startDate', undefined);
      this.set('endDate', undefined);
      this.set('startTimestamp', undefined);
      this.set('endTimestamp', undefined);
      this.getDayList();
    }
  }
  
  selectYearOrMonth({model: {item}}) {
    this[this.showDashboard] = item;
    if (this.showDashboard === 'year') {
      this.monthOpen();
      return
    }
    if (this.showDashboard === 'month') {
      this.showDashboard = '';
      this.getDayList();
    }
    
  }
  
  selectToday() {
    this.clearDate();
    const date = new Date();
    this.year = date.getFullYear();
    this.month = date.getMonth() + 1;
    this.date = date.getDate();
    this.getDayList();
    const index = this.dayList.findIndex(val => val.date === this.date && val.currMonth);
    this.set(`dayList.${index}`, Object.assign({}, this.dayList[index], {select: true}));
    // const timestamp = new Date(this.year, this.month - 1, this.date).getTime();
    const transientDate = this._getTimestampTo(new Date(this.year, this.month - 1, this.date));
    this.setTimestamp(transientDate);
  }
  
  // 赋值
  setTimestamp(date) {
    let timestamp;
    // 判断日期时间选择是否为选择范围，是赋值给timestamp
    if (!this.rangeList.includes(this.type)) {
      timestamp = new Date(date).getTime();
      this.set('timestamp', timestamp);
      if (!this.type.includes('time')) this.$.dateBox.close();
    } else {
      if ((this.startTimestamp && this.endTimestamp) || (!this.startTimestamp && !this.endTimestamp)) {
        timestamp = (this.type.includes('time') ? new Date(date + ` ${this.startTime}`) : new Date(date + ` 00:00:00`)).getTime();
        this.set('startTimestamp', timestamp);
        this.set('endTimestamp', null);
      } else {
        // 先判断选择第二个时间是否早于第一个
        let endTimestamp;
        timestamp = (this.type.includes('time') ? new Date(date + ` ${this.endTime}`) : new Date(date + ` 00:00:00`)).getTime();
        if (this.startTimestamp >= timestamp) {
          endTimestamp = this.type.includes('time') ? this.startTimestamp : (this.startTimestamp + 86400000 - 1);
          this.set('startTimestamp', timestamp);
          this.set('endTimestamp', endTimestamp);
        } else {
          endTimestamp = this.type.includes('time') ? timestamp : (timestamp + 86400000 - 1);
          this.set('endTimestamp', endTimestamp);
        }
      }
    }
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
    let validate = !this.rangeList.includes(this.type) ? this.value && this.value.length > 0 : (this.startDate && this.endDate) || (this.startTimestamp && this.endTimestamp);
    if (this.min) {
      const minTimestamp = new Date(`${this.min}${this.type.includes('time') ? '' : ' 00:00:00:000'}`).getTime();
      validate = validate && (!this.rangeList.includes(this.type) ? minTimestamp < this.timestamp : minTimestamp < this.startTimestamp);
    }
    if (this.max) {
      const maxTimestamp = new Date(`${this.max}${this.type.includes('time') ? '' : ' 23:59:59:999'}`).getTime();
      validate = validate && (!this.rangeList.includes(this.type) ? maxTimestamp > this.timestamp : maxTimestamp > this.endTimestamp);
    }
    return this.required ? validate : true;
  }
}

window.customElements.define(H2InputDate.is, H2InputDate);
