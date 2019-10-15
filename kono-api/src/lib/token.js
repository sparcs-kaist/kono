import jwt from 'jsonwebtoken';
import dockerConfig from './docker.config';

const jwtKey = () => (process.env.JWT_KEY || dockerConfig.env.JWT_KEY);

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

};
