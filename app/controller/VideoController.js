const moment = require("moment");
const fs = require('fs');
// const VideoService = require("../service/VideoService");

function   getRouters() {
    return {
       // 'POST /res/getCameraVideo': Video.getCameraVideo,
      //  'POST /res/delCameraVideo': Video.delCameraVideo,
    }
} 
class Video {
  
    // static getInstance() {
    //     if (!Video.instance) {
    //         Video.instance = new Video();
    //     }
    //     return Video.instance;
    // }
    static async getCameraVideo(ctx, next) {
        let param = ctx.request.body;
        var cameraId = param.cameraId;
        var respUrl = param.respUrl;
        var vs = new VideoService({cameraId, url:respUrl});
        Video.videoServices[cameraId] = vs;
        var bool = vs.startConvertFfmpeg();
        ctx.response.type = 'application/json';
        if (bool) {
            ctx.response.body = { message: "ok", status: true };
        } else {
            ctx.response.body = { message: "error", status: false };
        }
    }

    static async delCameraVideo(ctx, next) {
        let param = ctx.request.body;
        let cameraId = param.cameraId;
        let info={};
        if(Video.videoServices[cameraId]){
            let vs = Video.videoServices[cameraId];
            info = await vs.stopConvertFfmpeg(cameraId);
            delete Video.videoServices[cameraId];
        }else{
            info={ message: "ok", status: true };
        }
        ctx.response.type = 'application/json';
        ctx.response.body = info;
    }
}
Video.videoServices = {};
module.exports = getRouters();