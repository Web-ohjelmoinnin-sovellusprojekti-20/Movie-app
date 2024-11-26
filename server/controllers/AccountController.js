import { ApiError } from '../helpers/ApiError.js';
import { compare, hash } from 'bcrypt';
import pkg from 'jsonwebtoken';
import { contains_capital_letter_and_a_number } from '../helpers/utils.js';
import { insertAccount, selectAccountByEmail } from '../models/Account.js';
import { request, response } from 'express';

const { sign } = pkg;

const createAccountObject = (email, token=undefined) => {
    return {
        'email': email,
        ...(token !== undefined && {'token': token})
    }
};

const getAccountEmail = async (request,response, next) => {
    try {
        selectAccountByEmail(request.body.email);
        return response.status(200).json(createAccountObject(request.body.email));
    } catch (error) {
        return next(error);
    }
};
// Email has to be an email address
// Password has to contain 8 characters, a capital letter and a number
const postAccountRegistration = async (request, response, next) => {
    try {
        console.log('In registration');
        const email = request.body.email;
        const password = request.body.password;
        console.log(email+' : '+password);
        if (!email || email.length === 0 || !/@/.test(email)) return next(new ApiError('Invalid email for registration',400));
        if (!password || password.length < 8 || !contains_capital_letter_and_a_number(password)) return next(new ApiError('Invalid password for registration',400));
        if ((await selectAccountByEmail(email)).rowCount !== 0) return next(new ApiError('Email already in use',400));
        console.log('Passed error handling');
        const hashedPassword = await hash(password, 10);
        console.log('Hashing done');
        const accountFromDb = await insertAccount(email, hashedPassword);
        const account = await accountFromDb.rows[0];
        return response.status(201).json(createAccountObject(account.email));
    } catch (error) {
        return next(error);
    }
};

const postAccountLogin = async (request, response, next) => {
    const invalid_credentials_message = 'Invalid credentials.';
    console.log('User trying to login...');
    try {
        const email = request.body.email;
        const password = request.body.password;
        if (!email || email.length === 0) return next(new ApiError(invalid_credentials_message,401));

        const accountFromDb = await selectAccountByEmail(email);
        if (accountFromDb.rowCount === 0) return next(new ApiError(invalid_credentials_message,401));

        const account = accountFromDb.rows[0];
        if (!await compare(password,account.password)) return next(new ApiError(invalid_credentials_message,401));
        
        const token = sign(email, process.env.JWT_SECRET_KEY);

        return response.status(200).json(createAccountObject(account.email,token));
    } catch (error) {
        return next(error);
    }
};

// TODO: In the future maybe add a jwt invalidation method here
const accountLogOut = async (request, response, next) => {

};

const deleteAccount = async (request,response,next) => {
    try {
        const email = request.body.email;
        const password = request.body.password;
        if (!email || email.length === 0) return next(new ApiError('Invalid email for deletion',400));
        const accountFromDb = await selectAccountByEmail(email);
        if (accountFromDb.rowCount === 0) return next(new ApiError('Email not found',404));
        const account = accountFromDb.rows[0];
        if (!await compare(password,account.password)) return next(new ApiError('Invalid password for deletion',401));

        await deleteAccountByEmail(email);

        return response.status(200).json({email: email});
    } catch (error) {
        return next(error);
    }
};

export { postAccountRegistration, postAccountLogin, deleteAccount, getAccountEmail };