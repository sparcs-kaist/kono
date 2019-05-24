const jwt = require('jsonwebtoken');

export const generateToken = (payload, onSuccess, onFailure) => {

    const { JWT_KEY: secret } = process.env;
    
    jwt.sign(payload, secret, {
        expiresIn: '1h',
        issuer: 'kono.kaist.ac.kr'
    }, (error, token) => {
        if (error)
            onFailure(error);
        onSuccess(token);
    });
    
}

export const decodeToken = (token, onSuccess, onFailure) => {
    jwt.verify(token, secret, (error, decoded) => {
        if (error)
            onFailure(error);
        onSuccess(decoded);
    });
}