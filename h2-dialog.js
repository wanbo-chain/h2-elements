/*
`h2-dialog`

Example:
```html
<h2-dialog id="dialog">
   Put your Content here inside an element which with [slot=container]
</h2-dialog>
<button id="btn" onclick="javascript:dialog.open();">Click to open the Dialog</button>
```
## Styling

The following custom properties and mixins are available for styling:

|Custom property | Description | Default|
|----------------|-------------|----------|
|`--h2-dialog-width` | Mixin applied to the width of dialog | 85%
|`--h2-dialog-height` | Mixin applied to the height of dialog | 90%
|`--h2-dialog-title` |  Mixin applied to the style of dialog title | {}


*/
import {html, PolymerElement} from "@polymer/polymer";
import {mixinBehaviors} from "@polymer/polymer/lib/legacy/class";
import '@polymer/paper-dialog';
import '@polymer/neon-animation/animations/scale-up-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/iron-icon';
import '@polymer/iron-icons';
import {BaseBehavior} from "./behaviors/base-behavior";
import './behaviors/h2-elements-shared-styles.js';


/**
 * @customElement
 * @polymer
 * @demo demo/h2-dialog/index.html
 */
class H2Dialog extends mixinBehaviors([BaseBehavior], PolymerElement) {
  static get template() {
    return html`
    <style include="h2-elements-shared-styles">
      :host {
        display: block;
      }

      paper-dialog {
        display: flex;
        flex-flow: column nowrap;
        align-content: stretch;
        width: var(--h2-dialog-width, 85%);
        height: var(--h2-dialog-height, 90%);
        border-radius: var(--h2-ui-border-radius);
      }

      .scrollable-container {
        flex: 1;
        overflow: auto;
      }

      .close-dialog {
        position: absolute;
        top: -10px;
        right: -10px;
        cursor: pointer;
        z-index: 10;
      }

      .close-dialog:hover {
        color: var(--h2-ui-red);
      }
      
      .title {
        margin-top: 24px;
        text-align: left;
        padding-bottom: 10px;
        @apply --h2-dialog-title;
      }

    </style>

    <paper-dialog id="dialog" modal entry-animation="scale-up-animation" exit-animation="fade-out-animation">
      <div class="close-dialog" on-tap="close">
        <iron-icon icon="icons:close"></iron-icon>
      </div>
      
      <template is="dom-if" if="[[ toBoolean(title) ]]">
        <h1 class="title">[[title]]</h1>
      </template>
      <div class="scrollable-container">
        <slot></slot>
      </div>
    </paper-dialog>
`;
  }

  static get properties() {
    return {
      /**
       * Title of the dialog
       */
      title: {
        type: String
      },
      /**
       * Set to True to stop auto dismiss.
       * @type {boolean}
       * @default false
       */
      stopAutoDismiss: {
        type: Boolean,
        value: false
      }
    };
  }

  static get is() {
    return "h2-dialog";
  }

  connectedCallback() {
    super.connectedCallback();

    /**
     * @listens iron-overlay-closed
     */
    this.addEventListener('iron-overlay-closed', e => {
      // ignore 'iron-overlay-closed' event fired by other element
      if (e.path[0] != this.$.dialog) return;
      e.stopPropagation();
      /**
       * @event h2-dialog-closed
       * Fired when the dialog closed.
       */
      this.dispatchEvent(new CustomEvent('h2-dialog-closed'), {
        composed: true,
        bubbles: true
      });
      if (!this.stopAutoDismiss) {
        setTimeout(() => {
          this.parentElement.removeChild(this);
        }, 100);
      }
    });

    /**
     * @listens h2-dialog-dismiss
     */
    this.addEventListener('h2-dialog-dismiss', this.close);
  }

  /**
   * Open the dialog.
   */
  open() {
    this.$.dialog.open();
  }

  /**
   * Close the dialog.
   */
  close() {
    this.$.dialog.close();
  }
}

window.customElements.define(H2Dialog.is, H2Dialog);
