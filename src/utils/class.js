import { v4 as uuidv4 } from "uuid";

class HttpStatus {
  static SUCCESS = "success";
  static FAILED = "failed";
}

class HttpResponse {
  content;
  status;
  traceId = uuidv4();
  constructor(content, status = HttpStatus.SUCCESS) {
    this.content = content;
    this.status = status;
  }
}

const cloudinary = {
  cloudName: process.env.CLOUDINARY_NAME,
  presetName: process.env.CLOUDINARY_PRESET,
};

export { HttpResponse, HttpStatus, cloudinary };
