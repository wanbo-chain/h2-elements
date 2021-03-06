/*
`h2-form`

Example:
```html
<h2-form title="demo" action="/test.do">
  <h2-input class="form-input" label="公司名称" name="company"></h2-input>
  <h2-input class="form-input" label="电话" name="tel" type="tel" maxlength="11"></h2-input>
  <h2-input class="form-input" label="地址" name="address"></h2-input>
  <h2-input class="form-input" label="姓名" name="name"></h2-input>
  <h2-input class="form-input" label="年龄" name="age" type="number"></h2-input>
  <h2-button slot="form-btn" form-submit>提交</h2-button>
</h2-form>
```
## Styling

The following custom properties and mixins are available for styling:

|Custom property | Description | Default|
|----------------|-------------|----------|
|`--h2-form-title` | Mixin applied to the head title of form | {}
|`--h2-form` | Mixin applied to form | {}
|`--h2-form-button` | Mixin applied to submit button of the form | {}

*/

import {html, PolymerElement} from "@polymer/polymer";
import {mixinBehaviors} from "@polymer/polymer/lib/legacy/class";
import * as Gestures from '@polymer/polymer/lib/utils/gestures.js';

import {BaseBehavior} from "./behaviors/base-behavior";
import {dom} from '@polymer/polymer/lib/legacy/polymer.dom.js';

import './h2-fetch.js';

/**
 * @customElement
 * @polymer
 * @demo demo/h2-form/index.html
 */
class H2Form extends mixinBehaviors([BaseBehavior], PolymerElement) {
  static get template() {
    return html`
    <style>
      :host {
        display: block;
        font-family: var(--h2-ui-font-family), sans-serif;
        font-size: var(--h2-ui-font-size);
      }

      #title {
        @apply --h2-form-title;
      }

      .container {
        display: grid;
        grid-template-columns: 45% 45%;
        grid-column-gap: 10px;
        grid-row-gap: 10px;
        @apply --h2-form;
      }

      .btns {
        margin: 20px;
        display: flex;
        justify-content: flex-end;
        @apply --h2-form-button;
      }
    </style>
    <h2 id="title">[[title]]</h2>

    <div class="container">
      <slot id="form-fields"></slot>
    </div>
    <div class="btns">
      <slot name="form-btn"></slot>
    </div>
    <h2-fetch id="fetch" handle-response-as="[[handleResponseAs]]"></h2-fetch>
`;
  }

  static get properties() {
    return {
      /**
       * Head title of the form
       */
      title: {
        type: String
      },

      /**
       * Request method,GRT or POST,default POST
       * @default 'POST'
       */
      method: {
        type: String,
        value: "POST"
      },

      /**
       * The URI of a program that processes the form information
       */
      action: {
        type: String
      },

      /**
       * Enctype is the MIME type of content that is used to submit the form to the server.
       * @type {string}
       * @default 'application/json;charset=utf-8'
       */
      enctype: {
        type: String,
        value: 'application/json;charset=utf-8'
      },
      /**
       * Set to true to indicate that the form is not to be validated when submitted
       * @type {boolean}
       * @default false
       */
      novalidate: {
        type: Boolean,
        value: false
      }
    };
  }

  static get is() {
    return "h2-form";
  }

  connectedCallback() {
    super.connectedCallback();
    Gestures.addListener(this, 'tap', e => {
      const path = dom(e).path;
      const submit = path.find(target => target.hasAttribute && (target.hasAttribute('form-submit')));
      submit && this.submit();
    });
  }

  /**
   * Summit the form to server.
   */
  submit() {
    const namedFieldNode = this.$['form-fields'].assignedNodes()
      .filter(node => node.hasAttribute && node.hasAttribute("name"));

    const allValid = this.novalidate || namedFieldNode.every(node => node.validate ? node.validate() : true);

    if (allValid) {
      const reqData = namedFieldNode.reduce((result, node) => {
        const key = node.getAttribute('name');
        const value = node.value;
        result[key] = value;
        return result;
      }, {});
      const method = (this.method || '').toUpperCase();
      if(method === 'GET') {
        this._get(reqData);
      } else if(method === 'POST') {
        this._post(reqData);
      } else {
        throw new TypeError(`Unsupported method: ${this.method}`);
      }
    }
  }

  _get(reqData) {
    const reqUrl = new URL(this.action, window.location.href);
    Object.keys(reqData)
      .forEach((key) => reqUrl.searchParams.append(key, reqData[key] || ''));

    this.$.fetch.fetchIt({
      url: reqUrl,
      method: this.method,
      credentials: "include",
    }).then(this._successHandler.bind(this))
      .catch(this._errorHandler.bind(this))
  }

  _post(reqData) {
    const enctype = (this.enctype || '').toLowerCase();
    const headers = {};
    let body;

    if (~enctype.indexOf('application/json')) {
      headers['content-type'] = this.enctype;
      body = JSON.stringify(reqData);

    } else if (~enctype.indexOf('application/x-www-form-urlencoded')) {
      const searchParams = new URLSearchParams();
      Object.keys(reqData).forEach((key) => searchParams.append(key, reqData[key]));
      body = searchParams;

    } else if (~enctype.indexOf('multipart/form-data')) {
      const formData = new FormData();
      Object.keys(reqData).forEach((key) => formData.append(key, reqData[key]));
      body = formData;

    } else {
      throw new TypeError(`Unsupported enctype: ${this.enctype}`);
    }

    this.$.fetch.fetchIt({
      url: this.action,
      method: this.method,
      credentials: "include",
      headers,
      body
    }).then(this._successHandler.bind(this))
      .catch(this._errorHandler.bind(this))
  }

  _successHandler(response) {
    if(response.ok) {
      this.dispatchEvent(new CustomEvent("submitted", {
        bubbles: true,
        composed: true
      }));
    } else {
      this._errorHandler();
    }
  }

  _errorHandler() {
    this.dispatchEvent(new CustomEvent("error", {
      bubbles: true,
      composed: true,
    }));
  }
}

window.customElements.define(H2Form.is, H2Form);
