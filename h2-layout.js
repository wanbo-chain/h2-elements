import {html, PolymerElement} from "@polymer/polymer";
import './behaviors/h2-elements-shared-styles.js';
// import './h2-col';
import {mixinBehaviors} from "@polymer/polymer/lib/legacy/class";
import {BaseBehavior} from "./behaviors/base-behavior";

class H2Layout extends mixinBehaviors([BaseBehavior], PolymerElement) {
  static get template() {
    return html`
    <style include="h2-elements-shared-styles">
      :host {
        
      }
      .h2-layout {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-gap: 20px;
        @apply --h2-layout;
      }
      
    </style>
    <div class="h2-layout" id="h2-layout">
      <slot id="layout"></slot>
    </div>
    `
  }

  static get properties() {
    return {
      columns: {
        type: Number
      },
      gap: {
        type: Number
      },
      templateColumns: {
        type: String
      }

    }
  }

  static get observers() {
    return [
      '__columnsChange(columns)',
      '__gapChange(gap)',
      '__templateColumnsChange(templateColumns)'
    ]
  }

  __columnsChange(columns) {
    if (!this.templateColumns) {
      this.$['h2-layout'].style['grid-template-columns'] = `repeat(${columns}, 1fr)`;
    }
  }

  __gapChange(gap) {
    this.$['h2-layout'].style['grid-gap'] = `${gap}px`;
  }

  __templateColumnsChange(templateColumns) {
    if (this.templateColumns) {
      this.$['h2-layout'].style['grid-template-columns'] = templateColumns;
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.$.layout.addEventListener('slotchange', e => {
      const assignedElements = e.target.assignedElements();
      assignedElements.filter(_ => _.hasAttribute('layout-colspan')).forEach( item => {
        item.style['grid-column-end'] = `span ${item.getAttribute('layout-colspan')}`
      });
      assignedElements.filter(_ => _.hasAttribute('layout-rowspan')).forEach( item => {
        item.style['grid-row-end'] = `span ${item.getAttribute('layout-rowspan')}`
      });
    });
  }

  static get is() {
    return "h2-layout";
  }
}

window.customElements.define(H2Layout.is, H2Layout);