# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to loose [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
(none)

## [0.4.0] - 2020-04-11
### Added
- Popper onTargetClick prop.
- "auto" groupName option. This will auto-determine nested popper groups based on stack and dom placements.

### Changed
- New demo page with navigation and additional examples.
- Popper closeOnOutsideClick now works for both managed and controlled poppers.
- Default groupName is now "auto" instead of "global".

## [0.3.0] - 2020-03-23
### Added
- Changelog file.

### Changed
- Groups are now array based (existing strings converted to arrays), allowing for assigning a popper to multiple groups.

## [0.2.0] - 2020-03-11
### Fixed
- Webpack build wasn't publishing as UMD, causing it to not work with common loaders.

## [0.1.0] - 2020-02-09
### Added
- Initial Beta release. The package is fully functional, but should be considered beta until bumped to 1.0.0.