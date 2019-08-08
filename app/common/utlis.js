const axios = require("axios");
axios.create({
    timeout: 1000,
    headers: { 'X-Custom-Header': 'xjcs' }
});
module.exports = {
    async getAsync(func) {
        var data = await ((func) => {
            return new Promise(((resolve, reject) => {
                func(resolve, reject);
            }).bind(this));
        })(func);
        return data;

    },
    getSeiverUrl: function () {
        return window.document.location.origin;
    },
    getAxiosData(param, callback) {
        var url = param.url, methodType = param.methodType, data = param.data;
        axios({
            method: methodType,
            url: url,
            data: data,
            //     transformRequest: transformRequest,
        }).then(function (res) {
            if (res.status == 401) {
               
            }
            callback(res.data);
        })
    },
    //登录
    getData: function getData(url, callback) {
        axios.get(url, {
            transformResponse: [function (data) {
                return eval("(" + data + ")");
            }],
        }).then(function (res) {
            callback(res.data);
        });
    },
    postData: function postData(url, data, callback) {
        var random = Math.random(10);
        url = url + "?&random=" + random;
        this.getAxiosData({
            url: url, data: data, methodType: "post", transformRequest: [function (data) {
                return JSON.stringify(data);
            }]
        }, callback);
    },

    postDataAsy: function postDataAsy(url, data, callback) {
        var random = Math.random(10);
        url = url + "?&random=" + random;
        this.getAxiosData({
            url: url, data: data, methodType: "POST", responseType: "json", transformRequest: [function (data) {
                return JSON.stringify(data);
            }]
        }, callback);
    },
    postDataAsyFrom: function postDataAsy(url, data, callback) {
        /**du something */
    },
    postFormData: function postFormData(url, data, callback) {
        var random = Math.random(10);
        url = url + "?&random=" + random;
        this.getAxiosData({
            url: url, data: data, methodType: "POST", responseType: "json"
        }, callback);
    },
    putData: function putData(url, data, callback) {
        var random = Math.random(10);
        url = url + "?&random=" + random;
        this.getAxiosData({
            url: url, data: data, methodType: "PUT", responseType: "json", transformRequest: [function (data) {
                return data;
            }]
        }, callback);
    },
    putFormData: function putFormData(url, data, callback) {
        var random = Math.random(10);
        url = url + "?&random=" + random;
        this.getAxiosData({
            url: url, data: data, methodType: "PUT", responseType: "json", transformRequest: [function (data) {
                return data;
            }]
        }, callback);
    }, 
    delData: function delData(url, data, callback) {
        var random = Math.random(10);
        url = url + "?&random=" + random;
        this.getAxiosData({
            url: url, data: data, methodType: "delete", responseType: "json", transformRequest: [function (data) {
                return data;
            }]
        }, callback);
    }, 

}
