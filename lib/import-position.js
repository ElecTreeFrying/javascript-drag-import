
const { import_notification } = require('./import-notification');

const import_position = {

  importToSelectedLine: (param, importText, editor, importName, cursorPosition) => {

    const currentPosition = editor.getCursorBufferPosition();
    editor.setCursorBufferPosition([cursorPosition.row, 0]);
    editor.insertText(`${importText}\n`);
    editor.setCursorBufferPosition(currentPosition);

    import_notification.success = { importName, editor, param };
  },

  importToTop: (param, importText, editor, importName) => {

    const currentPosition = editor.getCursorBufferPosition();
    editor.setCursorBufferPosition([0, 0]);
    editor.insertText(`${importText}\n`);
    editor.setCursorBufferPosition(currentPosition);

    import_notification.success = { importName, editor, param };
  },

  importToBottom: (param, importText, editor, importName, cursorPosition) => {

    const curPosition  = editor.getCursorBufferPosition();
    const dragFileText = editor.getText().toString();
    const activePane   = atom.workspace.getActiveTextEditor();

    let replaceIndex   = 0,
        breakPoint     = false;

    dragFileText.split('\n').forEach((e, i) => {
      const includesImport  = e.includes('import') || e.includes('require(');
      const includesQuote   = /['||"]/.test(e);
      const cond = (includesImport && includesQuote) && !breakPoint;
      cond ? replaceIndex++ : breakPoint = true;
    });

    editor.setCursorBufferPosition([replaceIndex, 0]);
    editor.insertText(`${importText}\n`);
    editor.setCursorBufferPosition(curPosition);

    import_notification.success = { importName, editor, param };
  },

  notify: (options, fromFileType, toFileType) => {
    import_notification.notify(options, fromFileType, toFileType);
  }

};

module.exports = { import_position };
