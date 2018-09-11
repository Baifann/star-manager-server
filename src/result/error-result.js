class ErrorResult {
  constructor() {
    this.code = 500;
    this.msg = 'error';
    this.data = {};
  }
}

module.exports = {
  ErrorResult
};