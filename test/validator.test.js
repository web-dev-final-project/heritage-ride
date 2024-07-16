import { TypeException, InvalidValueException } from '../src/utils/exceptions.js'
import '../src/utils/extend.js'

describe('test validator functions', () => {
  describe('test extended functions', () => {
    it('should throw passing invalid string', () => {
      let inputVal = 1
      expect(() => inputVal.checkString()).toThrow(TypeException)
      expect(() => ''.checkString()).toThrow(InvalidValueException)
      expect(() => ' '.checkString()).toThrow(InvalidValueException)
    })
    it('should convert string', () => {
      expect(' password '.checkString()).toEqual('password')
    })
    it('should check and return url', () => {
      expect(() => 'fakeurl.com'.checkUrl()).toThrow(InvalidValueException)
      expect('http://www.fakeurl.com'.checkUrl()).toEqual('http://www.fakeurl.com')
    })
    it('should check and return email', () => {
      expect(() => 'fakeurl@.com'.checkEmail()).toThrow(InvalidValueException)
      expect('fakeurl@hotmail.edu'.checkEmail()).toEqual('fakeurl@hotmail.edu')
    })
    it('should validate password', () => {
      const invalid = 'Password must contains at least a lower case, upper case and numbers.'
      expect(() => ' password'.checkPassword()).toThrow('Password cannot contains spaces.')
      expect(() => '1234'.checkPassword()).toThrow('Password must be at least 8 charactors.')
      expect(() => 'password'.checkPassword()).toThrow(invalid)
      expect(() => 'password1'.checkPassword()).toThrow(invalid)
      expect(() => 'passwordA'.checkPassword()).toThrow(invalid)
      expect(() => 'passportA.123'.checkPassword()).toThrow(
        'Password can only contains special characters such as _-@#$%^&*!',
      )
      expect('password1A'.checkPassword()).toEqual('password1A')
    })
    it('should throw if not boolean', () => {
      expect(() => ' '.checkBoolean()).toThrow(TypeException)
      let a = true
      expect(a.checkBoolean()).toBe(a)
    })
    it('should throw if object is not obj literal', () => {
      expect(() => [].checkObject()).toThrow(TypeException)
    })
  })
})
