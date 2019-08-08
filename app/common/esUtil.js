class esUtil{
    /**
     * 根据key，value创建对象
     */
    static setObj(key, value){
        let obj = {[key] : value};
        return obj;
    }

    /**
     * 创建term对象
     */
    static setTerm(termValue){
        let term = {"term" :termValue};
        return term;
    }

    /**
     * 创建term对象
     */
    static setTerms(termValue){
        let term = {"terms" :termValue};
        return term;
    }

    /**
     * 创建通配符查询
     */
    static wildcardQuery(wildcardValue){
        let wildcard = {"wildcard" : wildcardValue};
        return wildcard;
    }

    /**
     * 创建must查询
     */
    static mustQuery(term){
        let must = {"must" : term};
        let mustQuery = {"bool" : must};
        return mustQuery;
    }

    /**
     * 创建should查询
     */
    static shouldQuery(shouldValue, minimum_should_match){
        if(minimum_should_match != null){
            var should = {
                "should" : shouldValue,
                "minimum_should_match" : minimum_should_match
            }
        }else{
            var should = {"should" : shouldValue};
        }
        let shouldQuery = {"bool": should};
        return shouldQuery;
    }

    static queryString(query, fields){
        let queryValue = {
            "query" : query,
            "fields" : fields
        };
        let query_string = {
            "query_string" : queryValue
        }
        return query_string;
    }

    static setCarmeraGis(top_left, bottom_right){
        let camera_gis = {
            "top_left" : top_left,
            "bottom_right" : bottom_right
        }
        let camera_gisObj = {
            "camera_gis" : camera_gis
        }
        return camera_gisObj;
    }

    static geoboxQuery(camera_gis){
        let geobox = {
            "geo_bbox" : camera_gis
        }
        return geobox;
    }

    static setTime(start_time, end_time){
        let frame_timestamp = {
            "from" : start_time,
            "to" : end_time,
            "include_lower" : true,
            "include_upper" : true
        }
        let frame_timestampObj = {
            "frame_timestamp" : frame_timestamp
        }
        return frame_timestampObj;
    }

    static rangeQuery(timestamp){
        let rangeQuery = {
            "range" : timestamp
        }
        return rangeQuery;
    }

    static setCamArrayObj(cameraArray){
        let cameraArrayObj = {
            "camera_id" : cameraArray
        }
        return cameraArrayObj;
    }

}
module.exports = esUtil