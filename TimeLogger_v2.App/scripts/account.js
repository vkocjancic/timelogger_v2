import { sessionStore } from './clientstore.js';

/* * * * * * * * * * * * * * * * * * * 
 *   LoginComponent                  *
 * * * * * * * * * * * * * * * * * * */
let templateLogin =
    '<section class="container d-flex h-100">' +
    '   <div class="justify-content-center align-self-center mx-auto col-md-8 col-lg-5">' +
    '       <div class="alert alert-danger" v-if="showAlert">{{ alertMessage }}</div>' +
    '       <form name="login" class="form-account" novalidate="novalidate" v-on:submit.prevent="signIn">' +
    '           <fieldset>' +
    '               <p>Enter your <strong>email address</strong> and <strong>password</strong></p>' +
    '               <div><input id="inUsername" name="inUsername" type="email" class="form-control" placeholder="you@example.com" autofocus="autofocus" v-model="input.username" /></div>' +
    '               <div><input id="inPassword" name="inPassword" type="password" class="form-control" placeholder="password" v-model="input.password" /></div>' +
    '               <div><button class="btn btn-lg btn-success btn-block" type="submit" :disabled="disableLogin">{{ input.buttonSignIn }}</button></div>' +
    '               <ul>' +
    '                   <li><router-link to="/forgot">Forgot password?</router-link></li>' +
    '                   <li>Don\'t have an account yet? <router-link to="/create">Create one</router-link></li>' +
    '               </ul>' +
    '           </fieldset>' +
    '       </form>' +
    '   </div>' +
    '</section>';

export const LoginComponent = {
    data() {
        return {
            alertMessage: '',
            disableLogin: false,
            input: {
                buttonSignIn: 'Sign in',
                username: '',
                password: ''
            },
            showAlert: false
        }
    },
    methods: {
        signIn: function (event) {
            var login = this,
                router = this.$router,
                route = this.$route;
            axios.post('/api/account/login', {
                username: login.input.username,
                password: login.input.password
            }).then(function (response) {
                sessionStore.setter.isLoggedIn(true);
                login.showAlert = false;
                router.push(route.query.redirect || '/');
            }).catch(function (error) {
                login.showAlert = true;
                if (error.response.status === 401) {
                    login.alertMessage = 'Sorry, you have entered invalid e-mail or password';
                    login.disableLogin = true;
                    var nextLoginTimeout = error.response.data.nextLoginTimeout;
                    login.input.buttonSignIn = 'Next attempt in... ' + (nextLoginTimeout--)
                    var nextLoginInterval = setInterval(function () {
                        if (nextLoginTimeout === 0) {
                            login.input.buttonSignIn = 'Sign in';
                            login.disableLogin = false;
                            clearInterval(nextLoginInterval);
                        }
                        else {
                            login.input.buttonSignIn = 'Next attempt in... ' + (nextLoginTimeout--);
                        }
                    }, 1000);
                }
                else {
                    login.alertMessage = 'Oops. Something went wrong. Please, try again later';
                }
            });
        }
    },
    template: templateLogin
};
/* END LoginComponent                */

/* * * * * * * * * * * * * * * * * * *
 *   CreateAccountComponent          *
 * * * * * * * * * * * * * * * * * * */
let templateCreateAccount = 
    '<section class="container d-flex h-100">' +
    '   <div class="justify-content-center align-self-center mx-auto col-md-8 col-lg-5">' +
    '       <div class="alert alert-danger" v-if="showAlert">{{ alertMessage }}</div>' +
    '       <form name="create" class="form-account" novalidate="novalidate" v-on:submit.prevent="signUp">' +
    '           <fieldset>' +
    '               <p>Enter your <strong>email address</strong> and <strong>password</strong></p>' +
    '               <div><input id="inUsername" name="inUsername" type="email" class="form-control" placeholder="you@example.com" autofocus="autofocus" v-model="input.username" /></div>' +
    '               <div>' +
    '                   <input id="inPassword" name="inPassword" type="password" class="form-control" placeholder="password" v-model="input.password" />' +
    '                   <span class="footnote">password policy: <strong>minimum 16 characters</strong></span>' +
    '               </div>' +
    '               <div><input id="inPasswordCheck" name="inPasswordCheck" type="password" class="form-control" placeholder="password validation" v-model="input.passwordCheck" /></div>' +
    '               <div>' +
    '                   <button class="btn btn-lg btn-success btn-block" type="submit" :disabled="disableRegistration">{{ input.buttonRegister }}</button>' +
    '                   <span class="footnote">By creating an account, you are agreeing to our <router-link to="/terms-of-service">Terms of Service</router-link> and <router-link to="/privacy">Privacy Policy</router-link></span>' +
    '               </div>' +
    '               <ul>' +
    '                   <li>Already have an account? <router-link to="/login">Sign in</router-link></li>' +
    '               </ul>' +
    '           </fieldset>' +
    '       </form>' +
    '   </div>' +
    '</section>';

function doValidation(signup) {
    var isValid = true,
        message = '';
    if (signup.input.username && signup.input.username === '') {
        isValid = false;
        message = 'Your e-mail address is missing';
    }
    else if (signup.input.password === '' && signup.input.passwordCheck === '') {
        isValid = false;
        message = 'You have not set your password';
    }
    else if (signup.input.password.length < 16)
    {
        isValid = false;
        message = 'Your password is too short';
    }
    else if (signup.input.password != signup.input.passwordCheck) {
        isValid = false;
        message = 'Passwords do not match';
    }
    if (isValid) {
        signup.alertMessage = '';
        signup.showAlert = false;
    }
    else {
        signup.alertMessage = message;
        signup.showAlert = true;
    }
    return isValid;
}

export const CreateAccountComponent = {
    data() {
        return {
            alertMessage: '',
            disableRegistration: false,
            input: {
                buttonRegister: 'Yes, sign me up!',
                username: '',
                password: '',
                passwordCheck: ''
            },
            showAlert: false
        }
    },
    methods: {
        signUp: function (event) {
            var signup = this,
                router = this.$router,
                route = this.$route;
            if (!doValidation(signup)) {
                return;
            }
            axios.post('/api/account/create', {
                username: signup.input.username,
                password: signup.input.password,
                passwordCheck: signup.input.passwordCheck
            }).then(function (response) {
                sessionStore.setter.isLoggedIn(true);
                signup.showAlert = false;
                router.push(route.query.redirect || '/');
            }).catch(function (error) {
                signup.showAlert = true;
                if (error.response.status === 400) {
                    signup.alertMessage = (error.response.data.errorMessage) ? error.response.data.errorMessage : error.response.data;
                }
                else {
                    signup.alertMessage = 'Oops. Something went wrong. Please, try again later';
                }
            });
        }
    },
    template: templateCreateAccount
};
/* END CreateAccountComponent        */

/* * * * * * * * * * * * * * * * * * *
 *   ForgotPasswordComponent         *
 * * * * * * * * * * * * * * * * * * */
let templateForgotPassword =
    '<section class="container d-flex h-100">' +
    '   <div class="justify-content-center align-self-center mx-auto col-md-8 col-lg-5">' +
    '       <div class="alert" v-bind:class="getAlertMessageClass" v-if="showAlert">{{ alertMessage }}</div>' +
    '       <form name="create" class="form-account" novalidate="novalidate" v-on:submit.prevent="sendPasswordRecoveryEmail">' +
    '           <fieldset>' +
    '               <p>Enter your <strong>email address</strong></p>' +
    '               <div><input id="inUsername" name="inUsername" type="email" class="form-control" placeholder="you@example.com" autofocus="autofocus" v-model="input.username" /></div>' +
    '               <div>' +
    '                   <button class="btn btn-lg btn-success btn-block" type="submit">{{ input.buttonRecovery }}</button>' +
    '               </div>' +
    '           </fieldset>' +
    '       </form>' +
    '   </div>' +
    '</section>';

export const ForgotPasswordComponent = {
    data() {
        return {
            alertMessage: '',
            hasError: false,
            input: {
                buttonRecovery: 'Send recovery e-mail',
                username: ''
            },
            showAlert: false
        }
    },
    computed: {
        getAlertMessageClass: function () {
            var forgotPassword = this;
            return forgotPassword.hasError ? 'alert-danger' : 'alert-success';
        }
    },
    methods: {
        sendPasswordRecoveryEmail: function (event) {
            var forgotPassword = this;
            if (!forgotPassword.input.username || forgotPassword.input.username.length == 0) {
                forgotPassword.alertMessage = message;
                forgotPassword.showAlert = true;
            }
            axios.post('/api/account/forgot', {
                username: forgotPassword.input.username
            }).then(function (response) {
                forgotPassword.alertMessage = 'Password recovery email has been sent to specified address';
                forgotPassword.hasError = false;
                forgotPassword.showAlert = true;
            }).catch(function (error) {
                forgotPassword.alertMessage = 'Oops. Something went wrong. Please, try again later';
                forgotPassword.hasError = true;
                forgotPassword.showAlert = true;
            });
        }
    },
    template: templateForgotPassword
};
/* END ForgotPasswordComponent       */

/* * * * * * * * * * * * * * * * * * *
 *   PasswordResetComponent          *
 * * * * * * * * * * * * * * * * * * */
let templatePasswordReset = 
    '<section class="container d-flex h-100">' +
    '   <div class="justify-content-center align-self-center mx-auto col-md-8 col-lg-5">' +
    '       <div class="alert alert-danger" v-if="showAlert">{{ alertMessage }}</div>' +
    '       <form name="create" class="form-account" novalidate="novalidate" v-on:submit.prevent="resetPassword">' +
    '           <fieldset>' +
    '               <p>Enter your new <strong>password</strong> twice</p>' +
    '               <div>' +
    '                   <input id="inPassword" name="inPassword" type="password" class="form-control" placeholder="password" v-model="input.password" />' +
    '                   <span class="footnote">password policy: <strong>minimum 16 characters</strong></span>' +
    '               </div>' +
    '               <div><input id="inPasswordCheck" name="inPasswordCheck" type="password" class="form-control" placeholder="password validation" v-model="input.passwordCheck" /></div>' +
    '               <div>' +
    '                   <button class="btn btn-lg btn-success btn-block" type="submit">{{ input.buttonReset }}</button>' +
    '               </div>' +
    '           </fieldset>' +
    '       </form>' +
    '   </div>' +
    '</section>';

export const PasswordResetComponent = {
    data() {
        return {
            alertMessage: '',
            hasError: false,
            input: {
                buttonReset: 'Reset password',
                password: '',
                passwordCheck: ''
            },
            showAlert: false
        }
    },
    methods: {
        resetPassword: function (event) {
            var pwdreset = this,
                router = this.$router,
                route = this.$route;
            if (!doValidation(pwdreset)) {
                return;
            }
            if (!route.params.id || 0 == route.params.id.length) {
                router.push('/');
            }
            axios.post('/api/account/passwordreset', {
                password: pwdreset.input.password,
                passwordCheck: pwdreset.input.passwordCheck,
                passwordResetId: route.params.id
            }).then(function (response) {
                pwdreset.showAlert = false;
                router.push('/');
            }).catch(function (error) {
                pwdreset.showAlert = true;
                if (error.response.status === 400) {
                    pwdreset.alertMessage = (error.response.data.errorMessage) ? error.response.data.errorMessage : error.response.data;
                }
                else {
                    pwdreset.alertMessage = 'Oops. Something went wrong. Please, try again later';
                }
            });
        }
    },
    template: templatePasswordReset
};
/* END ForgotPasswordComponent       */