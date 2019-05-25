import { decodeToken } from './token';

export const JWTMiddleware = () => {
    return (req, res, next) => {

        const token = req.cookies['access_token'];

        if (!token) {        
            console.log('no token');
            req.admin = null;
            next();
        }
        else {
            decodeToken(token, 
                (decoded) => {
                    req.admin = decoded;
                    next();
                }, (e) => {
                    req.admin = null;
                    next();
                }
            );
        }

    };

};