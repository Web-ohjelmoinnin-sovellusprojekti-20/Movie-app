import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { AccountContext } from './AccountContext.js';

const url = process.env.REACT_APP_API_URL;

export default function AccountProvider({children}) {
    const accountFromSessionStorage = sessionStorage.getItem('account');
    const [account, setAccount] = useState(accountFromSessionStorage ? JSON.parse(accountFromSessionStorage) : {email: '', password: ''});
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        const storedState = sessionStorage.getItem('isLoggedIn');
        return storedState === 'true';
    });

    useEffect(() => {
        sessionStorage.setItem('isLoggedIn', isLoggedIn);
    }, [isLoggedIn]);

    const signUp = async () => {
        const json = JSON.stringify(account);
        const headers = {headers: {'Content-Type': 'application/json'}};
        try {
            await axios.post(url + '/account/create',json,headers);
            setAccount({email: '', password: ''});
        } catch (error) {
            throw error;
        }
    };

    const signIn = async () => {
        const json = JSON.stringify(account);
        const headers = {headers: {'Content-Type': 'application/json'}};
        try {
            const response = await axios.post(url + '/account/login', json, headers);
            const token = response.data.token;
            sessionStorage.setItem('account', JSON.stringify(response.data));
        } catch (error) {
            setAccount({email: '', password: ''});
            throw error;
        }
    };

    const logOut = () =>{
        sessionStorage.removeItem('account');
        setAccount({email: '', password: ''});
        sessionStorage.removeItem('isLoggedIn');
    };

    const deleteAccount = async() => {
        const json = JSON.stringify(account)
    };
  return (
    <AccountContext.Provider value={{account,setAccount,signUp,signIn,logOut,isLoggedIn,setIsLoggedIn}}>
        { children }
    </AccountContext.Provider>
  );
}
