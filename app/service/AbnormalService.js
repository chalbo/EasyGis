const esClinet = require("../common/ESClient");
const constent = require("../../config/Constent");
const config = require("../../config/config.local");
const moment = require("moment");
const utlis = require("../common/utlis");
const logger = require("../common/logger");

class AbnormalQuery {
    constructor() {
        this.query = {
            "query": {
                "bool": {
                    "must": [{
                        "terms": {
                            "type": constent.abnormal.typeDic
                        }
                    }]
                }
            },
            "_source": {
                "includes": constent.abnormal.column,
                "excludes": []
            },
            // "aggregations": {
            //     "aggs_cameras": {
            //         "terms": {
            //             "field": "camera_id"
            //         },
            //         "aggregations": {
            //             "top": {
            //                 "top_hits": {
            //                     "size": 20000,
            //                     "_source": {
            //                         "includes": constent.abnormal.column,
            //                         "excludes": []
            //                     },
            //                     "sort": [{
            //                         "frame_timestamp": {
            //                             "order": "asc"
            //                         }
            //                     }]
            //                 }
            //             }
            //         }
            //     }
            // }
        }
    }
    setAbnormalType(types) {
        this.query.query.bool.must[0].terms.type = types;
    }
    setAbnormalTime(startTime, endTime) {
        var datetime = {
            "range": {
                "frame_timestamp": {
                    "from": moment(startTime).format("X"),
                    "to": moment(endTime).format("X"),
                    "include_lower": true,
                    "include_upper": true
                }
            }
        };
        this.query.query.bool.must.push(datetime);
    }
    //转换预警字符串
    convertAbnormalData(data) {
        var cameraJson = { cameras: [] };
        //创建字典过滤cameraid
        var cameraids = {};
        for (let idx in data) {
           // for (let i in data[idx]._source) {
                var source =  data[idx]._source;
                //"".replace("",config.tomcatIp)
                var images = { doc_id: source.doc_id, end_time: source.end_time, frame_timestamp: source.frame_timestamp, screenshot_path: source.screenshot_path, start_time: source.start_time, type: source.type };
                if (!cameraids[source.camera_id]) {
                    cameraids[source.camera_id] = source.camera_id;
                    var camera = {};
                    camera.camera_id = source.camera_id;
                    camera.camera_gis = source.camera_gis;
                    camera.address = source.address;
                    camera.images = [images];
                    camera.image_num = 1;
                    cameraids[source.camera_id] = camera;
                } else {
                    cameraids[source.camera_id].images.push(images)
                    cameraids[source.camera_id].image_num += 1;
                }
         //   }
        }
        //填充camerajson；
        for (let idx in cameraids) {
            cameraJson.cameras.push(cameraids[idx]);
        }
        cameraJson.camera_num = cameraJson.cameras.length;
        return cameraJson;
    }
    async getAbnormal() { 
        var data = await this.getESAbnormal(); 
        return this.convertAbnormalData(data);
    }
    async getESAbnormal() {
        return utlis.getAsync(((resolve, reject) => {
            esClinet.search({
                index: config.abnormalIndex,
                type: config.abnormalTypeRealtime,
                body: this.query,
            }, (error, data) => {
                logger.info("相应结果" + error + data);
                resolve(data.hits.hits);
            });
        }).bind(this));
    }
    async getHistoryAbnormal() { 
        var data = await this.getESHistoryAbnormal(); 
        return this.convertAbnormalData(data);
    }
    async getESHistoryAbnormal() {
        return utlis.getAsync(((resolve, reject) => {
            esClinet.search({
                index: config.abnormalIndex,
                type: config.abnormalTypeHistory,
                body: this.query,
            }, (error, data) => {
                logger.info("相应结果" + error + data);
                resolve(data.hits.hits);
            });
        }).bind(this));
    }
}
module.exports = AbnormalQuery;