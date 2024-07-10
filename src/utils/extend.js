import {
  EmptyStringException,
  TypeException,
  NullException,
  InvalidValueException,
} from './exceptions.js'

Object.prototype.checkNull = function () {
  if (!this || this == null || this == undefined) {
    throw new NullException()
  }
  return this
}

Object.prototype.checkString = function () {
  if (typeof this !== 'string') throw new TypeException()
  const st = this.trim()
  if (st.length === 0) throw new InvalidValueException('Input can not be an empty string')
  return st
}
Object.prototype.checkBoolean = function () {
  if (typeof this !== 'boolean') throw new TypeException()
  return this
}
Object.prototype.checkObject = function () {
  if (
    Object.prototype.toString.call(this) === '[object Object]' &&
    (Object.getPrototypeOf(this) === Object.prototype || Object.getPrototypeOf(this) === null)
  )
    return this
  throw new TypeException()
}
Object.prototype.checkArray = function () {
  if (!Array.isArray(this)) throw new TypeException()
  return this
}

String.prototype.checkEmpty = function () {
  if (typeof this === 'string' && this.trim().length === 0) {
    throw new EmptyStringException()
  }
  return this.trim()
}
String.prototype.checkUrl = function () {
  try {
    const str = this.valueOf()
    let url = new URL(str)
    if (url.protocol === 'http:' || url.protocol === 'https:') {
      return str
    }
    throw new InvalidValueException('Url must contain http or https')
  } catch (e) {
    throw new InvalidValueException(e.message)
  }
}
String.prototype.checkEmail = function () {
  const re = new RegExp(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  )
  if (!re.test(this.valueOf())) throw new InvalidValueException('Email is not valid.')
  return this
}
Array.prototype.checkIsEmpty = function () {
  if (this.length === 0) throw new InvalidValueException('Array can not be empty.')
  return this
}
Array.prototype.checkNumberArray = function () {
  if (this.some((item) => typeof item !== 'number'))
    throw new InvalidValueException('Array should only contains numbers')
  return this
}
Array.prototype.checkStringArray = function () {
  if (this.some((item) => typeof item !== 'string' || item.length === 0))
    throw new InvalidValueException('Array should only contains valid strings')
  return this
}
Object.prototype.containsValue = function (val) {
  if (!Object.values(this).includes(val)) return false
  return true
}
const Role = {
  seller: 'seller',
  expert: 'expert',
  user: 'user',
}

export { Role }
