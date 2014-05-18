yet-another-module
==================

This module is for something or other. For example:

    code and what not

Etc.!

Installation
------------

    npm install yet-another-module

Usage
-----

Load the module somehow.

    var someFactory = require('yet-another-module');

Create a thing from the module.

    var thing = someFactory();

Use that thing.

    thing.use();

Success!

__In the browser__

    make browserify

Then:

    make minbrowserify

After that, include `<script src="yetanothermodule-browserified.min.js">` in your html file. Then, in your JavaScript file:

    var thing = exportname.createThing();

[Here's a working example.](http://jimkang.com/yet-another-module/example)

Tests
-----

Run tests with `npm test`. Run tests in the debugger with 'npm run-script dtest'.

License
-------

MIT.
