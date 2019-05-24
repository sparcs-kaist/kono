import { verify } from '../../../db/models/admin';

export const login = (req, res) => {
    
    const { password } = req.body;

    verify(password, () => {
        res.end('success');
    }, () => {
        res.end('failure');
    });

};