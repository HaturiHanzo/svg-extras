# svg-extras
Js module which is extending basic svg figures.
At the moment there are 3 custom shapes.

## Live demo
- [Polygon](https://jsfiddle.net/rbLfjy3h/)
- [Resizable rectangle](https://jsfiddle.net/3mgjan00/)
- [Bordered rectangle](https://jsfiddle.net/aw9xyk5t/)

## Installation
There are two options to install module:
- Using bower: `bower install svg-extras`
- Using npm: `npm install svg-extras --save`

All the necessary files are in a `dist` directory
### Note
If you use `svg-extras.min.js` or `svg-extras.js` file.
This two modules `https://github.com/primus/eventemitter3 && https://github.com/dfilatov/inherit`
should be included into your html file
## NPM & Bower package structure
.
 * dist
   * svg-extras.js - concatenated js source code
   * svg-extras.min.js - minified js source code
   * svg-extras.full.min.js - minified js source code with included vendor libs(eventemitter3, inherit)
   * svg-extras.css - concatenated css source code
   * svg-extras.min.css - minified css source code
 * examples directory with an examples, can be opened only if `gulp serve` is running
 * bower.json
 * README.md
 * LICENSE

## Documentation
- [API docs](https://haturihanzo.github.io/svg-extras/svgext.html)

## Contributing
Our goal is to create more custom 2d shapes, feel free to create issues, share your ideas and suggest pull requests.
Project is built using `gulp` and `npm`. Tests are written using `karma + jasmine`.