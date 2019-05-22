/*

```html

```
*/

import {PolymerElement} from "@polymer/polymer";
import {FlattenedNodesObserver} from "@polymer/polymer/lib/utils/flattened-nodes-observer";
import {Templatizer} from '@polymer/polymer/lib/legacy/templatizer-behavior.js';
import {mixinBehaviors} from "@polymer/polymer/lib/legacy/class";

/**
 * `h2-grid`
 *
 * @customElement
 * @polymer
 * @demo demo/h2-table-column/index.html
 */
class H2TableColumn extends mixinBehaviors([Templatizer], PolymerElement) {
  static get template() {
    return null;
  }
  
  static get properties() {
    return {
      prop: {
        type: String
      },
  
      props: String,
  
      separator: String,
      
      label: {
        type: String
      },
      
      width: {
        type: Number
      },
      
      fixed: {
        type: String,
      },
      
      type: {
        type: String,
        value: 'view'
      },
      
      tmpl: Object,
      
      modelAs: {
        type: String,
        value: 'item'
      },
      
      sortable: {
        type: Boolean,
        value: false
      },
  
      frozen: {
        type: Boolean,
        value: false
      },
      
      formatter: Function,
      cellStyle: String,
      defaultValue: String
    };
  }
  
  static get is() {
    return "h2-table-column";
  }
  
  constructor() {
    super();
    this.tmpl = this._findTemplate().pop();
    
    if (this.tmpl) {
      // hack for template.__dataHost
      this.tmpl.__dataHost = this.parentElement;
      this._parentModel = {};
      this.templatize(this.tmpl);
    }
  }
  
  _findTemplate() {
    return FlattenedNodesObserver.getFlattenedNodes(this)
      .filter(node => node.localName === 'template');
  }
  
  stampTemplate(instanceProps, key = this.modelAs) {
    if(this.tmpl) return this.stamp({[key]: instanceProps, "global": this.tmpl.__dataHost.global});
    return null;
  }
}

window.customElements.define(H2TableColumn.is, H2TableColumn);
