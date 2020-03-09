'use babel';

import path from 'path';
import relative from 'relative';
import subAtom from 'sub-atom';
import camelcase from 'camelcase';

import ImportText from './import-text';
const { retrieval, registrar } = require('./package-configs');
const { import_position } = require('./import-position');

export default {

  subscriptions: null,
  config: registrar,

  initializeApp() {

    this.param = retrieval;

    atom.config.observe('javascript-drag-import.preferences.importPosition', (newValue) => {
      this.param.importPosition = newValue;
      const entryCond = !this.param.importPosition && !this.param.importCursor;
      const importCond = this.param.importPosition === this.param.importCursor;
      if (entryCond) return;
      typeof newValue === 'boolean' && importCond
        ? atom.config.set('javascript-drag-import.preferences.importCursor', newValue ? 'false' : 'true') : 0;
    });

    atom.config.observe('javascript-drag-import.preferences.importCursor', (newValue) => {
      this.param.importCursor = newValue;
      const entryCond = !this.param.importPosition && !this.param.importCursor;
      const importCond = this.param.importPosition === this.param.importCursor;
      if (entryCond) return;
      typeof newValue === 'boolean' && importCond
        ? atom.config.set('javascript-drag-import.preferences.importPosition', newValue ? 'false' : 'true') : 0;
    });

    atom.config.observe('javascript-drag-import.preferences.importQuote', (newValue) => (this.param.importQuote = newValue));
    atom.config.observe('javascript-drag-import.preferences.addSemicolon', (newValue) => (this.param.addSemicolon = newValue));
    atom.config.observe('javascript-drag-import.preferences.disableNotifs', (newValue) => (this.param.disableNotifs = newValue));
    atom.config.observe('javascript-drag-import.preferences.closeAllNotif', (newValue) => (this.param.closeAllNotif = newValue));
    atom.config.observe('javascript-drag-import.import statements.javascript.jsSupport', (newValue) => (this.param.jsSupport = newValue));
    atom.config.observe('javascript-drag-import.import statements.javascript.jsxSupport', (newValue) => (this.param.jsxSupport = newValue));
    atom.config.observe('javascript-drag-import.import statements.javascript.withExtnameJS', (newValue) => (this.param.jsExtname = newValue));
    atom.config.observe('javascript-drag-import.import statements.typescript.tsSupport', (newValue) => (this.param.tsSupport = newValue));
    atom.config.observe('javascript-drag-import.import statements.typescript.tsxSupport', (newValue) => (this.param.tsxSupport = newValue));
    atom.config.observe('javascript-drag-import.import statements.typescript.withExtnameTS', (newValue) => (this.param.tsExtname = newValue));
    atom.config.observe('javascript-drag-import.import statements.typescript.addExportName', (newValue) => (this.param.addExportName = newValue));
    atom.config.observe('javascript-drag-import.import statements.stylesheet.cssSupport', (newValue) => (this.param.cssSupport = newValue));
    atom.config.observe('javascript-drag-import.import statements.stylesheet.scssSupport', (newValue) => (this.param.scssSupport = newValue));
    atom.config.observe('javascript-drag-import.import statements.stylesheet.lessSupport', (newValue) => (this.param.lessSupport = newValue));
    atom.config.observe('javascript-drag-import.import statements.stylesheet.withExtnameCSS', (newValue) => (this.param.cssExtname = newValue));
  },

  removeExtname(relativePath, extname) {
    const  normalizeLinux   =   relativePath.split('\\').join('/');
    const  normalizeWindows = normalizeLinux.split('//').join('/');
    return normalizeWindows.split(extname)[0];
  },

  importDragFile(relativePath, editor) {

    const extname   = path.extname(relativePath);
    const cleanPath = this.removeExtname(relativePath, extname);

    let importName = cleanPath.split('/').reverse()[0];
        importName = camelcase(importName, { pascalCase: true });

    const cursorPosition =
      atom.workspace.getActiveTextEditor() != undefined
        ? atom.workspace.getActiveTextEditor().getCursorBufferPosition() : 0;

    const isSameDir = cleanPath[0] === '.';
    const singleOtherDir = `'${cleanPath}'`,
          doubleOtherDir = `"${cleanPath}"`,
          singleSameDir = `'./${cleanPath}'`,
          doubleSameDir = `"./${cleanPath}"`;

    const importNameText = this.param.addExportName ? importName : '';
    const isSemicolon = this.param.addSemicolon ? ';' : '';
    const pathQuote = isSameDir
          ? this.param.importQuote ? singleOtherDir : doubleOtherDir
          : this.param.importQuote ? singleSameDir : doubleSameDir;

    const fromClass = new ImportText(importNameText, pathQuote, isSemicolon, extname, this.param);
    const importText = fromClass.convertedImportText;

    this.param.importCursor
      ? import_position.importToSelectedLine(this.param, importText, editor, importName, cursorPosition)
      : this.param.importPosition
        ? import_position.importToBottom(this.param, importText, editor, importName, cursorPosition)
        : import_position.importToTop(this.param, importText, editor, importName);
  },

  setup(item) {

    const enableNotif    = !this.param.disableNotifs;
    const isFile         = item.target.hasOwnProperty('file');
    const isDirectory    = item.target.hasOwnProperty('directory');
    const activePane     = atom.workspace.getActiveTextEditor();
    const script         = [ '.js', '.jsx', '.ts', '.tsx' ];
    const stylesheet     = [ '.css', '.scss', '.sass', '.less' ];
    const validFileTypes = [ ...script, ...stylesheet ];
    const fromPath       = isFile ? item.target.file.path : '';
    const toPath         = activePane.getPath().toString();
    const relativePath   = relative(toPath, fromPath);
    const fromFileType   = path.extname(fromPath);
    const toFileType     = path.extname(toPath);
    const from_valid     = validFileTypes.some(el => fromFileType.includes(el));
    const to_valid       = validFileTypes.some(el => toFileType.includes(el));
    const isSamePath     = (fromPath === toPath);
    const isBothValid    = (from_valid && to_valid);
    const isSameType     = (fromFileType === toFileType);

    if (isSamePath && isBothValid && isSameType && enableNotif)
      import_position.notify({ invalidFileTrue: false, isSameValid: true, notSupportedValid: 0, isDirectory }, fromFileType, toFileType);
    else if (!isSamePath && !isBothValid && isSameType && enableNotif)
      import_position.notify({ invalidFileTrue: false, isSameValid: 0, notSupportedValid: true, isDirectory }, fromFileType, toFileType);
    else if (isSamePath && !isBothValid && isSameType && enableNotif)
      import_position.notify({ invalidFileTrue: false, isSameValid: false, notSupportedValid: 0, isDirectory }, fromFileType, toFileType);
    else if (!isSamePath && !isBothValid && !isSameType && enableNotif)
      import_position.notify({ invalidFileTrue: false, isSameValid: 0, notSupportedValid: false, isDirectory }, fromFileType, toFileType);
    else if (!isSamePath && isBothValid && !isSameType && enableNotif)
      import_position.notify({ invalidFileTrue: true, isSameValid: 0, notSupportedValid: 0, isDirectory }, fromFileType, toFileType);
    else if (!isSamePath && isBothValid && isSameType)
      this.importDragFile(relativePath, activePane)
  },

  activate(state) {

    this.subscriptions = new subAtom();
    this.initializeApp();

    this.subscriptions.add(atom.workspace.observeTextEditors((editor) => {

      const editorView = atom.views.getView(editor);
      const lines = editorView.querySelector('.lines');
      const leftDock = atom.workspace.paneContainers.left.refs.wrapperElement;

      let valid = false;
         lines.addEventListener("dragenter", () => (valid = true),  false);
      leftDock.addEventListener("dragenter", (e) => e.target.ondragenter = () => (valid = false), false);

      this.subscriptions.add(lines, "drop", (_lines) => {
        _lines.preventDefault();

        leftDock.ondragend = (item) => {
          valid ? this.setup(item) : 0;
        }
      });

      this.subscriptions.add(lines, 'keydown', e => {
        if (e.originalEvent.key === 'Escape') {
          const closeAll = document.querySelectorAll('atom-workspace .close');
          this.param.closeAllNotif
            ? closeAll.forEach((a) => (a.click()))
            : closeAll.forEach((a, i) => (closeAll.length === (i + 1) ? a.click() : 0));
        }
      });
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  serialize() {
  }

};
