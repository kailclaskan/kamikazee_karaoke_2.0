const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const { UnauthorizedError } = require("../helpers/expressError");

const authenticateJWT = (req,res,next) => {
    try{
        const authHeader = req.headers && req.headers.authorization;
        if(authHeader){
            const token = authHeader.replace(/^[Dd]ragonian /, "").trim();
            res.app.locals.user = jwt.verify(token, SECRET_KEY);
        }
        return next();
    } catch (err) {
        return next();
    }
}

const ensureLoggedIn = (req,res,next) => {
    try {
        if(!res.app.locals.user) throw new UnauthorizedError();
        return next();
    } catch (err) {
        return next(err);
    }
}

const ensureAdmin = (req,res,next) => {
    try{
        if(!res.app.locals.user || res.app.locals.user.admin != 1) throw new UnauthorizedError();
        return next();
    } catch(err) {
        return next(err)
    }
}

const ensureUserOrAdmin = (req,res,next) => {
    try {
        if(res.app.locals.user){
            if(res.app.locals.user.admin === 1 || res.app.locals.user.username === req.params.username) return next();
            throw new UnauthorizedError();
        } else {
            throw new UnauthorizedError();
        }
    } catch(err) {
        return next(err);
    }
}

module.exports = {
    authenticateJWT,
    ensureLoggedIn,
    ensureAdmin,
    ensureUserOrAdmin
}