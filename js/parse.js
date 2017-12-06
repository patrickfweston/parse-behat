var str2DOMElement = function(html) {
    var wrapMap = {
        option: [ 1, "<select multiple='multiple'>", "</select>" ],
        legend: [ 1, "<fieldset>", "</fieldset>" ],
        area: [ 1, "<map>", "</map>" ],
        param: [ 1, "<object>", "</object>" ],
        thead: [ 1, "<table>", "</table>" ],
        tr: [ 2, "<table><tbody>", "</tbody></table>" ],
        col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
        td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
        body: [0, "", ""],
        _default: [ 1, "<div>", "</div>"  ]
    };
    wrapMap.optgroup = wrapMap.option;
    wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
    wrapMap.th = wrapMap.td;
    var match = /<\s*\w.*?>/g.exec(html);
    var element = document.createElement('div');
    if(match != null) {
        var tag = match[0].replace(/</g, '').replace(/>/g, '').split(' ')[0];
        if(tag.toLowerCase() === 'body') {
            var dom = document.implementation.createDocument('http://www.w3.org/1999/xhtml', 'html', null);
            var body = document.createElement("body");
            // keeping the attributes
            element.innerHTML = html.replace(/<body/g, '<div').replace(/<\/body>/g, '</div>');
            var attrs = element.firstChild.attributes;
            body.innerHTML = html;
            for(var i=0; i<attrs.length; i++) {
                body.setAttribute(attrs[i].name, attrs[i].value);
            }
            return body;
        } else {
            var map = wrapMap[tag] || wrapMap._default, element;
            html = map[1] + html + map[2];
            element.innerHTML = html;
            // Descend through wrappers to the right content
            var j = map[0]+1;
            while(j--) {
                element = element.lastChild;
            }
        }
    } else {
        element.innerHTML = html;
        element = element.lastChild;
    }
    return element;
};

function walk(node, append, result) {
    if (typeof append === 'undefined') append = '';
    if (typeof result === 'undefined') result = new Array();

    var children = node.childNodes;
    var tempAppend = append;
    for (var i = 0; i < children.length; i++) {
        var $object = $(node);

        var tag = $object.prop("tagName").toLowerCase();

        if ($object.prop("tagName").toLowerCase() == 'svg') {
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
        walk(children[i], tempAppend, result);
    }

    return result.filter(function(item, i, ar){ return ar.indexOf(item) === i; });;
}

$(document).ready(function() {
    $('.parse').on('click', function() {
        var dom = str2DOMElement($('.input').val());
        var queryStrings = walk(dom);

        var resultString = '';
        for (var i = 0; i < queryStrings.length; i++) {
            var region = $('#region').val();
            if (region) {
                resultString += "$this->assertRegionElement('" + queryStrings[i] + "', '" + region + "');" + "<br />";
            } else {
                resultString += queryStrings[i] + "<br />";
            }
        }

        $('#result').html('<pre>'+resultString+'</pre>');
    });
});