// Protect routes by verifying the incoming JWT
import { Request, Response, NextFunction } from 'express';
import jwt, { TokenExpiredError } from 'jsonwebtoken';

interface JwtPayload {
    id: string;
}

export const protect = (req: Request, res: Response, next: NextFunction) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            //const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
            // You can attach user info to the request object here if needed
            // req.user = await User.findById(decoded.id).select('-password');
            jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
                // If the token is invalid or expired, the `err` object will be populated.
                if (err) {
                    if (err instanceof TokenExpiredError) {
                        res.status(401).json({ message: 'Token has expired' });
                    }
                    res.status(403).json({ message: 'Invalid token' });
                }
                else{
                    // If verification is successful, `user` will contain the decoded payload
                    // and you can attach it to the request object for use in subsequent middleware/routes.
                    console.log("--------------------token vertifcation successful-----------------");
                    res.status(200).json({
                        status:true,
                        message: 'Token Verfication Successful!',
                    });
                }
                next();
            });
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};