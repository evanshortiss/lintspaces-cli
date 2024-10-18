lintspaces-cli
==============

[![Coverage Status](https://coveralls.io/repos/github/evanshortiss/lintspaces-cli/badge.svg?branch=master)](https://coveralls.io/github/evanshortiss/lintspaces-cli?branch=master)
[![npm version](https://badge.fury.io/js/lintspaces-cli.svg)](https://www.npmjs.com/package/lintspaces-cli)
[![npm downloads](https://img.shields.io/npm/dm/lintspaces-cli.svg?style=flat)](https://www.npmjs.com/package/lintspaces-cli)


Simple as pie CLI for the node-lintspaces module. Supports all the usual
lintspaces args that the Grunt, Gulp and vanilla node.js module support.

## Install
```
$ npm install -g lintspaces-cli
```


## Help Output
```
$ lintspaces --help

Usage: lintspaces [options]

Options:
  -V, --version                   output the version number
  -n, --newline                   Require newline at end of file.
  -g, --guessindentation          Tries to guess the indention of a line depending on previous lines.
  -b, --skiptrailingonblank       Skip blank lines in trailingspaces check.
  -it, --trailingspacestoignores  Ignore trailing spaces in ignores.
  -l, --maxnewlines <n>           Specify max number of newlines between blocks.
  -t, --trailingspaces            Tests for useless whitespaces (trailing whitespaces) at each line ending of all files.
  -d, --indentation <s>           Check indentation is "tabs" or "spaces".
  -s, --spaces <n>                Used in conjunction with -d to set number of spaces.
  -i, --ignores <items>           Comma separated list of ignores built in ignores. (default: [])
  -r, --regexignores <items>      Comma separated list of ignores that should be parsed as Regex (default: [])
  -e, --editorconfig <s>          Use editorconfig specified at this file path for settings.
  -o, --allowsBOM                 Sets the allowsBOM option to true
  -v, --verbose                   Be verbose when processing files
  -., --matchdotfiles             Match dotfiles
  --endofline <s>                 Enables EOL checks. Supports "LF" or "CRLF" or "CR" values
  --json                          Output the raw JSON results from lintspaces
  -h, --help                      output usage information
```

## Example Commands

Check all JavaScript files in directory for trailing spaces and newline at the
end of file:

```
lintspaces -n -t ./*.js
```

Check all js and css files

```
lintspaces -n -t src/**/*.js src/**/*.css
```

Check that 2 spaces are used as indent:

```
lintspaces -nt -s 2 -d spaces ./*.js
```

## Using Ignores
lintspaces supports ignores, and we added support for those in version 0.3.0 of
this module.

Using built in ignores can be done like so:

```
lintspaces -i 'js-comments' -i 'c-comments'
```

To add Regex ignores a different flag is required:

```
lintspaces -r '/pointless|regex/g' -r '/and|another/gi '
```

## Changelog

* 0.7.1 - Fix "is not a file" errors

* 0.7.0 - Bump dependencies. Add `--json` output flag. Add tests. Normalise arguments to lowercase.

* 0.6.0 - Added support for matching dotfiles (dzięki @jrencz)

* 0.5.0 - Add support for glob patterns (thanks @jantimon)

* 0.4.0 - Add verbose option (thank you @gemal)

* 0.3.0 - Add support for Regex ignores by adding the *--regexIgnores* option.

* 0.2.0 - Update to use lintspaces@0.5.0 and support new allowsBOM and
endOfLine options.

* 0.1.1 - Support for node.js v4+ (thank you @gurdiga)

* 0.1.0 - Initial stable release

* < 0.1.0 - Dark ages...

## Contributors
* [Vlad Gurdiga (@gurdiga)](https://github.com/gurdiga)
* [Henrik Gemal (@gemal)](https://github.com/gemal)
* [Jan Nicklas (@jantimon)](https://github.com/jantimon)
* [Jarek Rencz (@jrencz)](https://github.com/jrencz)
