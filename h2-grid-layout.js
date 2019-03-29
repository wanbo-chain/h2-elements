import {html, PolymerElement} from "@polymer/polymer";
import './behaviors/h2-elements-shared-styles.js';
// import './h2-col';
import {mixinBehaviors} from "@polymer/polymer/lib/legacy/class";
import {BaseBehavior} from "./behaviors/base-behavior";

class H2GridLayout extends mixinBehaviors([BaseBehavior], PolymerElement) {
  static get template() {
    return html`
    <style include="h2-elements-shared-styles">
      :host {
        font-family: var(--h2-ui-font-family), sans-serif;
        font-size: var(--h2-ui-font-size);
      }
      .h2-grid-layout {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-gap: 20px;
        @apply --h2-grid-layout;
      }
      
    </style>
    <div class="h2-grid-layout" id="h2-grid-layout">
      <slot id="layout"></slot>
    </div>
    `
  }

  static get properties() {
    return {
      columns: {
        type: Number
      },
      columnGap: {
        type: Number
      },
      rowGap: {
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
      '__columnGapChange(columnGap)',
      '__rowGapChange(rowGap)',
      '__templateColumnsChange(templateColumns)'
    ]
  }

  __columnsChange(columns) {
    if (!this.templateColumns) {
      this.$['h2-grid-layout'].style['grid-template-columns'] = `repeat(${columns}, 1fr)`;
    }
  }

  __columnGapChange(columnGap) {
    this.$['h2-grid-layout'].style['grid-column-gap'] = `${columnGap}px`;
  }

  __rowGapChange(rowGap) {
    this.$['h2-grid-layout'].style['grid-row-gap'] = `${rowGap}px`;
  }

  __templateColumnsChange(templateColumns) {
    if (this.templateColumns) {
      this.$['h2-grid-layout'].style['grid-template-columns'] = templateColumns;
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
    return "h2-grid-layout";
  }
}

window.customElements.define(H2GridLayout.is, H2GridLayout);