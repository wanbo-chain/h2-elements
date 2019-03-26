/*
`h2-pagination`

Example:
```html
<h2-pagination total="30" limit="5" paging="{{paging}}"></h2-pagination>
```
*/
import {html, PolymerElement} from "@polymer/polymer";
import './behaviors/h2-elements-shared-styles';
import './h2-select';

/**
 * @customElement
 * @polymer
 * @demo demo/h2-pagination/index.html
 */
class H2Pagination extends PolymerElement {
  static get template() {
    return html`
    <style include="h2-elements-shared-styles">
      :host {
        display: inline-block;
        height: 38px;
        line-height: 38px;
        font-size: 14px;
      }

      .pagination {
        display: flex;
        margin: 0;
        padding: 0;
        list-style: none;
        height: 38px;
        line-height: 38px;
      }

      li > div {
        padding: 0 8px;
        color: var(--h2-ui-highblue);
        background-color: #fff;
        border: 1px solid #f0f0f0;
        border-right: none;
        white-space: nowrap;
        cursor: pointer;
        text-decoration: none;
        user-select: none;
      }
      
      li:first-of-type > div {
        border-top-left-radius: var(--h2-ui-border-radius);
        border-bottom-left-radius: var(--h2-ui-border-radius);
      }

      li:last-of-type > div {
        border-top-right-radius: var(--h2-ui-border-radius);
        border-bottom-right-radius: var(--h2-ui-border-radius);
        border-right: 1px solid #f0f0f0;
      }

      /*li > div:hover {*/
        /*color: #23527c;*/
        /*background-color: #eee;*/
        /*border-color: #ddd;*/
      /*}*/

      #inner-input {
        width: 50px;
        font-size: inherit;
        padding: var(--h2-ui-border-radius);
        outline: none;
        border-radius: 2px;
        border: 1px solid #6fa5d3;
      }
      
      input[type=number] {
          -moz-appearance:textfield;
      }
      
      input[type=number]::-webkit-inner-spin-button,
      input[type=number]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
      }
      
      h2-select {
        width: 90px;
        height: 38px;
        line-height: 38px;
        border: 1px solid #f0f0f0;
        
        border-top-right-radius: var(--h2-ui-border-radius);
        border-bottom-right-radius: var(--h2-ui-border-radius);
        
        --h2-select__container: {
          border: none;
        }
        --h2-select-tag: {
          background-color: #fff;
          border: none;
          line-height: 27px;
          color: var(--h2-ui-highblue);
          padding: 0;
        }
        --h2-select-tag-deleter: {
          display: none;
        }
        
        --h2-select-label: {
          display: none;
        }
        
        .page-count {
          display: inline-block;
          width: 40px;
        }
      }
      
    </style>
    <ul class="pagination">
      <li>
        <div on-click="first" id="first">第一页</div>
      </li>
      <li>
        <div on-click="prev" id="prev">上一页</div>
      </li>
      <li>
        <div on-click="next" id="next">下一页</div>
      </li>
      <li>
        <div>第 <input id="inner-input" value="{{ __pageIndex::input }}" type="number" maxlength="10" min="1">
          页  共 <span class="page-count"> [[ totalPageSize ]] </span>页
        </div>
      </li>
      <!--<li>-->
        <!--<div on-click="last" id="last">最后一页</div>-->
      <!--</li>-->
      <li>
        <div>共[[ total ]]条</div>
      </li>
      <li>
        <h2-select value="{{ limit }}" items="[[ pageSizes ]]"></h2-select>
      </li>
    </ul>
`;
  }

  static get is() {
    return "h2-pagination";
  }

  static get properties() {
    return {
      /**
       * @type {{start:Number, limit:Number}}
       */
      paging: {
        type: Object,
        notify: true
      },
      /**
       * Max count of single page.
       * @type {number}
       * @default 10
       */
      limit: {
        type: Number,
        value: 20
      },
      /**
       * Total count.
       * @type {number}
       * @default 0
       */
      total: {
        type: Number,
        value: 0
      },

      /**
       * Total page sizes
       */
      totalPageSize: {
        type: Number,
        computed: '_calTotalPageSize(total, limit)'
      },
      __pageIndex: {
        type: Number,
        value: 1
      },
      pageSizes: {
        type: Array,
        value: [
          {label: '20条/页', value: 20},
          {label: '40条/页', value: 40},
          {label: '60条/页', value: 60}
        ]
      }
    };
  }

  static get observers() {
    return [
      '_pageIndexChanged(__pageIndex)',
      '_pageStartChanged(paging.start)',
      '_limitChanged(limit)'
    ];
  }

  _pageStartChanged(start) {
    const pageIndex = Math.floor(start / this.limit) + 1;
    if (pageIndex !== this.__pageIndex) {
      this.__pageIndex = pageIndex;
    }
  }

  _pageIndexChanged() {
    const start = (this.__pageIndex - 1) * this.limit;
    if(!this.paging || this.paging.start !== start) {
      this.paging = {start, limit: this.limit};
    }
  }

  _limitChanged(limit) {
    console.log(limit)
  }

  _calTotalPageSize(total, limit) {
    return Math.ceil((total || 0) / limit);
  }

  /**
   * Go to the first page.
   */
  first() {
    this.__pageIndex = 1;
  }

  /**
   * Go to previous page.
   */
  prev() {
    if (this.__pageIndex > 1) {
      this.__pageIndex--;
    }
  }

  /**
   * Go to next page.
   */
  next() {
    if (this.__pageIndex < this.totalPageSize) {
      this.__pageIndex++;
    }
  }

  /**
   * Go to the last page.
   */
  last() {
    this.__pageIndex = this.totalPageSize;
  }

}

window.customElements.define(H2Pagination.is, H2Pagination);
