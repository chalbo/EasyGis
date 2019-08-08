const esClient = require("../common/ESClient.js");
const constent = require("../../config/Constent.js");
const config = require("../../config/config.local");
const utlis = require("../common/utlis");
const jsonUtils = require("../common/JsonUtils.js");
const moment = require("moment");
const esUtil = require("../common/esUtil.js");
const logger = require("../common/logger");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
// const walk = require('walk')


class VideoService {
    constructor({ cameraId, url }) {
        let fileDicName = cameraId;
        let cameraFile = `${process.cwd()}/video/${fileDicName}`;
        fs.exists(cameraFile, function (exists) {
            if (!exists) { fs.mkdir(cameraFile); }
        })
        this.cameraId = cameraId;
        this.url = url;
        this.cameraFile = cameraFile;
        this.videoLength = 20;
        this.ffmpegCmd = null;
    }

    startConvertFfmpeg() {
        try {
            let filem3u8 = `${this.cameraFile}/${this.cameraId}.m3u8`;
            this.ffmpegCmd = ffmpeg(this.url).inputOptions([
                '-fflags flush_packets -max_delay 2 -flags -global_header -hls_time 2 -hls_list_size 3 -vcodec copy --y ',
                filem3u8, 
            ]).on('error', function (err) {
                logger.error('An error occurred: ' + err.message);
            }).start();
            return true;
        } catch (e) {
            logger.error(e.message);
            return false;
        }


    }
    async stopConvertFfmpeg() {
        this.ffmpegCmd.kill();
    }
    //  updateFfmpegFile(path){ 
    //     var files=[];
    //     var walker  = walk.walk(path, { followLinks: false });

    //     walker.on('file', function(roots, stat, next) {
    //         files.push(roots + '/' + stat.name);
    //         next();
    //     }.bind(this));

    // }

    async deleteFfmpegFile() {
        let fileDicName = this.cameraId;
        let cameraFile = `${process.cwd()}/video/${fileDicName}`;
        return utlis.getAsync(((resolve, reject) => {
            fs.exists(cameraFile, function (exists) {
                if (exists) {
                    fs.rmdir(cameraFile, function (err) {
                        if (err) {
                            resolve({ error: err, status: false });
                        } else {
                            resolve({ message: "ok", status: true });
                        }
                    });
                }
            }.bind(this));
        }).bind(this));


    }


}
module.exports = VideoService;

