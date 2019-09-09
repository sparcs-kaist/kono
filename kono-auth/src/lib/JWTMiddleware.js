import { decodeToken } from './token';

export const JWTMiddleware = () => {
    return (req, res, next) => {

        const token = req.cookies['access_token'];

        if (!token) {
            req.admin = null;
            next();
        }
        else {
            decodeToken(token, 
                (decoded) => {
                    const { iat, exp, iss, ...admin } = decoded;
                    const now = .001 * Date.now();
                    if (exp < now) { // Token Expired
                        req.admin = null;
                    }
                    else {
                        if (exp - 60 * 10 < now) { // Token Expires in 10 minutes
                            console.log('expiring!');
                        }
                        req.admin = decoded;
                    }
                    next();
                }, (e) => {
                    req.admin = null;
                    next();
                }
            );
        }

    };

};