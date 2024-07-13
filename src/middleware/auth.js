import { AuthenticationException } from '../utils/exceptions.js'
import { verifyToken } from '../utils/auth.js'

const auth = (req, res, next) => {
  const token = req.cookies.token
  if (!token) {
    throw new AuthenticationException('User has not yet logged in.')
  }
  const decode = verifyToken(token)
  // @ts-ignore
  if (!decode) {
    throw new AuthenticationException('Invalid Token.')
  }
  // @ts-ignore
  req.user = decode.user
  next()
}

export default auth
