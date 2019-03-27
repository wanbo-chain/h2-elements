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
        grid-template-columns: repeat(3, 1fr);
        grid-gap: 20px;
      }
      
    </style>
    <div class="h2-layout">
      <slot></slot>
    </div>
    `
  }

  static get properties() {
    return {
      columns: {
        type: Number
      },
      rows: {
        type: Number
      }
    }
  }

  static get is() {
    return "h2-layout";
  }
}

window.customElements.define(H2Layout.is, H2Layout);