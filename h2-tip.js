/*
`h2-tip`

Example:
```html
<h2-tip type="success" message="success" id="tip"></h2-tip>
<h2-button id="btn" onclick="tip.open();">Success</h2-button>

<h2-tip type="warn" message="warn" id="tip2"></h2-tip>
<h2-button id="btn2" onclick='tip2.open(2000);'>Warn</h2-button>

<h2-tip type="error" message="alert" id="tip3"></h2-tip>
<h2-button id="btn3" onclick='tip3.open(5000);'>Error</h2-button>
```
*/

import {html, PolymerElement} from "@polymer/polymer";
import {mixinBehaviors} from "@polymer/polymer/lib/legacy/class";
import {BaseBehavior} from "./behaviors/base-behavior";
import '@polymer/iron-icons';
import '@polymer/iron-icon';
import './behaviors/h2-elements-shared-styles';
import './h2-button.js';
import './h2-input.js';
import './h2-dialog.js'

/**
 * @customElement
 * @polymer
 * @demo demo/h2-tip/index.html
 */
class H2Tip extends mixinBehaviors([BaseBehavior], PolymerElement) {
  static get template() {
    return html`
    <style include="h2-elements-shared-styles">
      :host {
        min-width: 330px;
        min-height: 100px;
        overflow: hidden;
        font-family: var(--h2-ui-font-family), sans-serif;
        font-size: var(--h2-ui-font-size);
      }
      
      #dialog {
        --h2-dialog-content: {
          display: flex;
          flex-flow: column nowrap;
        }
        
        --h2-dialog-title: {
          font-size: 18px;
        }
      }
      
      :host #tip {
        vertical-align: middle;
        box-sizing: border-box;
        font-size: 14px;
        display: flex;
        flex-flow: row nowrap;
        flex: 1;
      }

      :host([type=warn]) #tip {
        color: var(--h2-ui-color_yellow);
      }

      :host([type=success]) #tip {
        color: #46d23a;
      }

      :host([type=error]) #tip {
        color: var(--h2-ui-color_pink);
      }

      .tip-content {
        color: #848484;
        flex: 1;
        word-break: break-all;
      }
      
      :host([type=success]) #dialog,
      :host([type=warn]) #dialog,
      :host([type=error]) #dialog {
        --h2-dialog-width: 400px;
        --h2-dialog-height: 86px;
      }
      
      :host([type=success]) .tip-content,
      :host([type=warn]) .tip-content,
      :host([type=error]) .tip-content {
        padding: 5px 12px;
      }
      
      :host([type=prompt]) #dialog,
      :host([type=confirm]) #dialog {
        --h2-dialog-width: 440px;
        --h2-dialog-height: 200px;
      }
      
      :host([type=success]) #operate-panel,
      :host([type=warn]) #operate-panel,
      :host([type=error]) #operate-panel,
      :host([type=success]) #remark-input,
      :host([type=warn]) #remark-input,
      :host([type=error]) #remark-input,
      :host([type=confirm]) #remark-input {
        display: none;
      }

      .tip-icon {
        width: 36px;
        height: 36px;
      }

      #remark-input {
        width: inherit;
      }

      #operate-panel {
        text-align: right;
        margin-top: 10px;
      }
    </style>

    <h2-dialog id="dialog" modal="[[ isOneOf(type, 'confirm', 'prompt') ]]" no-cancel-on-outside-click title="[[orElse(title, config.title)]]">
      
      <div id="tip">
          <template is="dom-if" if="[[ isEqual(type, 'success') ]]">
            <iron-icon class="tip-icon" icon="icons:check-circle"></iron-icon>
          </template>
          <template is="dom-if" if="[[ isEqual(type, 'warn') ]]">
            <iron-icon class="tip-icon" icon="icons:error"></iron-icon>
          </template>
          <template is="dom-if" if="[[ isEqual(type, 'error') ]]">
            <iron-icon class="tip-icon" icon="icons:cancel"></iron-icon>
          </template>
          <div class="tip-content" id="messageContainer"></div>
      </div>
      <h2-input id="remark-input" value="{{ remark }}"></h2-input>
      <div id="operate-panel">
        <h2-button on-click="_cancel" type="warning" size="small">[[orElse(config.cancelBtnLabel, '取消')]]</h2-button>
        <h2-button on-click="_confirm" size="small">[[orElse(config.confirmBtnLabel, '确定')]]</h2-button>
      </div>
    </h2-dialog>
`;
  }
  
  static get is() {
    return "h2-tip";
  }
  
  static get properties() {
    return {
      /**
       * Message of the tip.
       */
      message: {
        type: String,
      },
      /**
       * Tip type [success | warn | error | confirm | prompt]
       * @type {string} type
       * @default 'success'
       */
      type: {
        type: String,
        value: 'success'
      },
      /**
       * User input when `type` is `prompt`.
       */
      remark: {
        type: String
      },
      /**
       * confirm、prompt信息框确认按钮点击回调函数
       */
      _confirmCallback: {
        type: Object
      },
      /**
       * confirm、prompt信息框取消按钮点击回调函数
       */
      _cancelCallback: {
        type: Object
      },
      
      /**
       * When `type` is `success`, `warn` or `error`, the tip will disappear after [duration] ms.
       * @type {number}
       * @default 1500 ms
       */
      duration: {
        type: Number,
        value: 1500
      },
      /**
       * Set to true, if you want that `h2-tip` can auto detach from its parentElement.
       * @default false
       */
      autoDetach: {
        type: Boolean,
        value: false
      },
      
      title: String,
      width: String,
      height: String,
  
      config: {
        type: Object,
        value: function() {
          return {};
        }
      }
      
    };
  }
  
  static get observers() {
    return [
      '__sizeChanged(width, "width")',
      '__sizeChanged(height, "height")',
      '__messageChanged(message)'
    ];
  }
  
  __sizeChanged(size, sizeAttr) {
    if(size) {
      this.$.dialog.updateStyles({["--h2-dialog-" + sizeAttr]: size});
    }
  }
  
  __messageChanged(message) {
    this.$.messageContainer.innerHTML = message;
  }
  /**
   * Cancel handler
   */
  _cancel() {
    this.close();
    this.isFunction(this._cancelCallback) && this._cancelCallback();
  }
  
  /**
   * Confirm handler
   */
  _confirm() {
    this.close();
    const cbParam = this.type === 'prompt' ? {remark: this.remark} : null;
    this.isFunction(this._confirmCallback) && this._confirmCallback(cbParam);
  }
  
  /**
   * Open the tip dialog.
   *
   * 3 ways to use the open api:
   *
   *   - open(duration)
   *   - open(confirmCallback)
   *   - open(confirmCallback, cancelCallback)
   * @param args
   */
  open(...args) {
    let confirmCallback, cancelCallback, duration = this.duration;
    if (args.length > 0 && typeof args[0] === 'function') {
      confirmCallback = args.shift();
    }
    
    if (args.length > 0 && typeof args[0] === 'function') {
      cancelCallback = args.shift();
    }
    
    if (args.length > 0 && (typeof args[0] === 'number' || typeof args[0] === 'string')) {
      duration = Number(args[0]);
    }
    
    this._confirmCallback = confirmCallback;
    this._cancelCallback = cancelCallback;
    
    this.$.dialog.open();
    
    if (this.type !== 'confirm' && this.type !== 'prompt') {
      setTimeout(() => {
        this.close();
      }, duration);
    }
  }
  
  /**
   * Hide the tip.
   */
  close() {
    this.$.dialog.close();
    if (this.autoDetach && this.parentElement && this.parentElement.removeChild) {
      this.parentElement.removeChild(this);
    }
  }
}

window.customElements.define(H2Tip.is, H2Tip);
