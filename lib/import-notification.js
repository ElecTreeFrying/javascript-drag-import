import path from 'path';

const import_notification = {

  set success(config) {

    const _path       = config.editor.getPath().toString();
    const extname     = path.extname(_path);
    const enableNotif = !config.param.disableNotifs;

    config.param.addExportName && extname.includes('ts') && enableNotif
    ? atom.notifications.addSuccess(`Successfully added ${config.importName} to import!`)
    : enableNotif ? atom.notifications.addSuccess(`New import added!`) : 0;
  },

  notify: (options, fromFileType, toFileType) => {
    const { isSameValid, notSupportedValid, invalidFileTrue, isDirectory } = options;
    const notif = atom.notifications;
    const append = fromFileType.toUpperCase().substring(1);

    invalidFileTrue                                               ? notif.addWarning(`Unable to import ${fromFileType} to ${toFileType}.`)
    : isDirectory                                                 ?   notif.addError('File not found.')
    : !invalidFileTrue && isSameValid                             ?    notif.addInfo('Same file path.')
    : !invalidFileTrue && notSupportedValid                       ? notif.addWarning(`${append} files not supported.`)
    : !invalidFileTrue && !isSameValid && notSupportedValid === 0 ? notif.addWarning(`Same file path. ${append} files not supported.`)
    : !invalidFileTrue && !notSupportedValid && isSameValid === 0 ?   notif.addError('Import failed.') : 0;
  }

};

module.exports = { import_notification };
