#!/usr/bin/env node

var fs = require('fs')
  , util = require('util')
  , path = require('path')
  , colors = require('colors') // It's colours I tell ya. Colours!!!
  , program = require('commander')
  , Validator = require('lintspaces')
  , version = require('./package.json').version
  , validator = null
  , targetFiles = null
  , files = null;


/**
 * Split comma separated list into array.
 * @param {String}
 */
function list (l) {
  return l.split(',');
}

/**
 * Check does the provided editorconfig exist
 * @param {String}
 */
function resolveEditorConfig (e) {
  if (e) {
    e = path.resolve(e)

    if (!fs.existsSync(e)) {
      console.log('Error: Specified .editorconfig "%s" doesn\'t exist'.red, e);
      process.exit(1);
    }

    return e;
  }

  return e;
}


program.version(version)
  .option('-n, --newline', 'Require newline at end of file.')
  .option('-l, --maxnewlines <n>', 'Specify max number of newlines between' +
    ' blocks.', parseInt)
  .option('-t, --trailingspaces', 'Tests for useless whitespaces' +
    ' (trailing whitespaces) at each lineending of all files.')
  .option('-d, --indentation <s>', 'Check indentation is "tabs" or "spaces".')
  .option('-s, --spaces <n>', 'Used in conjunction with -i to set number of ' +
    'spaces.', parseInt)
  .option('-i, --ignores <items>', 'Comma separated list of ignores.', list)
  .option('-e, --editorconfig <s>', 'Use editorconfig specified at this ' +
   ' file path for settings.', resolveEditorConfig)
  .parse(process.argv);


// Setup validator with user options
validator = new Validator({
  newline: program.newline,
  newlineMaximum: program.maxnewlines,
  trailingspaces: program.trailingspaces,
  indentation: program.indentation,
  spaces: program.spaces,
  ignores: program.ignores,
  editorconfig: program.editorconfig
});


// Get files from args to support **/* syntax. Probably not the best way...
targetFiles = process.argv.filter(fs.existsSync);


// Run validation
for (var file in targetFiles) {
  validator.validate(path.resolve(targetFiles[file]));
}
files = validator.getInvalidFiles();


// Output results
for (var file in files) {
  console.warn(util.format('\nFile: %s', file).red.underline);
  for (var line in files[file]) {
    for(var err in files[file][line]) {
      console.warn('Line: %s', line, files[file][line][err]);
    }
  }
}


// Give error exit code if required
if (Object.keys(files).length) {
  process.exit(1);
}
