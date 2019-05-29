/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import {html, PolymerElement} from "@polymer/polymer/polymer-element";
import './behaviors/h2-elements-shared-styles.js';
import '@polymer/iron-icons';
import '@polymer/iron-icon';
import './h2-button';
import {H2Fetch} from './h2-fetch';
import './h2-tip';
import { TipBehavior } from './behaviors/tip-behavior';
import { BaseBehavior } from './behaviors/base-behavior';
import {mixinBehaviors} from "@polymer/polymer/lib/legacy/class";

export class H2Upload extends mixinBehaviors([BaseBehavior, TipBehavior], PolymerElement) {

  static get template() {
    return html`
<style include="h2-elements-shared-styles">
  :host {
    display: inline-block;
    padding: 10px;
    min-width: 300px;
  }
  .toolbar {
    height: 36px;
    justify-content: space-evenly;
    align-items: center;
    padding: 0 2px;
  }
  #file-chooser {
    display: none;
  }
  .content {
    margin-top: 10px;
    font-size: 14px;
    color: #666666;
  }
  .file {
    position: relative;
    cursor: pointer;
  }
  iron-icon[icon='clear'] {
    display: none;
  }
  .file:hover {
    background-color: #f5f7fa;
  }
  .file:hover iron-icon[icon='check'] {
    display: none;
  }
  .file:hover iron-icon[icon='clear'] {
    display: inline-block;
    color: #fdb03d;
  }
  iron-icon {
    width: 18px;
  }
  .rightIcon {
    position: absolute;
    right: 10px;
  }
</style>
<div>
  <div class="toolbar">
    <h2-button title="点击选择文件" on-click="_triggerChooseFile">选择文件</h2-button>
    <h2-button type="warning" on-click="upload">上传文件</h2-button>
    <input type="file" on-change="_chooseFile" id="file-chooser" accept$="[[accept]]" multiple$="[[multiple]]">
  </div>
  <div class="content">
    <template is="dom-repeat" items="[[files]]">
      <div class="file">
        <iron-icon icon="description"></iron-icon>
          [[item.name]]
        <iron-icon class="rightIcon" icon="clear" on-click="delete"></iron-icon>
        <iron-icon class="rightIcon" icon="check"></iron-icon>
      </div>
    </template>
    <slot name="list"></slot>
  </div>
</div>
        `;
  };

  static get properties() {
    return {
      accept: String,
      multiple: {
        type: Boolean,
        value: false
      },
      files: {
        type: Array,
        value: []
      },
      src: String,
      request: Object,
      response: {
        type: Object,
        notify: true
      }
    };
  };

  static get observers() {
    return []
  };

  ready() {
    super.ready();
  };

  _triggerChooseFile() {
    const fileChooser = this.$['file-chooser'];
    fileChooser && fileChooser['click']();
  };

  _chooseFile(e) {
    if (!this.multiple) {
      this.set('files', [e.target.files[0]]);
    } else {
      this.files = Array.prototype.slice.call(e.target.files).concat(this.files);
    }
    this.set('response', null);
  };

  delete({model: {index}}) {
    this.$['file-chooser'].value = '';
    this.splice('files', index, 1);
  };

  upload() {
    const fetchApi = new H2Fetch();
    let form = new FormData();
    if (!this.multiple) {
      form.append("file", this.files[0]);
    } else {
      form.append("file", this.files);
    }
    if (this.request) {
      for (let key in this.request) {
        form.append(key, this.request[key])
      }
    }
    fetchApi.fetchIt({method: "post", body: form, url: this.src}, {loading: true}).then(res => {
      return res.json();
    }).then(res => {
      if (res.status === 1) {
        this.set('files', []);
        this.$['file-chooser'].value = '';
        this.set('response', res);
        this.h2Tip.success('导入成功', 2500);
      } else {
        this.h2Tip.error(res.error, 2500);
      }
    }).catch(err => {
      console.error(err);
    })
  };

  static get is() {
    return "h2-upload";
  }
}

window.customElements.define(H2Upload.is, H2Upload);