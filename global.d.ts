interface Object {
  checkString(): String
  checkObject(): Object
  checkArray(): Array
  checkBoolean(): boolean
  checkNull(): any
  containsValue(str: string): boolean
}

interface String {
  checkEmail(): String
  checkUrl(): String
  checkEmpty(): String
  checkPassword(): String
}

interface Array {
  checkIsEmpty(): Array
  checkStringArray(): Array
  checkNumberArray(): Array
}

interface HttpResponse {
  trace
}
