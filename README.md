# Parse
A simple piece of Javascript to create Behat markup tests from a section of markup.

## How to Use
* The Behat region : This is the name of the region that the test should look for markup in. This region should be defined in your behat.yml file
* Markup : The copy and pasted markup to look for.

Open the `index.html` file on your local machine or use the version hosted on [GitHub Pages](https://patrickfweston.github.io/parse-behat/). Once you enter these items, simply click "Parse". Your tests are printed below and can be copy and pasted into Behat.

## Example
In this example, we're testing for a section of navigation markup in the "header" region. After clicking "Parse", the 4 `assertRegionElement()` tests can be copied and pasted into the appropriate Behat test function.

![Image of Parse UI](/screenshots/parse.png)

## Notes
Parse ignores SVGs and HTML comments.
