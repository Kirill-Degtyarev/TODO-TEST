import React, { useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase-config';
import AuthAction from '../../actions/authAction';

import lockImage from '../../resources/Lock.svg';

import './login.scss';

export default function Login({ setUser }) {
    const [registrationDisplayName, setRegistrationDisplayName] = useState('');
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [authorization, setAuthorization] = useState(true);
    const [registration, setRegistration] = useState(false);
    const [resent, setResent] = useState(false);
    onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
    });
    async function loginUser() {
        if (loginEmail !== '' && loginPassword !== '') {
            await AuthAction.login(loginEmail, loginPassword);
        }
    }
    async function userRegistration() {
        const passwordConfim = document.getElementById('password-confim');
        if (passwordConfim.value === loginPassword) {
            if (loginEmail !== '' && loginPassword !== '' && registrationDisplayName !== '') {
                await AuthAction.register(loginEmail, loginPassword, registrationDisplayName);
            }
        }
    }
    async function userResentPassword() {
        if (loginEmail !== '') {
            await AuthAction.resetPassword(loginEmail);
            setLoginPassword('');
            setRegistrationDisplayName('');
            setResent(false);
            setRegistration(false);
            setAuthorization(true);
        }
    }
    function lookPassword() {
        const password = document.getElementById('auth-password');
        password.type = 'text';
    }
    function hidePassword() {
        const password = document.getElementById('auth-password');
        password.type = 'password';
    }
    function changePageOnRegistration(e) {
        e.preventDefault();
        setLoginEmail('');
        setLoginPassword('');
        setRegistrationDisplayName('');
        setAuthorization(false);
        setResent(false);
        setRegistration(true);
    }
    function changePageOnAuthorization(e) {
        e.preventDefault();
        setLoginEmail('');
        setLoginPassword('');
        setRegistrationDisplayName('');
        setResent(false);
        setRegistration(false);
        setAuthorization(true);
    }
    function changePageOnReset(e) {
        e.preventDefault();
        setLoginEmail('');
        setLoginPassword('');
        setRegistrationDisplayName('');
        setRegistration(false);
        setAuthorization(false);
        setResent(true);
    }
    return (
        <div className="wrapper">
            {authorization ? (
                <div className="autorization-container _container">
                    <div className="body__autorization">
                        <div className="autorization__title">
                            <h2>??????????????????????</h2>
                        </div>
                        <form className="autorization__form">
                            <div className="autorization__form-email">
                                <h2 className="form__subtitle">Email</h2>
                                <input
                                    onChange={(e) => setLoginEmail(e.target.value)}
                                    id="auth-email"
                                    type="text"
                                    className="form-email__input"
                                    placeholder="cooper@example.com"
                                />
                            </div>
                            <h2 className="form__subtitle">????????????</h2>
                            <div className="autorization__form-password">
                                <input
                                    onChange={(e) => setLoginPassword(e.target.value)}
                                    id="auth-password"
                                    type="password"
                                    className="form-password__input"
                                    placeholder="????????????????"
                                />
                                <span
                                    className="password__input-icon"
                                    onMouseLeave={() => hidePassword()}
                                    onMouseEnter={() => {
                                        lookPassword();
                                    }}></span>
                            </div>
                            <div className="autorization__form-remeber">
                                <a
                                    href="/"
                                    onClick={(e) => {
                                        changePageOnReset(e);
                                    }}
                                    className="form__remeber-link">
                                    ???????????? ?????????????
                                </a>
                            </div>
                            <div className="autorization__form-log">
                                <input
                                    id="auth-enter"
                                    tabIndex="4"
                                    type="button"
                                    value="??????????"
                                    onClick={() => {
                                        loginUser();
                                    }}
                                />
                            </div>
                            <a
                                href="/"
                                onClick={(e) => {
                                    changePageOnReset(e);
                                }}
                                className="form__remeber-link-phone">
                                ???????????? ?????????????
                            </a>
                        </form>
                        <div className="autorization__footer">
                            <h2>
                                ?????? ?????? ?????????????????{' '}
                                <a href="/" onClick={(e) => changePageOnRegistration(e)}>
                                    ????????????????????????????????????
                                </a>
                            </h2>
                        </div>
                    </div>
                </div>
            ) : registration ? (
                <div className="registration-container _container">
                    <div className="body__registration">
                        <div className="registration__title">
                            <h2>????????c????????????</h2>
                        </div>
                        <form className="registration__form">
                            <div className="registration__form-fio">
                                <h2 className="form__subtitle">???????????????????????? ??????</h2>
                                <input
                                    onChange={(e) => {
                                        setRegistrationDisplayName(e.target.value);
                                    }}
                                    id="FIO"
                                    type="text"
                                    className="form-fio__input"
                                    placeholder="Regina Cooper"
                                />
                            </div>
                            <div className="registration__form-email">
                                <h2 className="form__subtitle">Email</h2>
                                <input
                                    onChange={(e) => setLoginEmail(e.target.value)}
                                    id="email"
                                    type="text"
                                    className="form-email__input"
                                    placeholder="cooper@example.com"
                                />
                            </div>
                            <h2 className="form__subtitle">????????????</h2>
                            <div className="registration__form-password">
                                <input
                                    onChange={(e) => setLoginPassword(e.target.value)}
                                    id="password"
                                    type="password"
                                    className="form-password__input"
                                    placeholder="????????????????"
                                />
                            </div>
                            <h2 className="form__subtitle">?????????????????????????? ????????????</h2>
                            <div className="registration__form-password-confirm">
                                <input
                                    id="password-confim"
                                    type="password"
                                    className="form-password__input-confirm"
                                    placeholder="????????????????"
                                />
                            </div>
                            <div className="registration__form-log">
                                <input
                                    id="registration-button"
                                    type="button"
                                    onClick={() => {
                                        userRegistration();
                                    }}
                                    value="????????????????????????????????????"
                                />
                            </div>
                        </form>
                        <div className="registration__footer">
                            <h2>
                                ?????? ???????? ???????????????
                                <a
                                    href="/"
                                    onClick={(e) => {
                                        changePageOnAuthorization(e);
                                    }}>
                                    ??????????
                                </a>
                            </h2>
                        </div>
                    </div>
                </div>
            ) : (
                resent && (
                    <div className="recovery-container _container">
                        <div className="body__recovery">
                            <div className="recovery__img">
                                <img src={lockImage} alt="" srcSet="" />
                            </div>
                            <form className="recovery__form">
                                <div className="recovery__title">
                                    <h2>???????????????????????????? ????????????</h2>
                                </div>
                                <h2 className="form__subtitle">Email</h2>
                                <div className="recovery__form-email">
                                    <input
                                        onChange={(e) => setLoginEmail(e.target.value)}
                                        id="email-recovery"
                                        type="text"
                                        className="form-email__input"
                                        placeholder="cooper@example.com"
                                    />
                                </div>
                                <div className="recovery__form-log">
                                    <input
                                        id="button-recovery"
                                        type="button"
                                        onClick={() => {
                                            userResentPassword();
                                        }}
                                        value="???????????????????????? ????????????"
                                    />
                                </div>
                            </form>
                            <div className="recovery__footer">
                                <h2>
                                    ?????????????? ??
                                    <a href="/" onClick={(e) => changePageOnAuthorization(e)}>
                                        ??????????????????????
                                    </a>
                                </h2>
                            </div>
                        </div>
                    </div>
                )
            )}
        </div>
    );
}
