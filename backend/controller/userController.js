import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import joi from "joi"
import usermodel from "../models/userModel.js"

import dotenv from "dotenv"
import path from "path"
dotenv.config({ path: path.resolve("./.env") });

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

        const userArr = await usermodel.getUser(req.body.username)
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
            const token = jwt.sign({ id: user.id ,username: user.username },
                 process.env.SECRET_KEY,
                {expiresIn: '7d'});

            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV ,
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            if (req.xhr || (req.headers.accept && req.headers.accept.includes('application/json'))) {
                return res.json({ success: true, token: token });
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
            

        }

        const userArr = await usermodel.getUser(req.body.username)
        const user = userArr[0];

        if (user) {
            if (req.xhr || (req.headers.accept && req.headers.accept.includes('application/json'))) {
                return res.status(409).json({ success: false, error: 'UserAlreadyExists' });
            }
        }

        const hashpassword = await bcrypt.hash(req.body.password, 10)
        await usermodel.insertUser(
            req.body.username,
            hashpassword
        );

        const newUserArr = await usermodel.getUser(req.body.username);
        const newUser = newUserArr[0];

        const token = jwt.sign(
            { id: newUser.id ,username: newUser.username},
             process.env.SECRET_KEY,
            {expiresIn: '7d'});

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV ,
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        if (req.xhr || (req.headers.accept && req.headers.accept.includes('application/json'))) {
            return res.json({ success: true, toke:token });
        }

    } catch (error) {
        console.log(error)
    }


}

const userController = {
    login,
    signup
}

export default userController
