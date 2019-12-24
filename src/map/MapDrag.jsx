import ol from 'openlayers';

class MapDrag extends ol.interaction.Pointer {
    /**
           * @constructor
           * @extends {ol.interaction.Pointer}
           */
    constructor() {
        super();
        super({
            handleDownEvent: this.handleDownEvent,
            handleDragEvent: this.handleDragEvent,
            handleMoveEvent: this.handleMoveEvent,
            handleUpEvent: this.handleUpEvent,
        });
    }

    /**
     * @type {ol.Pixel}
     * @private
     */
    coordinate_ = null;

    /**
     * @type {string|undefined}
     * @private
     */
    cursor_ = 'pointer';

    /**
     * @type {ol.Feature}
     * @private
     */
    feature_ = null;

    /**
     * @type {string|undefined}
     * @private
     */
    previousCursor_ = undefined;

    /**
* @param {ol.MapBrowserEvent} evt Map browser event.
* @return {boolean} `true` to start the drag sequence.
*/
    handleDownEvent = function (evt) {
        const { map } = evt;

        const feature = map.forEachFeatureAtPixel(evt.pixel,
            feature => feature);

        if (feature) {
            this.coordinate_ = evt.coordinate;
            this.feature_ = feature;
        }

        return !!feature;
    };


    /**
     * @param {ol.MapBrowserEvent} evt Map browser event.
     */
    handleDragEvent = function (evt) {
        const deltaX = evt.coordinate[0] - this.coordinate_[0];
        const deltaY = evt.coordinate[1] - this.coordinate_[1];

        const geometry = this.feature_.getGeometry();
        geometry.translate(deltaX, deltaY);

        this.coordinate_[0] = evt.coordinate[0];
        this.coordinate_[1] = evt.coordinate[1];
    };


    /**
     * @param {ol.MapBrowserEvent} evt Event.
     */
    handleMoveEvent = function (evt) {
        if (this.cursor_) {
            const { map } = evt;
            const feature = map.forEachFeatureAtPixel(evt.pixel,
                feature => feature);
            const element = evt.map.getTargetElement();
            if (feature) {
                if (element.style.cursor != this.cursor_) {
                    this.previousCursor_ = element.style.cursor;
                    element.style.cursor = this.cursor_;
                }
            } else if (this.previousCursor_ !== undefined) {
                element.style.cursor = this.previousCursor_;
                this.previousCursor_ = undefined;
            }
        }
    };

    /**
     * @return {boolean} `false` to stop the drag sequence.
     */
    handleUpEvent = function () {
        this.coordinate_ = null;
        this.feature_ = null;
        return false;
    };
}
module.exports = MapDrag;
