interface Object {
  checkString(): String;
  checkObject(): Object;
  checkArray(): Array;
  checkBoolean(): boolean;
  checkNull(): any;
}

interface String {
  checkEmail(): String;
  checkUrl(): String;
  checkEmpty(): String;
}

interface Array {
  checkIsEmpty(): Array;
  checkStringArray(): Array;
  checkNumberArray(): Array;
}

interface HttpResponse {
  trace;
}
