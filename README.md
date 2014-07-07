lintspaces-cli
==============

Simple as pie CLI for the node-lintspaces module. Supports all the usual 
lintspaces args that the Grunt, Gulp and vanilla Node.js module support.

## Install 
```
$ npm install -g lintspaces-cli
```


## Help Output
```
eshortiss@Evans-MacBook-Pro:~/lintspaces --help

  Usage: lintspaces [options]

  Options:

    -h, --help              output usage information
    -V, --version           output the version number
    -n, --newline           Require newline at end of file.
    -l, --maxnewlines <n>   Specify max number of newlines between blocks.
    -t, --trailingspaces    Tests for useless whitespaces (trailing whitespaces) at each line ending of all files.
    -d, --indentation <s>   Check indentation is "tabs" or "spaces".
    -s, --spaces <n>        Used in conjunction with -d to set number of spaces.
    -i, --ignores <items>   Comma separated list of ignores.
    -e, --editorconfig <s>  Use editorconfig specified at this  file path for settings.
```

## Example Commands

Check all JavaScript files in directory for trailing spaces and newline at the 
end of file:

```
lintspaces -n -t ./*.js
```

Check that 2 spaces are used as indent:

```
lintspaces -nt -s 2 -d spaces ./*.js
```
