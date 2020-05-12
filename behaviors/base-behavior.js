import '../h2-loading.js';

/**
 * @polymerBehavior
 */
export const BaseBehavior = {
  /**
   * 判断第一个参数是否与后面的某个参数相等， 使用Object.is() 进行判断
   * @param {...*} args
   * @return {boolean}
   */
  isOneOf(...args) {
    if (Array.isArray(args) && args.length > 0) {
      const target = args[0];
      return args.slice(1).some(arg => Object.is(arg, target));
    }
    
    return false;
  },
  
  /**
   * 判断两个值是否相等，使用 `Object.is` 判断。
   * @param {*} left
   * @param {*} right
   * @returns {Boolean}
   */
  isEqual(left, right) {
    return Object.is(left, right);
  },
  
  /**
   * 判断传入参数两两是否全部相等
   * @param args
   * @return {boolean}
   */
  allEqual(...args) {
    for(let i = 0, len = args.length; i < len; i = i + 2) {
      if(i + 1 >= len || !Object.is(args[i], args[i + 1])) return false;
    }
    return true;
  },
  
  /**
   * 判断传入参数两两是否存在一对相等
   * @param args
   * @return {boolean}
   */
  someEqual(...args) {
    for(let i = 0, len = args.length - 1; i < len; i = i + 2) {
      if(Object.is(args[i], args[i + 1])) return true;
    }
    return false;
  },
  /**
   * 函数判断
   * @param {*} fn
   * @returns {Boolean}
   */
  isFunction(fn) {
    return Function.prototype.isPrototypeOf(fn);
  },
  
  /**
   * Return the first giving arg which is not ``undefined``, ``null``, ``NaN`` , ``false`` ,``0`` or ``''``.
   *
   * eg.
   * ```
   * orElse(undefined, null, "foo")  // "foo"
   * orElse(0, 1)  // 1
   * orElse("bar", "foo")  // "bar"
   * ```
   * @param {...*} args
   * @returns {*}
   */
  orElse(...args) {
    const [first, ...rest] = args;
    return rest.length === 0 ? first : (first || this.orElse(...rest));
  },
  
  /**
   * 通过key查询对象中的值
   * @param {Object} model
   * @param {String} key
   * @param {String} defVal  支持任何符合json格式的字符串
   * @returns {*}
   */
  getValueByKey(model, key, defVal = "") {
    return (model && (key in model) && model[key] !== undefined) ? model[key] : defVal;
  },
  
  /**
   * 等价于 model[key1 || key2 || ...]
   * @param {Object} model
   * @param {...String} keys
   * @returns {*}
   */
  getValueOrElse(model, ...keys) {
    const key = this.orElse(...keys);
    return this.getValueByKey(model, key);
  },
  /**
   * 等价于 model[key1 || key2 || ...] 如果找不到值，返回null
   * @param {Object} model
   * @param {...String} keys
   * @returns {*}
   */
  getValueOrElseNull(model, ...keys) {
    const key = this.orElse(...keys);
    return this.getValueByKey(model, key, null);
  },
  /**
   * 等价于 model[key1 || key2 || ...] 如果找不到值，返回 undefined
   * @param {Object} model
   * @param {...String} keys
   * @returns {*}
   */
  getValueOrElseUndefined(model, ...keys) {
    const key = this.orElse(...keys);
    return (model && (key in model)) ? model[key] : undefined;
  },
  /**
   * 解析json串，如果传入参数不符合json标准，则原样返回
   * @param val
   * @return {*}
   */
  resolveJsonValue(val) {
    try {
      if (typeof val === 'string') {
        return JSON.parse(val)
      }
    } catch (e) {
    }
    
    return val;
  },
  /**
   * 通过路径获取对象字段值
   * @param {Object} model eg. { foo: { bar: 1} }
   * @param {String} path  eg. "foo.bar"
   * @param {*} defVal  如果传入的是符合json格式的字符串，会返回JSON.parse处理的结果
   * @returns {*}
   */
  getValueByPath(model, path = '', defVal) {
    if (!model) return this.resolveJsonValue(defVal);
    
    const splits = path.split('.');
    let copy = model;
    for (let key of splits) {
      if (!copy[key]) return this.resolveJsonValue(defVal);
      copy = copy[key];
    }
    return copy;
  },
  
  /**
   * 通过路径设置对象字段值， 如果路径不存在，会抛出异常
   * @param model
   * @param path
   * @param value
   * @return {*}
   */
  setValueByPath(model, path, value) {
    const paths = String(path).split(".");
    
    let tmp = model, ctx, key;
    for (key of paths) {
      if (key in tmp) {
        ctx = tmp;
        tmp = tmp[key];
      } else {
        throw new Error(`path ${key} not found in the giving object`);
      }
    }
    ctx[key] = value;
    
    return model;
  },
  
  /**
   * 根据路径生成对象，如 path='a.b' 返回 {a: {b: {}}}, 如果指定了target, 会在target上生成不存在的key
   * @param path
   * @param target
   */
  mkObject(path = '', target = {}) {
    const paths = String(path).split(".");
    
    if (String(path).length > 0) {
      paths.reduce((res, p) => {
        if (!(p in res && typeof res[p] === 'object')) res[p] = {};
        return res[p];
      }, target);
    }
    
    return target;
  },
  
  /**
   * To boolean.
   * @param {*} val
   */
  toBoolean(val) {
    return !!val;
  },
  
  
  /**
   * check if there's a truthy in the giving args
   * @param {*} val
   */
  isExistTruthy(...args) {
    return args.some(arg => !!arg)
  },
  
  /**
   * Check if an array is empty.
   * @param arr
   * @returns {boolean}
   */
  isArrayEmpty(arr = []) {
    return arr.length === 0;
  },
  /**
   * 简单数学运算
   * @param first
   * @param op
   * @param nums
   * @returns {*}
   */
  calc(first, op, ...nums) {
    switch (op) {
      case '+':
        return nums.reduce((res, num) => res + num, first);
      case '-':
        return nums.reduce((res, num) => res - num, first);
      case '*':
        return nums.reduce((res, num) => res * num, first);
      case '/':
        return nums.reduce((res, num) => res / num, first);
      case '%':
        return nums.reduce((res, num) => res % num, first);
      default:
        return '';
    }
  },
  
  toggleClass(target, className) {
    if (target instanceof Element) {
      if (target.classList.contains(className)) {
        target.classList.remove(className);
      } else {
        target.classList.add(className);
      }
    }
  },
  
  /**
   * 添加loading
   */
  showLoading() {
    let loadingDiv = document.body.querySelector("#h2-loading");
    if (!loadingDiv) {
      loadingDiv = document.createElement("h2-loading");
      loadingDiv.setAttribute("id", "h2-loading");
      loadingDiv.noCancelOnOutsideClick = true;
      loadingDiv.noCancelOnEscKey = true;
      // loadingDiv.withBackdrop = true;
      document.body.appendChild(loadingDiv);
    }
    this.async(function () {
      loadingDiv.open();
    }, 0);
  },
  /**
   * 消除loading
   */
  hideLoading() {
    this.async(function () {
      const loadingDiv = document.body.querySelector("#h2-loading");
      loadingDiv && loadingDiv.close();
    }, 0);
  },
  
  throwNotFoundError(string) {
    throw new TypeError(string + " should not be undefined.")
  },
  
  deepClone(obj) {
    return obj == null || typeof (obj) !== "object" ? obj : JSON.parse(JSON.stringify(obj));
  },
  
  optional(bool, trueReturn, falseReturn = '') {
    return bool ? trueReturn : falseReturn;
  },
  
  /**
   * 用法：
   * this.groupBy(array, 'a', 'nogroup');
   * this.groupBy(array, (item) => item.a || 'nogroup');
   *
   * 对数组进行分组，如给定[{a: 'group1', b: 2}, {a: 'group1', b: 4}, {a: 'group2', b: 5}] 返回 { 'group1': [{a: 'group1', b: 2}, {a: 'group1', b: 4}], 'group2': [ {a: 'group2', b: 5}] }
   * @param array
   * @param iteratee， The iteratee to transform keys.，如 'bar'， 或 'foo.bar' 或 Function
   * @param defaultGroup, 当指定的分组字段不存在时，归类到的默认分组
   * @return Object
   */
  groupBy(array, iteratee, defaultGroup = 'wilding') {
    let valueResolver, args;
    if (this.isFunction(iteratee)) {
      valueResolver = iteratee;
      args = [];
    } else {
      valueResolver = this.getValueByPath;
      args = [iteratee, defaultGroup];
    }
    return array.reduce((res, item) => {
      const val = valueResolver.call(this, item, ...args);
      const group = res[val] || [];
      group.push(item);
      res[val] = group;
      return res;
    }, {});
  },
  
  /**
   * this.partition([1,2,3], item => item > 2);  返回 [[3], [1, 2]]
   * this.partition([{a: 1}, {a: 2}],  {a: 1});  返回 [[{a: 1}], [{a: 2}]]
   *this.partition([{a: 1}, {a: 2}],  'a');  返回 [[{a: 1}, {a: 2}], []]
   *
   * Creates an array of elements split into two groups, the first of which contains elements predicate returns truthy for, the second of which contains elements predicate returns falsey for.
   * @param array
   * @param predicate
   * @return
   */
  partition(array, predicate) {
    let _predicate;
    if (this.isFunction(predicate)) {
      _predicate = predicate;
    } else if (Object.prototype.isPrototypeOf(predicate)) {
      _predicate = (item) => Object.entries(predicate).every(([key, value]) => item[key] === value)
    } else if (typeof predicate === 'string') {
      _predicate = (item) => item[predicate];
    } else {
      throw new TypeError(`Unsupported predicate type ${typeof predicate}`)
    }
    
    return array.reduce((res, item) => {
      if (_predicate.call(this, item)) {
        res[0].push(item);
      } else {
        res[1].push(item);
      }
      return res;
    }, [[], []]);
  },

  /*
  * Add integers, wrapping at 2^32. This uses 16-bit operations internally
  * to work around bugs in some JS interpreters.
  */
  safe_add(x, y) {
    var lsw = (x & 0xFFFF) + (y & 0xFFFF),
        msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xFFFF);
  },

  /*
  * Bitwise rotate a 32-bit number to the left.
  */
  bit_rol(num, cnt) {
    return (num << cnt) | (num >>> (32 - cnt));
  },

  /*
  * These functions implement the four basic operations the algorithm uses.
  */
  md5_cmn(q, a, b, x, s, t) {
    return this.safe_add(this.bit_rol(this.safe_add(this.safe_add(a, q), this.safe_add(x, t)), s), b);
  },
  md5_ff(a, b, c, d, x, s, t) {
    return this.md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
  },
  md5_gg(a, b, c, d, x, s, t) {
    return this.md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
  },
  md5_hh(a, b, c, d, x, s, t) {
    return this.md5_cmn(b ^ c ^ d, a, b, x, s, t);
  },
  md5_ii(a, b, c, d, x, s, t) {
    return this.md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
  },

  /*
  * Calculate the MD5 of an array of little-endian words, and a bit length.
  */
  binl_md5(x, len) {
    /* append padding */
    x[len >> 5] |= 0x80 << (len % 32);
    x[(((len + 64) >>> 9) << 4) + 14] = len;

    var i, olda, oldb, oldc, oldd,
        a = 1732584193,
        b = -271733879,
        c = -1732584194,
        d = 271733878;

    for (i = 0; i < x.length; i += 16) {
      olda = a;
      oldb = b;
      oldc = c;
      oldd = d;

      a = this.md5_ff(a, b, c, d, x[i], 7, -680876936);
      d = this.md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
      c = this.md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
      b = this.md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
      a = this.md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
      d = this.md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
      c = this.md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
      b = this.md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
      a = this.md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
      d = this.md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
      c = this.md5_ff(c, d, a, b, x[i + 10], 17, -42063);
      b = this.md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
      a = this.md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
      d = this.md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
      c = this.md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
      b = this.md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);

      a = this.md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
      d = this.md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
      c = this.md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
      b = this.md5_gg(b, c, d, a, x[i], 20, -373897302);
      a = this.md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
      d = this.md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
      c = this.md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
      b = this.md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
      a = this.md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
      d = this.md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
      c = this.md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
      b = this.md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
      a = this.md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
      d = this.md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
      c = this.md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
      b = this.md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);

      a = this.md5_hh(a, b, c, d, x[i + 5], 4, -378558);
      d = this.md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
      c = this.md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
      b = this.md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
      a = this.md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
      d = this.md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
      c = this.md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
      b = this.md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
      a = this.md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
      d = this.md5_hh(d, a, b, c, x[i], 11, -358537222);
      c = this.md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
      b = this.md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
      a = this.md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
      d = this.md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
      c = this.md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
      b = this.md5_hh(b, c, d, a, x[i + 2], 23, -995338651);

      a = this.md5_ii(a, b, c, d, x[i], 6, -198630844);
      d = this.md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
      c = this.md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
      b = this.md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
      a = this.md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
      d = this.md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
      c = this.md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
      b = this.md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
      a = this.md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
      d = this.md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
      c = this.md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
      b = this.md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
      a = this.md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
      d = this.md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
      c = this.md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
      b = this.md5_ii(b, c, d, a, x[i + 9], 21, -343485551);

      a = this.safe_add(a, olda);
      b = this.safe_add(b, oldb);
      c = this.safe_add(c, oldc);
      d = this.safe_add(d, oldd);
    }
    return [a, b, c, d];
  },

  /*
  * Convert an array of little-endian words to a string
  */
  binl2rstr(input) {
    var i,
        output = '';
    for (i = 0; i < input.length * 32; i += 8) {
      output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xFF);
    }
    return output;
  },

  /*
  * Convert a raw string to an array of little-endian words
  * Characters >255 have their high-byte silently ignored.
  */
  rstr2binl(input) {
    var i,
        output = [];
    // @ts-ignore
    output[(input.length >> 2) - 1] = undefined;
    for (i = 0; i < output.length; i += 1) {
      // @ts-ignore
      output[i] = 0;
    }
    for (i = 0; i < input.length * 8; i += 8) {
      // @ts-ignore
      output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (i % 32);
    }
    return output;
  },

  /*
  * Calculate the MD5 of a raw string
  */
  rstr_md5(s) {
    return this.binl2rstr(this.binl_md5(this.rstr2binl(s), s.length * 8));
  },

  /*
  * Calculate the HMAC-MD5, of a key and some data (raw strings)
  */
  rstr_hmac_md5(key, data) {
    var i,
        bkey = this.rstr2binl(key),
        ipad = [],
        opad = [],
        hash;
    this.ipad[15] = this.opad[15] = undefined;
    if (bkey.length > 16) {
      bkey = this.binl_md5(bkey, key.length * 8);
    }
    for (i = 0; i < 16; i += 1) {
      this.ipad[i] = bkey[i] ^ 0x36363636;
      this.opad[i] = bkey[i] ^ 0x5C5C5C5C;
    }
    hash = this.binl_md5(ipad.concat(this.rstr2binl(data)), 512 + data.length * 8);
    return this.binl2rstr(this.binl_md5(opad.concat(hash), 512 + 128));
  },

  /*
  * Convert a raw string to a hex string
  */
  rstr2hex(input) {
    var hex_tab = '0123456789abcdef',
        output = '',
        x,
        i;
    for (i = 0; i < input.length; i += 1) {
      x = input.charCodeAt(i);
      output += hex_tab.charAt((x >>> 4) & 0x0F) +
          hex_tab.charAt(x & 0x0F);
    }
    return output;
  },

  /*
  * Encode a string as utf-8
  */
  str2rstr_utf8(input) {
    return unescape(encodeURIComponent(input));
  },

  /*
  * Take string arguments and return either raw or hex encoded strings
  */
  raw_md5(s) {
    return this.rstr_md5(this.str2rstr_utf8(s));
  },
  hex_md5(s) {
    return this.rstr2hex(this.raw_md5(s));
  },
  raw_hmac_md5(k, d) {
    return this.rstr_hmac_md5(this.str2rstr_utf8(k), this.str2rstr_utf8(d));
  },
  hex_hmac_md5(k, d) {
    return this.rstr2hex(this.raw_hmac_md5(k, d));
  },

  md5(string, key, raw) {
    if (!key) {
      if (!raw) {
        return this.hex_md5(string);
      }
      return this.raw_md5(string);
    }
    if (!raw) {
      return this.hex_hmac_md5(key, string);
    }
    return this.raw_hmac_md5(key, string);
  }
};
