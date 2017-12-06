# Parse
A simple site that creates Behat markup tests for a given section of markup.

## How it works
Parse uses Javascript to read your markup. It creates a Document Object Model (DOM) and recursively builds out a list of elements. It then prints a series of markup tests that you can use right in your Behat step definition.

## How to Use
The easiest way to access Parse is via the version hosted on [GitHub Pages](https://patrickfweston.github.io/parse-behat/). Alternatively, you can clone or fork this repo and run Parse locally.

Using Parse is pretty easy. Just fill in two required fields:
* Behat region : The name of the region that contains this markup. This region should be defined in your `behat.yml` file. You can use the "everywhere" region to look on the entire page.
* Markup : The section of markup you'd like to create tests for.

Once you enter these items, simply click "Parse!".

Your tests are printed below and can be copy and pasted into Behat.

## Example
[View the example screenshot](/screenshots/parse.png).

## Options
* Behat region (_required_) : The name of the region that contains this markup. This region should be defined in your `behat.yml` file. You can use the "everywhere" region to look on the entire page.
* Markup (_required_) : The section of markup you'd like to create tests for.
* Tags to exclude (_optional_) : A set of tags, separated by commas or spaces, to be ignored when building out tests.

## Notes
Copyright 2017 Palantir.net, Inc.
