
// From http://www.tutorialspoint.com/javascript/array_map.htm
if (!Array.prototype.map)
{
  Array.prototype.map = function(fun /*, thisp*/)
  {
    var len = this.length;
    if (typeof fun !== "function")
      throw new TypeError();

    var res = new Array(len);
    var thisp = arguments[1];
    for (var i = 0; i < len; i++)
    {
      if (i in this)
        res[i] = fun.call(thisp, this[i], i, this);
    }

    return res;
  };
}

L.Control.SearchMenu = L.Control.extend({

    includes: L.Mixin.Events,

    options: {
        position: 'topright',
        title: 'Search',
        placeholder: 'Search',
        caseSensitive: false,
        threshold: 0.5,
        maxResultLength: null,
        showInvisibleFeatures: true
    },

    initialize: function(options) {
        L.setOptions(this, options);
        this._panelOnLeftSide = (this.options.position.indexOf("left") !== -1);
    },

    onAdd: function(map) {

        var ctrl = this._createControl();
        this._createPanel(map);
        this._setEventListeners();
        map.invalidateSize();

        return ctrl;
    },

    onRemove: function(map) {

        this.hidePanel(map);
        this._clearEventListeners();
        this._clearPanel(map);
        this._clearControl();

        return this;
    },

    _createControl: function() {

        var className = 'leaflet-searchmenu-control',
            container = L.DomUtil.create('div', className);

        // Control to open the search panel
        var butt = this._openButton = L.DomUtil.create('a', 'button', container);
        butt.href = '#';
        butt.title = this.options.title;
        var stop = L.DomEvent.stopPropagation;
        L.DomEvent.on(butt, 'click', stop)
                  .on(butt, 'mousedown', stop)
                  .on(butt, 'touchstart', stop)
                  .on(butt, 'mousewheel', stop)
                  .on(butt, 'MozMousePixelScroll', stop);
        L.DomEvent.on(butt, 'click', L.DomEvent.preventDefault);
        L.DomEvent.on(butt, 'click', this.showPanel, this);

        return container;
    },

    _clearControl: function() {
        // Unregister events to prevent memory leak
        var butt = this._openButton;
        var stop = L.DomEvent.stopPropagation;
        L.DomEvent.off(butt, 'click', stop)
                  .off(butt, 'mousedown', stop)
                  .off(butt, 'touchstart', stop)
                  .off(butt, 'mousewheel', stop)
                  .off(butt, 'MozMousePixelScroll', stop);
        L.DomEvent.off(butt, 'click', L.DomEvent.preventDefault);
        L.DomEvent.off(butt, 'click', this.showPanel);
    },

    _createPanel: function(map) {
        var _this = this;

        // Create the search panel
        var mapContainer = map.getContainer();
        var className = 'leaflet-searchmenu-panel',
            pane = this._panel = L.DomUtil.create('div', className, mapContainer);

        // Make sure we don't drag the map when we interact with the content
        var stop = L.DomEvent.stopPropagation;
        L.DomEvent.on(pane, 'click', stop)
                .on(pane, 'dblclick', stop)
                .on(pane, 'mousedown', stop)
                .on(pane, 'touchstart', stop)
                .on(pane, 'mousewheel', stop)
                .on(pane, 'MozMousePixelScroll', stop);

        // place the pane on the same side as the control
        if (this._panelOnLeftSide) {
            L.DomUtil.addClass(pane, 'left');
        } else {
            L.DomUtil.addClass(pane, 'right');
        }

        // Intermediate container to get the box sizing right
        var container = L.DomUtil.create('div', 'content', pane);

        // Search image and input field
        L.DomUtil.create('img', 'search-image', container);
        this._input = L.DomUtil.create('input', 'search-input', container);
        this._input.maxLength = 30;
        this._input.placeholder = this.options.placeholder;
        this._input.onkeyup = function(evt) {
            var searchString = evt.currentTarget.value;
            _this.search(searchString);
        };

        // Close button
        var close = this._closeButton = L.DomUtil.create('a', 'close', container);
        close.innerHTML = '&times;';
        L.DomEvent.on(close, 'click', this.hidePanel, this);

        // Where the result will be listed
        this._resultList = L.DomUtil.create('div', 'result-list', container);

        return pane;
    },

    _clearPanel: function(map) {

        // Unregister event handlers
        var stop = L.DomEvent.stopPropagation;
        L.DomEvent.off(this._panel, 'click', stop)
                  .off(this._panel, 'dblclick', stop)
                  .off(this._panel, 'mousedown', stop)
                  .off(this._panel, 'touchstart', stop)
                  .off(this._panel, 'mousewheel', stop)
                  .off(this._panel, 'MozMousePixelScroll', stop);

        L.DomEvent.off(this._closeButton, 'click', this.hidePanel);

        var mapContainer = map.getContainer();
        mapContainer.removeChild(this._panel);

        this._panel = null;
    },

    _setEventListeners : function() {
        var that = this;
        var input = this._input;
        this._map.addEventListener('overlayadd', function() {
            that.search(input.value);
        });
        this._map.addEventListener('overlayremove', function() {
            that.search(input.value);
        });
    },

    _clearEventListeners: function() {
        this._map.removeEventListener('overlayadd');
        this._map.removeEventListener('overlayremove');
    },

    isPanelVisible: function () {
        return L.DomUtil.hasClass(this._panel, 'visible');
    },

    showPanel: function () {
        if (! this.isPanelVisible()) {
            L.DomUtil.addClass(this._panel, 'visible');
            // Preserve map centre
            this._map.panBy([this.getOffset() * 0.5, 0], {duration: 0.5});
            this.fire('show');
            this._input.select();
            // Search again as visibility of features might have changed
            this.search(this._input.value);
        }
    },

    hidePanel: function (e) {
        if (this.isPanelVisible()) {
            L.DomUtil.removeClass(this._panel, 'visible');
            // Move back the map centre - only if we still hold this._map
            // as this might already have been cleared up by removeFrom()
            if (null !== this._map) {
                this._map.panBy([this.getOffset() * -0.5, 0], {duration: 0.5});
            };
            this.fire('hide');
            if(e) {
                L.DomEvent.stopPropagation(e);
            }
        }
    },

    getOffset: function() {
        if (this._panelOnLeftSide) {
            return - this._panel.offsetWidth;
        } else {
            return this._panel.offsetWidth;
        }
    },

    search: function(string) {
        var _this = this;
        this.options.search(string, function(results){
            // Empty result list
            $(".result-item").remove();

            var resultList = $('.result-list')[0];
            var num = 0;
            var max = _this.options.maxResultLength;
            for (var i in results) {
                var result = results[i];
                _this.createResultItem(result, resultList);
                if (undefined !== max && ++num === max)
                    break;
            }
        });
    },

    createResultItem: function(result, container) {

        var _this = this;

        // Create a container and open the associated popup on click
        var resultItem = L.DomUtil.create('p', 'result-item', container);

        L.DomUtil.addClass(resultItem, 'clickable');
        resultItem.onclick = function() {

            if (window.matchMedia("(max-width:480px)").matches) {
                _this.hidePanel();
            }
            _this.options.popup(result);
        };

        // Fill in the container with the user-supplied function if any,
        // otherwise display the result properties used for the search.
        this.options.showResultFct(result, resultItem);

        return resultItem;
    },
});

L.control.searchMenu = function(options) {
    return new L.Control.SearchMenu(options);
};
