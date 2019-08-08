const AbnormalService = require("../service/AbnormalService");

class Abnormal {
    getRouters() {
        return {
            'PUT /res/abnormal/realtime': this.getAbnormalData,
            'PUT /res/abnormal/history': this.gethistoryAbnormalData,
        }
    }
    async gethistoryAbnormalData(ctx, next) {
        let param = ctx.request.body;
        var attrs = [];
        for (var l in param.attr) {
            attrs.push(l.toString());
        }
        ctx.response.type = 'application/json';
        var service = new AbnormalService();
        service.setAbnormalType(attrs);
        service.setAbnormalTime(param.start_time,param.end_time);
        var data = await service.getHistoryAbnormal();  
        ctx.response.body = data;

    }
    async getAbnormalData(ctx, next) {
        let param = ctx.request.body;
        var attrs = [];
        for (var l in param.attr) {
            attrs.push(l.toString());
        }
        ctx.response.type = 'application/json';
        var service = new AbnormalService();
        service.setAbnormalType(attrs);
        var data = await service.getAbnormal();  
        ctx.response.body = data;
    }
}
module.exports = new Abnormal().getRouters();