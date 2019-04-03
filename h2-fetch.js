/*
### Usage 1:

```html
<h2-fetch request="{{request}}" response="{{response}}" error="{{error}}"></h2-fetch>

```
```
request = {
  url: "/path/to/index.do",
  method: "POST",
  headers: {
    "Cache-Control": "no-cache"
  }
}
```
### Usage 2:

```
const request = {
  url: "/path/to/index.do",
  method: "POST",
  headers: {
    "Cache-Control": "no-cache"
  }
};

new H2Fetch().fetchIt(request)
  .then(res => res.json())
  .then(console.log)
  .catch(console.log);
```
### Also, you can mock the responses of your http requests, by following belows:
#### 1. Import mock_setup.js before the importing of polymer libs.

```html
<head>
  ...
  <script type="text/javascript" src="bower_components/h2-elements/utils/mock_setup.js"></script>

  polymer libs import after here
</head>

```
#### 2. Create mockData.js
For Example:
```
import {data} from "./data.js";

MockDataPool.when("POST", "/path/to/index.do")
  .withExpectedHeader("content-type", "application/json;charset=utf-8")
  .withExpectedHeader("Cache-Control", "no-cache")
  .responseWith({status: 200, body: JSON.stringify(data)});
```

#### 3. Append a searchParam on your request url to open mock mode.

For example ``http://127.0.0.1:8000/components/h2-elements/demo/h2-fetch/index.html?mock=/your/path/to/mockData.js``,

``/your/path/to/`` is a relative path to index.html. For example, if index.html and mockData.js are located under a same
folder, it can be ``index.html?mock=mockData.js`` or ``index.html?mock=./mockData.js``

*/
import {PolymerElement} from "@polymer/polymer";
import {mixinBehaviors} from "@polymer/polymer/lib/legacy/class";

import {BaseBehavior} from './behaviors/base-behavior.js';
/**
 * `h2-fetch`
 *
 * @customElement
 * @polymer
 * @demo demo/h2-fetch/index.html
 */
export class H2Fetch extends mixinBehaviors([BaseBehavior], PolymerElement) {

  static get properties() {
    return {
      /**
       * See [Request API](https://developer.mozilla.org/en-US/docs/Web/API/Request)
       * @type {Object}
       */
      request: {
        type: Object
      },

      /**
       * Error is undefined when window.__mockEnabled is true
       * @type {{content:*}}
       */
      error: {
        type: Object,
        notify: true
      },
      /**
       * See [Response API](https://developer.mozilla.org/en-US/docs/Web/API/Response)
       */
      response: {
        type: Object,
        notify: true
      },

      /**
       * How to handle the response body, the handled result will access as the property 'responseBody'.
       * json/text/blob/arrayBuffer
       * @type {string}
       * @default 'json'
       */
      handleResponseAs: {
        type: String,
        value: "json"
      },

      /**
       * Handled response body.
       * @type {{content:*}}
       */
      responseBody: {
        type: Object,
        notify: true
      },

      __defaultRequest: {
        type: Object,
        value: {
          credentials: "include"
        },
        readOnly: true
      },

      __defaultHeaders: {
        type: Object,
        value: function () {
          return {
            "content-type": "application/json;charset=utf-8"
          }
        },
        readOnly: true
      },

      __controller: {
        type: Object
      },

      __signal: {
        type: Object
      },

      loading: {
        type: Boolean,
        value: false
      }
    };
  }

  static get is() {
    return "h2-fetch";
  }

  static get observers() {
    return [
      "__requestChange(request)",
      "__responseChange(response)"
    ];
  }
  
  constructor() {
    super();
    if ('AbortController' in window) {
      // todo: abortControllers persist in global scope
      this.__controller = new AbortController();
      this.__signal = this.__controller.signal;
    }
  }
  
  __getCorrectedRequest(request) {
    const req = Request.prototype.isPrototypeOf(request) ? request : new Request(request.url, request);
    //TODO set default value to req
    return req;
  }

  __requestChange(request) {
    if (!request) return;
    return this.fetchIt(request);
  }

  __responseChange(response) {
    const resClone = response.clone();
    if (response.ok) {
      const handleAs = this.handleResponseAs || "text";

      if (response.headers.has('Content-length')
        && response.headers.get('Content-length') == 0) {
        this.responseBody = {};
        return;
      }

      resClone[handleAs]().then(data => this.responseBody = {content: data});
    } else {
      resClone.text().then(err => this.error = {content: err});
    }
  }
  
  /**
   * Fetch you request, if window.__mockEnabled == true, you can get your mock response.
   * @param {Request|object} request
   * @param option
   * @return {Promise}
   */
  fetchIt(request, option = {loading: this.loading}) {
    const collectedReq = this.__getCorrectedRequest(request);
    if (window.__mockEnabled && typeof MockDataPool !== "undefined") {
      const matchedRes = MockDataPool.match(collectedReq);
      if (matchedRes) {
        this.response = new Response(matchedRes.body, matchedRes);
        return Promise.resolve(this.response);
      }
    }
    
    option.loading && this.showLoading();
    
    return window.fetch(collectedReq, {signal: this.__signal})
      .then(res => {
        this.response = res;
        return res;
      })
      .catch(err => {
        this.error = {content: err};
        return Promise.reject(err);
      })
      .finally(() => {
        option.loading && this.hideLoading();
      });
  }
  
  /**
   * Abort your request.
   */
  abort() {
    this.__controller && this.__controller.abort();
  }
  
  /**
   * Abort all pending requests.
   */
  abortAll() {
    // todo
  }
  
  /**
   * @param reqArr
   */
  fetchAll(reqArr = []) {
    // todo
  }
}

window.customElements.define(H2Fetch.is, H2Fetch);
