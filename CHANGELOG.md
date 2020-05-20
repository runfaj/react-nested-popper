# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to loose [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.6.0] - 2020-05-20
### Changed
- The older boolean "closeOnOutsideClick" to function "shouldCloseOnOutsideClick"

## [0.5.5] - 2020-05-18
### Changed
- Upgraded to popperjs 2.4.0
- Limited popper options update cycle to be smarter

## [0.5.4] - 2020-05-18
### Fixed
- An issue where state change on nested target could cause outside click to misfire.

## [0.5.3] - 2020-05-18
### Fixed
- Wrapped popper instance with checks so external tests don't have potential issues

## [0.5.2] - 2020-05-18
### Fixed
- An issue with nested poppers not displaying the correct placement.

## [0.5.1] - 2020-05-15
### Fixed
- An issue with getting target parents if popper unmounted too quickly.

## [0.5.0] - 2020-05-15
### Fixed
- [#2](https://github.com/runfaj/react-nested-popper/issues/2) - Added position listener to update popper position for nested poppers
- [#4](https://github.com/runfaj/react-nested-popper/issues/4) - Content resizing now updates popper position
- [#5](https://github.com/runfaj/react-nested-popper/issues/5) - Fixed routing on demo

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