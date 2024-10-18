module.exports = function (process, console) {
  // It's colours I tell ya. Colours!!!
  require('colors')

  const fs = require('fs')
  const map = require('lodash.map')
  const util = require('util')
  const path = require('path')
  const Command = require('commander').Command
  const glob = require('glob')
  const Validator = require('lintspaces')
  const version = require('./package.json').version

  // Ensures commander instances are unique per invocation.
  // This is only required if running tests or using this as a module.
  const program = new Command()

  let validator = null
  let targetFiles = null
  let files = null

  /**
   * Accumlate list items.
   * @param {String}
   */
  function list(list) {
    list = list || []

    return function(entry) {
      list.push(entry)
      return list
    }
  }

  /**
   * Check does the provided editorconfig exist
   * @param {String}
   */
  function resolveEditorConfig(e) {
    if (e) {
      e = path.resolve(e)

      if (!fs.existsSync(e)) {
        console.log('Error: Specified .editorconfig "%s" doesn\'t exist'.red, e)
        process.exit(1)
      }

      return e
    }

    return e
  }

  program
    .name('lintspaces')
    .version(version)
    .option('-n, --newline', 'Require newline at end of file.')
    .option(
      '-g, --guessindentation',
      'Tries to guess the indention of a line depending on previous lines.'
    )
    .option(
      '-b, --skiptrailingonblank',
      'Skip blank lines in trailingspaces check.'
    )
    .option(
      '-it, --trailingspacestoignores',
      'Ignore trailing spaces in ignores.'
    )
    .option(
      '-l, --maxnewlines <n>',
      'Specify max number of newlines between blocks.',
      x => parseInt(x, 10)
    )
    .option(
      '-t, --trailingspaces',
      'Tests for useless whitespaces' +
        ' (trailing whitespaces) at each line ending of all files.'
    )
    .option('-d, --indentation <s>', 'Check indentation is "tabs" or "spaces".')
    .option(
      '-s, --spaces <n>',
      'Used in conjunction with -d to set number of spaces.',
      x => parseInt(x, 10)
    )
    .option(
      '-i, --ignores <items>',
      'Comma separated list of ignores built in ignores.',
      list(),
      []
    )
    .option(
      '-r, --regexignores <items>',
      'Comma separated list of ignores that should be parsed as Regex',
      list(),
      []
    )
    .option(
      '-e, --editorconfig <s>',
      'Use editorconfig specified at this file path for settings.',
      resolveEditorConfig
    )
    .option('-o, --allowsBOM', 'Sets the allowsBOM option to true')
    .option('-v, --verbose', 'Be verbose when processing files')
    .option('--matchdotfiles', 'Match dotfiles')
    .option('--endofline <s>', 'Enables EOL checks. Supports "LF" or "CRLF" or "CR" values')
    .option('--json', 'Output the raw JSON results from lintspaces')
    .parse(process.argv)

  // Map regexIgnores to RegExp objects
  program.regexIgnores = map(program.regexIgnores, function(r) {
    return new RegExp(r)
  })


  // Setup validator with user options
  const opts = program.opts()

  validator = new Validator({
    newline: opts.newline,
    newlineMaximum: opts.maxnewlines,
    trailingspaces: opts.trailingspaces,
    indentation: opts.indentation,
    spaces: opts.spaces,
    ignores: opts.ignores,
    editorconfig: opts.editorconfig,
    indentationGuess: opts.guessindentation,
    trailingspacesSkipBlanks: opts.skiptrailingonblank,
    trailingspacesToIgnores: opts.trailingspacesToIgnores,
    allowsBOM: opts.allowsBOM,
    verbose: opts.verbose,
    endOfLine: opts.endofline
  })

  if (!program.args || program.args.length === 0) {
    console.warn('Please provide a list or glob pattern of files to lint.'.red)
    process.exit(1)
  }

  // Resolve all glob patterns and merge them into one array
  targetFiles = program.args.map((file) => {
    return glob.sync(file, {
      dot: program.matchdotfiles
    })
  })

  // Flatten into single array
  targetFiles = Array.prototype.concat.apply(
    [],
    targetFiles
  )

  targetFiles = targetFiles.filter(fs.existsSync.bind(fs)).filter(function(path) {
    return fs.statSync(path).isFile()
  })

  // Run validation
  if (program.verbose) {
    console.log('Number of files to check: ' + targetFiles.length)
  }
  for (let file in targetFiles) {
    const filepath = path.resolve(targetFiles[file])
    if (program.verbose) {
      console.log('Checking: ' + filepath)
    }
    validator.validate(filepath)
  }
  files = validator.getInvalidFiles()

  // Output results
  if (opts.json) {
    console.log(JSON.stringify(files))
  } else {
    for (let file in files) {
      const curFile = files[file]
      console.warn(util.format('\nFile: %s', file).red.underline)

      for (let line in curFile) {
        const curLine = curFile[line]

        for (let err in curLine) {
          const curErr = curLine[err]
          let errMsg = curErr.type

          if (errMsg.toLowerCase() === 'warning') {
            errMsg = errMsg.red
          } else {
            errMsg = errMsg.green
          }

          const msg = util.format('Line: %s %s [%s]', line, curErr.message, errMsg)

          console.warn(msg)
        }
      }
    }
  }

  // Give error exit code if required
  if (Object.keys(files).length) {
    process.exit(1)
  }
}
