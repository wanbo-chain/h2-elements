import {BaseBehavior} from "./base-behavior";

const AjaxBehaviorImpl = {
  /**
   * GET 请求
   *
   * 例子：
   *```javascript
   * 1. 直接传递一个Request 实例
   *  const req = new Request('/test?foo=1&bar=2', {method: 'GET'});
   *  this.query(req, console.log );
   *
   * 2. 直接传递一个url
   *  this.query('/test', console.log);
   *
   * 3. 直接传递一个包含url、data内容的对象
   *  this.query({
   *       url: '/test',
   *       data: { foo:1, bar:2 },
   *       handleAs: 'json'
   *   }, console.log, console.log );
   * ```
   * ******************************************************
   *
   * @param {string|Request|Object} input -
   *      支持3种类型： String|Request|Object
   *      1. Request实例
   *      2. string：请求url
   *      3: Object： 对象结构要求 { url , data, handleAs}
   *          url：必填项
   *          data：可选
   *          handleAs：string, 可选，默认值是"json"， 取值范围: text|json|blob|formData|arrayBuffers
   *
   * @param {Function} succCallback - callback whenever query success
   * @param {Function} failCallback - callback whenever query fail
   * @return
   */
  query(input, succCallback, failCallback) {
    let url,
      data = {},
      handleAs = 'json';

    if (Request.prototype.isPrototypeOf(input)) {

      return this.__fetch(handleAs, input, succCallback, failCallback);

    } else if (Object.prototype.isPrototypeOf(input)) {

      ({
        url = this.throwNotFoundError("url"),
        data = {},
        handleAs = "json"
      } = input);

    } else {
      url = String(input);
    }

    return this.__get(handleAs, {url, data}, succCallback, failCallback);

  },

  /**
   * POST 请求
   *
   * ```javascript
   * 1. 直接传递一个Request 实例
   *  const req = new Request('/test?foo=1&bar=2', {method: 'POST'});
   *  this.post(req, console.log );
   *
   * 2. 直接传递一个url
   *  this.post('/test', console.log);
   *
   * 3. 直接传递一个包含url、data内容的对象
   *  this.post({
   *       url: '/test',
   *       data: { foo:1, bar:2 }
   *   }, console.log, console.log );
   *
   *  4. 上传文件
   *  const formData = new FormData();
   *  formData.append('file1', new File([], 'filename'));
   *  this.post({
   *      url: '/upload',
   *      data: formData
   *  }, console.log, console.log );
   *
   *  5. 发送json格式的数据
   *  this.post({
   *      url: '/upload',
   *      data: {foo:1,bar:2},
   *      sendAsJson: true
   *  }, console.log, console.log );
   * ```
   * ******************************************************
   *
   * @param {string|Request|Object} input -
   *      支持3种类型： String|Request|Object
   *      1. Request实例
   *      2. string：请求url
   *      3: Object： 对象结构要求 { url , data, handleAs, sendAsJson}
   *          url：必填项
   *          data：可选
   *          handleAs：string, 可选，默认值是"json"， 取值范围: text|json|blob|formData|arrayBuffer
   *          sendAsJson：boolean 可选，默认值是false
   *
   * @param {Function} succCallback - callback whenever post success
   * @param {Function} failCallback - callback whenever post fail
   * @return {*}
   */
  post(input, succCallback, failCallback) {

    let url,
      data = {},
      handleAs = 'json',
      sendAsJson = false;

    if (Request.prototype.isPrototypeOf(input)) {

      return this.__fetch(handleAs, input, succCallback, failCallback);

    } else if (Object.prototype.isPrototypeOf(input)) {

      ({
        url = this.throwNotFoundError("url"),
        data = {},
        handleAs = "json",
        sendAsJson = false,
      } = input);

    } else {
      url = String(input);
    }

    return this.__post(handleAs, {url, data, sendAsJson}, succCallback, failCallback);
  },


  __get(handleAs, {url, data}, succCallback, failCallback) {

    const reqUrl = new URL(window.location.origin + url);
    Object.keys(data).filter(key => data[key] != undefined).forEach((key) => reqUrl.searchParams.append(key, data[key]));

    const req = new Request(reqUrl, {
      method: "GET",
      credentials: "include"
    });

    return this.__fetch(handleAs, req, succCallback, failCallback);
  },

  __post(handleAs, {url, data, sendAsJson}, succCallback, failCallback) {
    let body, headers;
    if (sendAsJson) {
      headers = {
        'content-type': 'application/json;charset=utf-8'
      };
      body = JSON.stringify(data);
    } else if (data instanceof FormData) {
      body = data;
    } else {
      const searchParams = new URLSearchParams();
      Object.keys(data).forEach((key) => searchParams.append(key, data[key]));
      body = searchParams;
    }

    const req = new Request(url, {
      method: "POST",
      credentials: "include",
      headers,
      body
    });

    return this.__fetch(handleAs, req, succCallback, failCallback);
  },

  __fetch(handleAs, request, succCallback, failCallback) {
    this.showLoading();
    window.fetch(request).then(response => {
      this.hideLoading();
      if (response.ok) {
        // response content is blank
        if (response.headers.has('Content-length')
          && response.headers.get('Content-length') == 0) {

          succCallback && succCallback();
        } else {
          response[handleAs]().then(succCallback);
        }

      } else {
        response.text().then(failCallback);
      }

    }).catch(err => {
      Function.prototype.isPrototypeOf(failCallback) && failCallback(err.message);
      console.error(err);
      this.hideLoading();
    });
  }
};

export const AjaxBehavior = [BaseBehavior, AjaxBehaviorImpl];
