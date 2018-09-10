let request = require('./request');
let constant = require('./constant');
let env = require('./env-config');

env = env.env;
constant = constant.constant;
request = request.service;

const Api = {
  /**
   * 获取用户信息
   */
  getAuthenticatedUser(headers) {
    const url = `${env.apiUrl}/user`;
    console.log(url, headers);
    const reqHeaders = { authorization: headers.authorization };
    return request({
      method: 'get',
      url,
      headers: reqHeaders
    });
  },

  /**
   * 授权
   */
  auth(code, headers) {
    console.log('auth', code);
    let url = `${env.mainUrl}/login/oauth/access_token`;
    url = url + `?client_id=${constant.CLIENT_ID}&client_secret=${constant.CLIENT_SECRET}&code=${code}`;
    return request({
      method: 'post',
      url,
      headers
    });
  },

  /**
   * star的项目
   */
  starred(page, headers) {
    const url = `${env.apiUrl}/user/starred?page=${page}`;
    console.log('starred', url);
    const reqHeaders = { authorization: headers.authorization };
    return request({
      method: 'get',
      url,
      headers: reqHeaders
    });
  }
};

module.exports = {
  Api
};