## 1.0.0 (18/11/24)

* Update to use `lintspaces` v0.12.0.
* Revert change from v0.8.0 that loaded a `.editorconfig` file from the current working directory by default (see #33)

## 0.8.0

* Update to use `lintspaces` v0.10.0 to address Windows related issues. See issue #25.
* Default to using the `.editorconfig` file in the current working directory if the `-e` option is not provided.

## 0.7.1 (22/03/2019)

* Fix "is not a file" errors on folder globs
