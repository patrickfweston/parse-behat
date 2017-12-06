/**
 * Parses the DOM and translates it into a DOM object.
 *
 * @param html
 * @returns {Element}
 */
var str2DOMElement = function(html) {
    var frame = document.createElement('iframe');
    frame.style.display = 'none';
    document.body.appendChild(frame);
    frame.contentDocument.open();
    frame.contentDocument.write(html);
    frame.contentDocument.close();
    var el = frame.contentDocument.body.childNodes;
    document.body.removeChild(frame);
    return el;
};

/**
 * Recursively walks through the given DOM and creates a set of selectors.
 * @param node
 * @param append
 * @param result
 * @returns {Array.<T>}
 */
function walk(node, ignoredTags, append, result) {
    if (typeof ignoredTags === 'undefined') ignoredTags = [];
    if (typeof append === 'undefined') append = '';
    if (typeof result === 'undefined') result = [];

    var children = node.childNodes;
    var tempAppend = append;
    for (var i = 0; i < children.length; i++) {
        var $object = $(node);

        var tag = $object.prop("tagName").toLowerCase();

        if ($.inArray(tag, ignoredTags) !== -1) {
            continue;
        }


        var classes = '';
        if ($object.attr('class')) {
            classes = '.' + $object.attr('class').split(' ').join('.');
        }

        var id = '';
        if ($object.attr('id')) {
            id = '#' + $object.attr('id');
        }

        var queryString = tag + id + classes;

        if (append != '') {
            tempAppend = append + ' ' + queryString;
        } else {
            tempAppend = queryString;
        }

        result.push(tempAppend);
        walk(children[i], ignoredTags, tempAppend, result);
    }

    return result.filter(function(item, i, ar){ return ar.indexOf(item) === i; });
}

$(document).ready(function() {
    /**
     * When the 'Parse' button is clicked, process the results.
     */
    $('.parse').on('click', function(e) {
        e.preventDefault();

        var resultString = createBehatTestStrings('.input', $('#ignored-tags').val());

        $('#result').show();
        $('#result-tests').html('<pre>'+resultString+'</pre>');
    });

    /**
     * If 'Copy to Clipboard' is clicked, copy the values.
     */
    $('#copy-to-clipboard').on('click', function(e) {
       copyToClipboard('#result-tests');
    });

    /**
     *
     */
    $('.form-element--hidden label').on('click', function(e) {
        $('.form-element--container').slideToggle();
        $(this).parent().toggleClass('isExpanded');
    });

    /**
     * Build out our Behat test strings.
     *
     * @param element
     * @returns {string}
     */
    function createBehatTestStrings(element, ignoredTagsList) {
        // Convert the input into a traversable DOM object.
        var dom = str2DOMElement($(element).val().trim());

        // Create an array of ignoredTags
        var ignoredTags = ignoredTagsList.replace(',', ' ').split(' ').filter(entry => entry.trim() != '');
        console.log(ignoredTags);

        // Build out our strings for tests
        var resultString = '';
        for (var i = 0; i < dom.length; i++) {
            // Walk through the DOM for this top level item.
            var queryStrings = walk(dom[i], ignoredTags);

            // Loop over multiple query strings.
            for (var j = 0; j < queryStrings.length; j++) {
                var region = $('#region').val();
                if (region) {
                    resultString += "$this->assertRegionElement('" + queryStrings[j] + "', '" + region + "');" + "\n";
                } else {
                    resultString += queryStrings[i] + "\n";
                }
            }
        }

        return resultString;
    }

    /**
     * Copies an element's value to the clipboard
     *
     * @param element
     */
    function copyToClipboard(element) {
        var $temp = $("<textarea>");
        $("body").append($temp);
        $temp.val($(element).text()).select();
        document.execCommand("copy");
        $temp.remove();
    }
});
