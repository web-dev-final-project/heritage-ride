class HttpStatus {
  static FAILED = "failed";
  static SUCCESS = "success";
  static COMPLETED = "complete";
}

class ErrorResponse {
  code = 500;
  status = HttpStatus.FAILED;
  messge;
  constructor(code, messge = "something has failed") {
    this.messge = messge;
    this.code = code;
  }
}
class SuccessResponse {
  status;
  content;
  constructor(content, status = HttpStatus.SUCCESS) {
    this.content = content;
    this.status = status;
  }
}

export { ErrorResponse, SuccessResponse, HttpStatus };
