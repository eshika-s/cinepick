import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { User } from '../models/User'

export interface AuthRequest extends Request {
  user?: any
  headers: any
  params: any
  body: any
  query: any
}

export const generateToken = (userId: string) => {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not defined')
  }
  
  return jwt.sign(
    { userId }, 
    secret, 
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  )
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    let token

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    const user = await User.findById(decoded.userId)

    if (!user) {
      return res.status(401).json({ message: 'Invalid token. User not found.' })
    }

    req.user = user
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token.' })
  }
}
