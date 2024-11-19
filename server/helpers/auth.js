import jwt from 'jsonwebtoken';
const { verify } = jwt;
const authorizationRequired = 'Authorization required';
const invalidCredentials = 'Invalid credentials';

const auth = (request,response,next) => {
    if(!request.headers.authorization) {
        response.statusMessage = authorizationRequired;
        response.status(401).json({message: authorizationRequired});
    } else {
        try {
            const token = request.headers.authorization;
            verify(token,process.env.JWT_SECRET_KEY);
            next();
        } catch(error) {
            response.statusMessage = invalidCredentials;
            response.status(403).json({message: invalidCredentials});
        }
    }
};

export { auth };