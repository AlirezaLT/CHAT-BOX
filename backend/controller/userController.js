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
            return res.redirect('/login?error=invalidInput');

        }

        const userArr = await usermodule.getUser(req.body.username)
        const user = userArr[0];

        if (!user) {
            // user not found
            return res.redirect('/login?error=invalidCredentials');
        }

        const validpassword = await bcrypt.compare(req.body.password, user.password)
        if (!validpassword) {
            return res.redirect('/login?error=invalidCredentials');
        }



        if (validpassword && user) {
            const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY);

            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 24 * 60 * 60 * 1000
            });

            res.redirect('/')
        }

    } catch (error) {
        console.log(error)
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
            return res.redirect('/signup?error=invalidInput');

        }

        const userArr = await usermodule.getUser(req.body.username)
        const user = userArr[0];

        if (user) return res.redirect('/signup?error=UserAlreadyExists');

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
