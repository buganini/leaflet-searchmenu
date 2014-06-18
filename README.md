<h1>leaflet-searchmenu</h1>

Forked from https://github.com/naomap/leaflet-fusesearch

<h2>Usage</h2>

Create the control L.Control.SearchMenu and add it to the Map.
<pre>
var searchCtrl = L.control.searchMenu()
searchCtrl.addTo(map);
</pre>

<h2>Options</h2>

The FuseSearch control can be created with the following options :
<ul>
<li><code>position</code> : position of the control, the search pane shows on the matching side. Default <code>'topright'</code>.</li>
<li><code>title</code> : used for the control tooltip, default <code>'Search'</code></li>
<li><code>placeholder</code> : used for the input placeholder, default <code>'Search'</code></li>
<li><code>maxResultLength</code> : number of features displayed in the result list, default is null
	and all features found by Fuse are displayed</li>
<li><code>showInvisibleFeatures</code> : display the matching features even if their layer is invisible, default true</li>
<li><code>showResultFct</code> : function to display a feature returned by the search, parameters are the
	feature and an HTML container. Here is an example :</li>
</ul>
<pre>
    showResultFct: function(feature, container) {
        props = feature.properties;
        var name = L.DomUtil.create('b', null, container);
        name.innerHTML = props.name;
        container.appendChild(L.DomUtil.create('br', null, container));
        container.appendChild(document.createTextNode(props.details));
    }
</pre>

<h2>Example</h2>

I'm currently working on providing a simple example, for now have a look at my <a href="http://www.naomap.fr">NaoMap site</a>.
