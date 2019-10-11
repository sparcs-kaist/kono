import { decodeToken, generateToken } from './token';

const host = () => {
    const { DEV_HOST, PROD_HOST, NODE_ENV } = process.env;
    return (NODE_ENV === 'development') ? DEV_HOST : PROD_HOST;
};

export default () => async (req, res, next) => {

    const token = req.cookies['access_token'];

    if (!token) {
        req.admin = null;
        next();
        return;
    }

    try {
        const decoded = await decodeToken(token);
        const { iat, exp, iss, ...admin } = decoded;
        const now = .001 * Date.now();
        
        if (exp < now) { // Token Expired
            req.admin = null;
            next();
            return;
        }

        if (exp - 60 * 10 < now) { // Token Expires in 10 minutes
            try {
                const token = await generateToken(admin);
                res.cookie('access_token', token, {
                    maxAge: 1000 * 60 * 60,
                    domain: host()
                });
            } catch(err) {
                res.status(500);
                res.send({ msg: 'server error' });
                return;
            }
        }
        
        req.admin = decoded;
    } catch(err) {
        req.admin = null;
    }

    next();
        
};