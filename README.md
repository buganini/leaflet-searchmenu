<h1>leaflet-searchmenu</h1>

Forked from https://github.com/naomap/leaflet-fusesearch

<h2>Usage</h2>

Create the control L.Control.SearchMenu and add it to the Map.
<pre>
var searchCtrl = L.control.searchMenu({
    search: function(string, returnFunc) {
        returnFunc(["id1", "id2", "id3"]);
    },
    showResultFct: function() {
        var name = L.DomUtil.create('b', null, container);
        name.innerHTML = getName(result);
        container.appendChild(L.DomUtil.create('br', null, container));
        container.appendChild(document.createTextNode(getDesc(result)));
    },
    popup: function(result) {
        getMarker(result).fire("click");
    }
});
searchCtrl.addTo(map);
</pre>

<h2>Options</h2>

The SearchMenu control can be created with the following options :
<ul>
<li><code>position</code> : position of the control, the search pane shows on the matching side. Default <code>'topright'</code>.</li>
<li><code>title</code> : used for the control tooltip, default <code>'Search'</code></li>
<li><code>placeholder</code> : used for the input placeholder, default <code>'Search'</code></li>
<li><code>maxResultLength</code> : number of features displayed in the result list, default is null
    and all features found by Fuse are displayed</li>
<li><code>showInvisibleFeatures</code> : display the matching features even if their layer is invisible, default true</li>

<h2>Example</h2>

<a href="http://antology.me/vegan/">http://antology.me/vegan/</a>.
