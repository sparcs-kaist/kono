import { decodeToken, generateToken } from './token';

export const JWTMiddleware = () => {
    return (req, res, next) => {

        const token = req.cookies['access_token'];
        const { DEV_HOST, PROD_HOST, NODE_ENV } = process.env;
        const host = NODE_ENV === 'development' ? DEV_HOST : PROD_HOST;

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
                        next();
                    }
                    else {
                        if (exp - 60 * 10 < now) { // Token Expires in 10 minutes
                            generateToken(admin,
                                (token) =>{
                                    res.cookie('access_token', token, {
                                        maxAge: 1000 * 60 * 60,
                                        domain: host
                                    });
                                    req.admin = decoded;
                                    next();
                                },
                                (error) => {
                                    res.status(500);
                                    res.send({ msg: 'server error' });
                                    console.log(error);
                                }
                            );
                        }
                        else {
                            req.admin = decoded;
                            next();
                        }
                    }
                }, (e) => {
                    req.admin = null;
                    next();
                }
            );
        }

    };

};
