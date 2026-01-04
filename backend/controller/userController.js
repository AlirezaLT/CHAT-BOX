import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import joi from "joi"
import usermodule from "../module/userModule.js"


async function login(req, res, next) {
    try {

        const schema = joi.object({
            username: joi.string().min(5).max(12).required(),
            password: joi.string().min(5).max(20).required(),
        });

        const { error } = schema.validate(req.body);

        if (error) {
            if (req.xhr || (req.headers.accept && req.headers.accept.includes('application/json'))) {
                return res.status(400).json({ success: false, error: 'invalidInput' });
            }
            return res.redirect('/login?error=invalidInput');

        }

        const userArr = await usermodule.getUser(req.body.username)
        const user = userArr[0];

        if (!user) {
            
            if (req.xhr || (req.headers.accept && req.headers.accept.includes('application/json'))) {
                return res.status(401).json({ success: false, error: 'invalidCredentials' });
            }
            return res.redirect('/login?error=invalidCredentials');
        }

        const validpassword = await bcrypt.compare(req.body.password, user.password)
        if (!validpassword) {
            if (req.xhr || (req.headers.accept && req.headers.accept.includes('application/json'))) {
                return res.status(401).json({ success: false, error: 'invalidCredentials' });
            }
            return res.redirect('/login?error=invalidCredentials');
        }



        if (validpassword && user) {
            const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY);

            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 24 * 60 * 60 * 1000
            });

            if (req.xhr || (req.headers.accept && req.headers.accept.includes('application/json'))) {
                return res.json({ success: true, username: user.username });
            }

            res.redirect('/');
        }

    } catch (error) {
        console.log(error);
        if (req.xhr || (req.headers.accept && req.headers.accept.includes('application/json'))) {
            return res.status(500).json({ success: false, error: 'serverError' });
        }
        return res.redirect('/login?error=serverError');
    }



}


async function signup(req, res, next) {
    try {

        const schema = joi.object({
            username: joi.string().min(5).max(12).required(),
            password: joi.string().min(5).max(20).required(),
            confirmPassword: joi
                .string()
                .valid(joi.ref('password'))
                .required()
        });

        const { error } = schema.validate(req.body);

        if (error) {
            console.log('signup validation failed:', { body: req.body, details: error.details });
            if (req.xhr || (req.headers.accept && req.headers.accept.includes('application/json'))) {
                return res.status(400).json({ success: false, error: 'invalidInput' });
            }
            return res.redirect('/signup?error=invalidInput');

        }

        const userArr = await usermodule.getUser(req.body.username)
        const user = userArr[0];

        if (user) {
            if (req.xhr || (req.headers.accept && req.headers.accept.includes('application/json'))) {
                return res.status(409).json({ success: false, error: 'UserAlreadyExists' });
            }
            return res.redirect('/signup?error=UserAlreadyExists');
        }

        const hashpassword = await bcrypt.hash(req.body.password, 10)
        await usermodule.insertUser(
            req.body.username,
            hashpassword
        );

        const newUserArr = await usermodule.getUser(req.body.username);
        const newUser = newUserArr[0];

        const token = jwt.sign({ id: newUser.id }, process.env.SECRET_KEY);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000
        });

        if (req.xhr || (req.headers.accept && req.headers.accept.includes('application/json'))) {
            return res.json({ success: true, username: newUser.username });
        }

        res.redirect('/signup?success=' + encodeURIComponent('UserRegistered'));
    } catch (error) {
        console.log(error)
    }


}

const userController = {
    login,
    signup
}

export default userController
