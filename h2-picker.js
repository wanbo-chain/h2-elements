import {html, PolymerElement} from "@polymer/polymer";
import {mixinBehaviors} from "@polymer/polymer/lib/legacy/class";
import '@polymer/iron-icon/iron-icon';
import '@polymer/iron-icons/iron-icons';

import {BaseBehavior} from "./behaviors/base-behavior";
import './behaviors/h2-elements-shared-styles.js';
import {H2Fetch} from './h2-fetch';
import {CacheSearchUtil} from './utils/cacheSearchUtil'


import {PinyinUtil} from './utils/pinyinUtil';
import throttle from 'lodash-es/throttle';


/**
 * @customElement
 * @polymer
 * @demo demo/h2-picker/index.html
 */
class H2Picker extends mixinBehaviors([BaseBehavior], PolymerElement) {
  static get template() {
    return html`
    <style include="h2-elements-shared-styles">
      :host {
        display: flex;
        height: 32px;
        line-height: 32px;
        width: var(--h2-picker-width, 300px);
        font-family: var(--h2-ui-font-family), sans-serif;
        font-size: var(--h2-ui-font-size);
        position: relative;
        box-sizing: border-box;
      }

      .input-wrap {
        flex: 1;
        position: relative;
        display: flex;
      }

      .input-container {
        flex: 1;
        display: flex;
        width: 100%;
      }

      #keywordInput {
        flex: 1;
        min-width: 10px;
        font-size: 14px;
        height: 22px;
        line-height: 22px;
        padding: 0;
        margin: 2px;

        border: none;
        outline: none;
        @apply --h2-picker-input;
      }

      /*标签容器*/
      .tags-input {
        flex: 1;

        display: flex;
        flex-wrap: wrap;
        align-content: flex-start;

        background: #FFF;
        padding: 2px;
        overflow-y: auto;

        border: 1px solid #CCC;
        border-radius: 4px;
        
      }
      
      .tags-input::-webkit-scrollbar {
        display: none;
      }
      
      .tag {
        color: #fff;
        background: var(--h2-ui-bg);
        border-radius: 4px;

        margin: 2px;
        padding: 0 4px;
        height: 22px;
        line-height: 22px;
        /*max-width: calc(var(--h2-picker-width)- 30px);*/

        display: flex;
        font-size: 14px;
        white-space: nowrap;
        cursor: default;
        @apply --h2-picker-tag;
      }

      .tag-name {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .tag-deleter {
        margin-left: 6px;
        width: 18px;
        color: #fff;
        cursor: pointer;
        @apply --h2-select-tag-deleter;
      }

      .tag-deleter:hover {
        color: var(--h2-ui-red);
      }

      #picker-collapse {
        display: flex;
        position: fixed;
        /*top: 100%;*/
        width: 100%;
        margin-top: 1px;
        border-radius: 4px;
        font-size: 12px;
        z-index: 100;
        padding: 0;
        background: white;
        color: black;

        visibility: visible;
        opacity: 1;
        /*transition: all 150ms ease-in;*/

        @apply --h2-picker-dropdown;
      }

      #picker-collapse[hidden] {
        visibility: hidden;
        height: 0;
        opacity: 0;
      }

      /*显示下拉面板*/
      :host .show {
        opacity: 1;
        visibility: visible;
      }

      .collapse-content__table {
        width: 100%;
        font-size: 12px;
        background-color: #ffffff;
        border-collapse: separate;
        border-spacing: 0;
        text-align: left;
        border-radius: 4px;
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
      }

      .collapse-table__cell {
        white-space: nowrap;
        padding: 6px 10px;
        line-height: 1.42857143;
        border-bottom: 1px solid #ddd;
      }

      th.collapse-table__cell {
        padding-top: 12px;
        font-size: 1.1em;
      }

      tbody > tr:hover {
        background: var(--h2-ui-bg);
        color: #fff;
        cursor: pointer;
      }

      tr.candidate-item--focus {
        background: var(--h2-ui-bg) !important;
        color: #fff;
      }

      .table-hotkey {
        width: 40px;
      }
      
      #placeholder[hidden] {
        display: none;
      }

      #placeholder {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        color: #999;
        opacity: 1;
        padding: 0 6px;
        overflow: hidden;
        white-space: nowrap;
      }

      :host([required]) .input-wrap::before {
        content: "*";
        color: red;
        position: absolute;
        left: -10px;
        line-height: inherit;
      }
      
      :host([data-invalid]) .tags-input {
        border-color: var(--h2-ui-color_pink);
      }
    </style>
    <template is="dom-if" if="[[ toBoolean(label) ]]">
       <div class="h2-label">[[label]]</div>
    </template>
    
    <div class="input-wrap" id="select__container">
      <div class="input-container">
        <div class="tags-input" on-click="__openCollapse">
          <div id="placeholder">[[placeholder]]</div>
          <template is="dom-repeat" items="[[ selectedValues ]]">
            <span class="tag">
                <span class="tag-name" title="[[ getValueByKey(item, attrForLabel) ]]">
                  [[ __calcTagName(item) ]]
                </span>
                <iron-icon class="tag-deleter" icon="icons:clear" data-args="[[ getValueByKey(item, attrForValue) ]]" on-click="_deleteTag"></iron-icon>
            </span>
          </template>
          <input id="keywordInput" value="{{ _userInputKeyword::input }}" autocomplete="off" on-focus="__inputFocus">
        </div> <!-- class=tags-input -->

        <div class="mask"></div>
      </div>

      <div id="picker-collapse" hidden>
        <table class="collapse-content__table">
          <thead>
          <tr>
            <template is="dom-repeat" items="[[pickerMeta]]">
              <th class="collapse-table__cell">[[item.label]]</th>
            </template>
            <template is="dom-if" if="[[ enableHotkey ]]">
              <th class="collapse-table__cell table-hotkey">快捷键</th>
            </template>
          </tr>
          </thead>
          <tbody>
          <template is="dom-repeat" items="[[_displayItems]]" as="row">
            <tr id="candidate-item__[[index]]" on-click="_selectCollapseItem">
              <template is="dom-repeat" items="[[pickerMeta]]" as="col">
                <td class="collapse-table__cell">[[ getValueByPath(row, col.field) ]]</td>
              </template>
              <template is="dom-if" if="[[ enableHotkey ]]">
                <td class="collapse-table__cell table-hotkey">[[_getHotKey(index)]]</td>
              </template>
            </tr>
          </template>
          </tbody>
        </table>
      </div>
    </div>
`;
  }
  
  static get properties() {
    return {
      /**
       * 中文转拼音插件
       */
      _pinyinUtil: {
        type: Object,
        readOnly: true,
        value: function () {
          return new PinyinUtil();
        }
      },
      /**
       * 缓存搜索插件
       */
      _cacheSearchUtil: {
        type: Object,
        readOnly: true,
        value: function () {
          return new CacheSearchUtil();
        }
      },
      /**
       * 发送请求和模拟数据的组件
       */
      _fetchUtil: {
        type: Object,
        readOnly: true,
        value: function () {
          return new H2Fetch();
        }
      },
      /**
       * The label of the picker.
       * @type {string}
       */
      label: {
        type: String
      },
      /**
       * The placeholder of the select.
       * @type {String}
       */
      placeholder: {
        type: String
      },
      /**
       *
       * The selected value of this select,  if `multi` is true,
       * the value will join with comma ( `selectedValues.map(selected => selected[this.attrForValue]).join(',')` ).
       * @type {string}
       */
      value: {
        type: String,
        notify: true
      },
      /**
       * The selected value objects of this select.
       * @type {array}
       */
      selectedValues: {
        type: Array,
        notify: true
      },
      /**
       * The selected item.
       * @type {object}
       */
      selectedItem: {
        type: Object,
        notify: true
      },
      /**
       * A url for fetching local data, the response data of the request should be json.
       * @type {string}
       */
      src: {
        type: String
      },
      /**
       * A url for searching data with user input keywords, the response data of the request should be json.
       * @type {string}
       */
      // keywordSearchSrc: {
      //   type: String
      // },
      /**
       * The candidate selection of this picker.
       * @type {array}
       */
      items: {
        type: Array
      },
      /**
       * 下拉面板当前展示的数据集（默认显示items的前10条）
       * @type {array}
       */
      _displayItems: {
        type: Array
      },
      /**
       * 用户输入的模糊搜索关键字
       *
       */
      _userInputKeyword: {
        type: String
      },
      /**
       * Fields to build index for pinyin plugin.
       * @type {array}
       */
      fieldsForIndex: {
        type: Array
      },
      /**
       * 下拉面板中展示的字段，默认为[{"field": "label", "label": "选项"}]
       * @type {array}
       * @default [{"field": "label", "label": "选项"}]
       */
      pickerMeta: {
        type: Array,
        value: function () {
          return [{"field": "label", "label": "选项"}];
        }
      },
      /**
       * Attribute name for value.
       * @type {string}
       * @default 'value'
       */
      attrForValue: {
        type: String,
        value: "value"
      },
      /**
       * Attribute name for label.
       * @type {object}
       * @default 'label'
       */
      attrForLabel: {
        type: Object,
        value: "label"
      },
      /**
       * 是否禁用拼音搜索
       */
      disablePinyinSearch: {
        type: Boolean,
        value: false
      },
      
      /**
       * Set to true, if the selection is required.
       * @type {boolean}
       * @default false
       */
      required: {
        type: Boolean,
        value: false
      },
      /**
       * Set to true, if the picker is readonly.
       * @type {boolean}
       * @default false
       */
      readonly: {
        type: Boolean,
        value: false
      },
      /**
       * If true, multiple selections are allowed.
       * @type {boolean}
       * @default false
       */
      multi: {
        type: Boolean,
        value: false
      },
      /**
       * 下拉面板当前选项焦点
       */
      __focusIndex: {
        type: Number,
        value: 0
      },
      /**
       * If true, hotkeys for selecting items are allowed.
       * @type {boolean}
       * @default false
       */
      enableHotkey: {
        type: Boolean,
        value: false
      },
      
      fetchParam: {
        type: Object
      },
      
      keywordPath: {
        type: String,
        value: "keyword"
      },
      
      resultPath: {
        type: String
      },
      text: {
        type: String,
        notify: true,
        observer: '__textChanged'
      },
      mode: {
        type: String,
        value: 'default'
      },
      shortcutKey: {
        type: String,
        value: 'Enter'
      },
      inputChinese: Boolean
    };
  }
  
  static get is() {
    return "h2-picker";
  }
  
  static get observers() {
    return [
      '_srcChanged(src)',
      '_itemsChanged(items)',
      '_userInputKeywordChanged(_userInputKeyword)',
      '_selectedValuesChanged(selectedValues.splices)',
      '_valueChanged(value)',
      '__refreshUIState(required)'
    ]
  }
  
  connectedCallback() {
    super.connectedCallback();
    
    this.$.keywordInput.addEventListener("keydown", this._keyDownHandler.bind(this));
    this.$.keywordInput.addEventListener("compositionstart", () => this.inputChinese = true);
    this.$.keywordInput.addEventListener("compositionend", () => this.inputChinese = false);
    
    this.addEventListener("blur", e => {
      e.stopPropagation();
      if (!this.value) this.text = this._userInputKeyword;
      setTimeout(() => {
        if (this.shadowRoot.activeElement && this.shadowRoot.activeElement.id === 'keywordInput') return;
        this.displayCollapse(false);
      }, 100);
    });
    
    let parent = this.offsetParent;
    while (parent) {
      parent.addEventListener('scroll', e => {
        this.__collapsePosition()
      });
      parent = parent.offsetParent;
    }
  }
  
  __calcTagName(item) {
    if (Function.prototype.isPrototypeOf(this.attrForLabel)) {
      return this.attrForLabel.call(this, item);
    }
    return this.getValueByKey(item, this.attrForLabel);
  }
  
  _mkRequest(data) {
    return {
      url: this.src,
      method: "POST",
      headers: {
        "content-type": "application/json;charset=utf-8",
        "Cache-Control": "no-cache"
      },
      credentials: "include",
      body: JSON.stringify(data)
    };
  }
  
  _srcChanged(src) {
    if (!src) return;
    const request = this._mkRequest(this.fetchParam);
    this._fetchUtil.fetchIt(request)
      .then(res => res.json())
      .then(data => {
        let items;
        if (this.resultPath) {
          items = this.getValueByPath(data, this.resultPath, []);
        } else {
          items = data || [];
        }
        let findIndex = items.findIndex(item => item[this.attrForValue] == this.value);
        if (findIndex >= 0) {
          items = [items[findIndex]].concat(items);
          items.splice(findIndex + 1, 1);
          this.items = items;
        } else {
          this.value ? this._getSelectedForItems() : this.items = items;
        }
      })
      .catch(console.error);
  }
  
  _getSelectedForItems() {
    const requestObj = this.fetchParam;
    const req = this.setValueByPath(this.mkObject(this.keywordPath, requestObj), this.keywordPath, this.value + '');
    const request = this._mkRequest(req);
    this._fetchUtil.fetchIt(request)
      .then(res => res.json())
      .then(data => {
        const items = this.items || [];
        if (this.resultPath) {
          data = this.getValueByPath(data, this.resultPath, []);
        }
        
        const addItems = data.filter(d => !items.find(i => i[this.attrForValue] === d[this.attrForValue]));
        if (addItems.length > 0) {
          this.items = items.concat(addItems);
        }
      })
      .catch(err => console.error(err));
  }
  
  _itemsChanged(items = []) {
    this._displayItems = items.slice(0, 9);
    // 初始化一次选中项
    if (this.value !== undefined && this.value !== null) {
      this._valueChanged(this.value);
    }
    // 清空缓存插件的缓存
    this._cacheSearchUtil.resetCache();
    
    items.forEach(item => this._cacheSearchUtil.addCacheItem(item, this._loadPinyinKeys(item, this.fieldsForIndex)));
  }
  
  _userInputKeywordChanged() {
    
    if (this._userInputKeyword.length > 0) {
      this.displayCollapse(true);
    }
    
    const matched = this._cacheSearchUtil.search(this._userInputKeyword, " ");
    if (this.src) {
      
      if (!this.__fetchByKeyword) {
        this.__fetchByKeyword = throttle(() => {
          const requestObj = this.fetchParam;
          
          const req = this.setValueByPath(this.mkObject(this.keywordPath, requestObj), this.keywordPath, this._userInputKeyword);
          
          const request = this._mkRequest(req);
          this._fetchUtil.fetchIt(request)
            .then(res => res.json())
            .then(data => {
              let candidateItems = data || [];
              if (this.resultPath) {
                candidateItems = this.getValueByPath(data, this.resultPath, []);
              }
              let _displayItems = candidateItems;
              candidateItems = candidateItems.filter(i => (this.items || []).every(old => old[this.attrForValue] != i[this.attrForValue]));
              if (candidateItems.length > 0) {
                // _displayItems will reset when items changed.
                this.items = candidateItems.concat(this.items);
              } else {
                this._displayItems = _displayItems.slice(0, 9);
              }
              
              this._switchFocusItemAt(0);
            })
            .catch(err => console.error(err));
        }, 1000);
      }
      
      this.__fetchByKeyword();
      
    } else {
      this._displayItems = matched.slice(0, 9);
      this._switchFocusItemAt(0);
    }
    this._displayPlaceholder();
  }
  
  _selectedValuesChanged() {
    if (this.selectedValues.length > 0) {
      this.value = this.selectedValues.map(selected => selected[this.attrForValue]).join(',');
      this.selectedItem = this.selectedValues[this.selectedValues.length - 1];
    } else {
      this.value = null;
      this.selectedItem = undefined;
    }
    if (this.mode === 'text') this.text = this.value && !this.multi ? this.value : this._userInputKeyword;
    this.displayCollapse(false);
  }
  
  /**
   * value属性变化监听函数
   */
  _valueChanged(value) {
    // 本地模式，或远程数据已经就位
    if (this.items && this.items.length) {
      const flatValues = [...(new Set(String(value).split(",")))];
      const selectedValues = this.selectedValues || [];
      const dirty = selectedValues.map(selected => selected[this.attrForValue]).join(',');
      
      if (value && this.src && !this.multi) {
        let _selectedItem = this.items.filter(item => item[this.attrForValue] == value);
        
        if (!_selectedItem.length) {
          this._getSelectedForItems();
          return;
        }
      }
      
      if (dirty !== value) {
        const tmp = [...selectedValues, ...this.items];
        this.selectedValues =
          flatValues.map(val => tmp.find(item => item[this.attrForValue] == val))
            .filter(selected => !!selected);
      }
      
      this._displayPlaceholder();
    }
    
    this.__refreshUIState(value);
  }
  
  __refreshUIState() {
    if (!this.validate()) {
      this.setAttribute("data-invalid", "");
    } else {
      this.removeAttribute("data-invalid");
    }
  }
  
  __textChanged(text) {
    if (this.items && this.items.some(val => val[this.attrForValue] == text)) {
      this.set('value', text)
    } else if (this.mode === 'text') {
      this.set('_userInputKeyword', text ? text : '');
      this.set('value', text ? text : '');
    }
    this.__refreshUIState();
  }
  
  _displayPlaceholder() {
    this.$.placeholder.hidden = this.value || (this.mode && this.text) || this._userInputKeyword;
  }
  
  _selectItemAt(index) {
    if (index >= 0 && index < this._displayItems.length) {
      this._switchFocusItemAt(index);
      this._selectItem(this._displayItems[index]);
    }
  }
  
  /**
   * 选择选项
   * @param item
   */
  _selectItem(item) {
    // not yet selected
    if (!~(this.selectedValues || []).findIndex(selected => selected[this.attrForValue] == item[this.attrForValue])) {
      if (this.multi && this.selectedValues) {
        this.push('selectedValues', item);
      } else {
        this.selectedValues = [item];
      }
    }
    
    this.displayCollapse(false);
    if (this.multi) this.__focusOnKeywordInput();
    this._userInputKeyword = "";
  }
  
  /**
   * 切换焦点到第n个元素，从0开始
   * @param index
   * @private
   */
  _switchFocusItemAt(index) {
    setTimeout(() => {
      const maxIndex = (this._displayItems || []).length;
      const newIndex = (maxIndex + index) % maxIndex;
      this.root.querySelectorAll("tr.candidate-item--focus")
        .forEach(e => e.classList.remove('candidate-item--focus'));
      
      const newFocusItem = this.root.querySelector(`#candidate-item__${newIndex}`);
      if (newFocusItem != null) {
        newFocusItem.classList.add('candidate-item--focus');
        this.__focusIndex = newIndex;
      }
    }, 0);
  }
  
  _isPickerCollapseHidden() {
    return this.$["picker-collapse"].hidden;
  }
  
  __openCollapse({target: {classList}}) {
    if (classList.contains('tag-deleter')) return;
    
    this.__focusOnKeywordInput();
  }
  
  __inputFocus() {
    this.displayCollapse(true);
    this._switchFocusItemAt(0);
  }
  
  __collapsePosition() {
    const {left, top} = this.__getElemPos(this);
    this.$['picker-collapse'].style['left'] = left + this.clientWidth - this.$['select__container'].clientWidth + 'px';
    this.$['picker-collapse'].style['top'] = top + this.clientHeight + 'px';
    this.$['picker-collapse'].style['width'] = this.$['select__container'].clientWidth + 'px';
  }
  
  
  __getElemPos(obj) {
    const {x, y} = obj.getBoundingClientRect();
    return {
      left: x,
      top: y + 2
    }
  }
  
  __focusOnKeywordInput() {
    this.$.keywordInput.focus();
  }
  
  _selectCollapseItem(event) {
    event.stopPropagation();
    this._selectItem(event.model.row);
  }
  
  /**
   * 输入框键盘按键事件
   * @param event
   * @private
   */
  _keyDownHandler(event) {
    if (this.inputChinese) return;
    if (this.shortcutKey !== event.key && !this.$["picker-collapse"].hidden) event.stopPropagation();
    
    const key = event.key;
    if (event.altKey || key === this.shortcutKey) {
      event.preventDefault();
    }
    
    const collapseOpend = !this._isPickerCollapseHidden();
    if (collapseOpend && this.enableHotkey && event.altKey) {
      const ind = event.code.replace(/[A-Za-z]*/g, '') - 1;
      this._selectItemAt(ind);
    } else {
      switch (key) {
        case 'ArrowUp':
          collapseOpend && this._switchFocusItemAt(this.__focusIndex - 1);
          break;
        
        case 'ArrowDown':
          if (collapseOpend) {
            this._switchFocusItemAt(this.__focusIndex + 1);
          } else {
            this._switchFocusItemAt(0);
            this.displayCollapse(true);
          }
          break;
        
        case this.shortcutKey:
          if (collapseOpend && this._displayItems.length > 0 && this.__focusIndex < this._displayItems.length) {
            this._selectItemAt(this.__focusIndex);
          }
          break;
        
        case 'Backspace':
          if (this._userInputKeyword == undefined || this._userInputKeyword.length === 0) {
            this.deleteLastTag();
          }
          
          break;
      }
    }
  }
  
  /**
   * 给对象根据fieldsForIndex给对应的字段做拼音缓存（字段值，字段值全拼和拼音首字母）
   */
  _loadPinyinKeys(item, fieldsForIndex = []) {
    let keys = [], values = fieldsForIndex.map(sf => item[sf]);
    
    values = values.length === 0 ? Object.values(item) : values;
    
    if (this.disablePinyinSearch) {
      keys = values.map(value => String(value));
    } else {
      values.forEach(
        value => {
          keys = keys.concat(
            String(value),
            this._pinyinUtil.convert2CompletePinyin(value),
            this._pinyinUtil.convert2PinyinAbbreviation(value)
          );
        }
      );
    }
    
    return keys;
  }
  
  /**
   * Delete the last selected tag.
   */
  deleteLastTag() {
    if (this.selectedValues && this.selectedValues.length > 0) {
      this.pop("selectedValues");
    }
  }
  
  /**
   * 删除Tag项，事件处理函数
   */
  _deleteTag(e) {
    let value = e.target.dataArgs;
    const ind = this.selectedValues.findIndex(selected => selected[this.attrForValue] == value);
    this.splice("selectedValues", ind, 1);
    if (!this.multi || (this.multi && this.selectedValues.length === 0)) this._userInputKeyword = '';
  }
  
  _getHotKey(index) {
    return 'Alt+' + (index + 1);
  }
  
  /**
   * Open or close the collapse
   * @param {boolean} display  true to open the collapse.
   */
  displayCollapse(display) {
    this.$["picker-collapse"].hidden = !display;
    if (this.$["picker-collapse"].hidden === false) this.__collapsePosition();
  }
  
  /**
   * Toggle collapse. Side effect: the picker input will get a focus.
   */
  toggleCollapse() {
    const hidden = this.$["picker-collapse"].hidden;
    this.$["picker-collapse"].hidden = !hidden;
    this.__focusOnKeywordInput();
  }
  
  /**
   * Set focus to picker.
   */
  doFocus() {
    this.__focusOnKeywordInput();
  }
  
  /**
   * Validate, true if the select is set to be required and this.selectedValues.length > 0, or else false.
   * @returns {boolean}
   */
  validate() {
    if (this.mode === 'text') {
      return this.required ? this.text : true;
    } else {
      return this.required ? (this.selectedValues && this.selectedValues.length > 0) : true;
    }
  }
}

window.customElements.define(H2Picker.is, H2Picker);
