'use babel';

export default class ImportText {

  constructor(importNameText, pathQuote, isSemicolon, extname, param) {
    this.importNameText = importNameText;
    this.pathQuote = pathQuote;
    this.isSemicolon = isSemicolon;
    this.extname = extname;
    this.param = param;
  }

  get extTS() {
    const pathQuote = this.pathQuote;
    const isSemicolon = this.isSemicolon;
    const importNameText = this.importNameText;
    return this.param.tsSupport === 0 ? `import  from ${pathQuote}${isSemicolon}`
      : this.param.tsSupport === 1    ? `import { ${importNameText} } from ${pathQuote}${isSemicolon}`
      : this.param.tsSupport === 2    ? `import { ${importNameText} as  } from ${pathQuote}${isSemicolon}`
      : this.param.tsSupport === 3    ? `import * as ${importNameText} from ${pathQuote}${isSemicolon}`
      : this.param.tsSupport === 4    ? `import ${pathQuote}${isSemicolon}` : 0;
  }

  get extJS() {
    const pathQuote = this.pathQuote;
    const isSemicolon = this.isSemicolon;
    return this.param.jsSupport === 0 ? `import  from ${pathQuote}${isSemicolon}`
      : this.param.jsSupport === 1    ? `import {  } from ${pathQuote}${isSemicolon}`
      : this.param.jsSupport === 2    ? `import {  as  } from ${pathQuote}${isSemicolon}`
      : this.param.jsSupport === 3    ? `import {  as name } from ${pathQuote}${isSemicolon}`
      : this.param.jsSupport === 4    ? `import * as  from ${pathQuote}${isSemicolon}`
      : this.param.jsSupport === 5    ? `import * as name from ${pathQuote}${isSemicolon}`
      : this.param.jsSupport === 6    ? `import ${pathQuote}${isSemicolon}`
      : this.param.jsSupport === 7    ? `var  = require(${pathQuote})${isSemicolon}`
      : this.param.jsSupport === 8    ? `const  = require(${pathQuote})${isSemicolon}`
      : this.param.jsSupport === 9    ? `var name = require(${pathQuote})${isSemicolon}`
      : this.param.jsSupport === 10   ? `const name = require(${pathQuote})${isSemicolon}`
      : this.param.jsSupport === 11   ? `var  = import(${pathQuote})${isSemicolon}`
      : this.param.jsSupport === 12   ? `const  = import(${pathQuote})${isSemicolon}`
      : this.param.jsSupport === 13   ? `var name = import(${pathQuote})${isSemicolon}`
      : this.param.jsSupport === 14   ? `const name = import(${pathQuote})${isSemicolon}` : 0;
  }

  get extTSX() {
    const pathQuote = this.pathQuote;
    const isSemicolon = this.isSemicolon;
    const importNameText = this.importNameText;
    return this.param.tsxSupport === 0 ? `import  from ${pathQuote}${isSemicolon}`
      : this.param.tsxSupport === 1    ? `import { ${importNameText} } from ${pathQuote}${isSemicolon}`
      : this.param.tsxSupport === 2    ? `import { ${importNameText} as  } from ${pathQuote}${isSemicolon}`
      : this.param.tsxSupport === 3    ? `import * as ${importNameText} from ${pathQuote}${isSemicolon}`
      : this.param.tsxSupport === 4    ? `import ${pathQuote}${isSemicolon}` : 0;
  }

  get extJSX() {
    const pathQuote = this.pathQuote;
    const isSemicolon = this.isSemicolon;
    return this.param.jsxSupport === 0 ? `import  from ${pathQuote}${isSemicolon}`
      : this.param.jsxSupport === 1    ? `import {  } from ${pathQuote}${isSemicolon}`
      : this.param.jsxSupport === 2    ? `import {  as  } from ${pathQuote}${isSemicolon}`
      : this.param.jsxSupport === 3    ? `import {  as name } from ${pathQuote}${isSemicolon}`
      : this.param.jsxSupport === 4    ? `import * as  from ${pathQuote}${isSemicolon}`
      : this.param.jsxSupport === 5    ? `import * as name from ${pathQuote}${isSemicolon}`
      : this.param.jsxSupport === 6    ? `import ${pathQuote}${isSemicolon}`
      : this.param.jsxSupport === 7    ? `var  = require(${pathQuote})${isSemicolon}`
      : this.param.jsxSupport === 8    ? `const  = require(${pathQuote})${isSemicolon}`
      : this.param.jsxSupport === 9    ? `var name = require(${pathQuote})${isSemicolon}`
      : this.param.jsxSupport === 10   ? `const name = require(${pathQuote})${isSemicolon}`
      : this.param.jsxSupport === 11   ? `var  = import(${pathQuote})${isSemicolon}`
      : this.param.jsxSupport === 12   ? `const  = import(${pathQuote})${isSemicolon}`
      : this.param.jsxSupport === 13   ? `var name = import(${pathQuote})${isSemicolon}`
      : this.param.jsxSupport === 14   ? `const name = import(${pathQuote})${isSemicolon}` : 0;
  }


  get extCSS() {
    const pathQuote = this.pathQuote;
    const isSemicolon = this.isSemicolon;
    return this.param.cssSupport === 0 ? `@import ${pathQuote}${isSemicolon}`
      : this.param.cssSupport === 1    ? `@import url(${pathQuote})${isSemicolon}` : 0;
  }

  get extSCSS() {
    let pathQuote     = this.pathQuote;
    const isSemicolon = this.isSemicolon;
    pathQuote = pathQuote.replace(/_/gi, '');
    return this.param.scssSupport === 0 ? `@import ${pathQuote}${isSemicolon}`
      : this.param.scssSupport === 1    ? `@import url(${pathQuote})${isSemicolon}`
      : this.param.scssSupport === 2    ? `@use ${pathQuote}${isSemicolon}` : 0;
  }

  get extLESS() {
    const pathQuote = this.pathQuote;
    const isSemicolon = this.isSemicolon;
    return this.param.lessSupport === 0 ? `@import ${pathQuote}${isSemicolon}`
      : this.param.lessSupport === 1    ? `@import () ${pathQuote}${isSemicolon}` : 0;
  }

  get convertedImportText() {
    if (this.extname === '.js')        return this.extJS;
    else if (this.extname === '.jsx')  return this.extJSX;
    else if (this.extname === '.ts')   return this.extTS;
    else if (this.extname === '.tsx')  return this.extTSX;
    else if (this.extname === '.css')  return this.extCSS;
    else if (this.extname === '.scss') return this.extSCSS;
    else if (this.extname === '.sass') return this.extSCSS;
    else if (this.extname === '.less') return this.extLESS;
  }
}
