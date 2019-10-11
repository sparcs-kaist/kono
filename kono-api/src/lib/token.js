import jwt from 'jsonwebtoken';

const jwtKey = () => {
    const { JWT_KEY } = process.env;
    return JWT_KEY;
};

export const generateToken = (payload) => {

    return new Promise((resolve, reject) => {
        jwt.sign(payload, jwtKey(), {
            expiresIn: '1h',
            issuer: 'api.kono.sparcs.org'
        }, (error, token) => {
            if (error)
                reject(error);
            else
                resolve(token);
        });
    });

};

export const decodeToken = (token) => {

    return new Promise((resolve, reject) => {
        jwt.verify(token, jwtKey(), (error, decoded) => {
            if (error)
                reject(error);
            else
                resolve(decoded);
        });
    });

}