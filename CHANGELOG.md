# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [0.2.1] - 2016-11-04
### Changed
- Changed package name to include a scope.

### Fixed
- Release dates were not correct in the changelog.
- Version number in package.json.

## [0.2.0] - 2016-11-04
### Added
- The BankID certificate authortities are now added to both test and production requests.
- Some tests for the BankID Service.

### Changed
- Require a node version higher than 5.0.0.

### Fixed
- Fixed issue when an error is not a BankID error. 

## [0.1.1] - 2016-10-05
### Fixed
- Fixed issue with undefined error status and description.

## [0.1.0] - 2016-09-28
### Added
- Updated readme with a usage example.
- Added a custom error for BankID errors that contains a status and description of the error.
- Added the initial code.
