class BaseResult {
  constructor() {
    this.code = 200;
    this.msg = 'success';
    this.data = {};
  }
}

module.exports = {
  BaseResult
};