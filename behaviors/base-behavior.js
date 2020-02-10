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
    return (model && (key in model)) ? model[key] : defVal;
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
  }
};
