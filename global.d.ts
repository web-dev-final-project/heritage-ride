interface Object {
  checkString(): String;
  checkObject(): Object;
  checkArray(): Array;
  checkBoolean(): boolean;
  checkNull(): any;
  checkNumber(): number;
  containsValue(str: string): boolean;
}

interface String {
  checkEmail(): String;
  checkUrl(): String;
  checkEmpty(): String;
  checkPassword(): String;
  checkObjectId(): String;
  checkSpace(): String;
  checkCharacter(): String;
}

interface Array {
  checkIsEmpty(): Array;
  checkStringArray(): Array;
  checkNumberArray(): Array;
}

interface HttpResponse {
  trace;
}

namespace Express {
  interface Request {
    user?: {
      _id: string;
      firstName: string;
      lastName: string;
      userName: string;
      password: string;
      avatar: string | undefined | null;
      email: string;
      address: string | undefined | null;
      role: [string];
    };
    refreshToken: (user: any | null) => void;
  }
}
