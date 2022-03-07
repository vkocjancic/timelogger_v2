import{sessionStore}from"./clientstore.js";let templateLogin='<section class="account__section">   <div class="account__container">       <form name="login" class="account__form" novalidate="novalidate" v-on:submit.prevent="signIn">           <img src="../images/login_logo.png" alt="TimeLogger logo" class="account__form__logo" />           <fieldset>               <div class="alert alert--danger" v-if="showAlert">{{ alertMessage }}</div>               <p>Enter your <strong>email address</strong> and <strong>password</strong></p>               <div><input id="inUsername" name="inUsername" type="email" class="ctrl" placeholder="you@example.com" autofocus="autofocus" v-model="input.username" /></div>               <div><input id="inPassword" name="inPassword" type="password" class="ctrl" placeholder="password" v-model="input.password" /></div>               <div><button class="btn btn--block btn--primary" type="submit" :disabled="disableLogin">{{ input.buttonSignIn }}</button></div>               <ul>                   <li><router-link to="/forgot" class="btn btn--block">Forgot password?</router-link></li>                   <li><router-link to="/create" class="btn btn--block btn--secondary">Create account</router-link></li>               </ul>           </fieldset>       </form>   </div></section>';export const LoginComponent={data:()=>({alertMessage:"",disableLogin:!1,input:{buttonSignIn:"Sign in",username:"",password:""},showAlert:!1}),methods:{signIn:function(e){var s=this,t=this.$router,o=this.$route;axios.post("/api/account/login",{username:s.input.username,password:s.input.password}).then(function(e){sessionStore.setter.isLoggedIn(!0),sessionStore.setter.accountDetails({username:s.input.username,type:"MVP",expires:new Date("2022-12-31")}),s.showAlert=!1,t.push(o.query.redirect||"/")}).catch(function(e){if(s.showAlert=!0,401===e.response.status){s.alertMessage="Sorry, you have entered invalid e-mail or password",s.disableLogin=!0;var t=e.response.data.nextLoginTimeout;s.input.buttonSignIn="Next attempt in... "+t--;var o=setInterval(function(){0===t?(s.input.buttonSignIn="Sign in",s.disableLogin=!1,clearInterval(o)):s.input.buttonSignIn="Next attempt in... "+t--},1e3)}else s.alertMessage="Oops. Something went wrong. Please, try again later"})}},template:templateLogin};export const LogoutComponent={created(){this.doLogout()},methods:{doLogout:function(){sessionStore.getter.isLoggedIn()&&(axios.post("/api/account/logout"),sessionStore.setter.accountDetails(null),sessionStore.setter.isLoggedIn(!1)),this.$router.push("/")}},template:""};let templateCreateAccount='<section class="account__section">   <div class="account__container">       <form name="create" class="account__form" novalidate="novalidate" v-on:submit.prevent="signUp">           <img src="../images/login_logo.png" alt="TimeLogger logo" class="account__form__logo" />           <fieldset>               <div class="alert alert--danger" v-if="showAlert">{{ alertMessage }}</div>               <p>Enter your <strong>email address</strong> and <strong>password</strong></p>               <div><input id="inUsername" name="inUsername" type="email" class="ctrl" placeholder="you@example.com" autofocus="autofocus" v-model="input.username" /></div>               <div>                   <input id="inPassword" name="inPassword" type="password" class="ctrl" placeholder="password" v-model="input.password" />                   <span class="account__footnote">password policy: <strong>minimum 16 characters</strong></span>               </div>               <div><input id="inPasswordCheck" name="inPasswordCheck" type="password" class="ctrl" placeholder="password validation" v-model="input.passwordCheck" /></div>               <div>                   <button class="btn btn--block btn--primary" type="submit" :disabled="disableRegistration">{{ input.buttonRegister }}</button>                   <span class="account__footnote">By creating an account, you are agreeing to our <router-link to="/terms-of-service">Terms of Service</router-link> and <router-link to="/privacy">Privacy Policy</router-link></span>               </div>               <ul>                   <li><router-link to="/login" class="btn btn--block btn--secondary">Sign in</router-link></li>               </ul>           </fieldset>       </form>   </div></section>';function doValidation(e){var s=!0,t="";return e.input.username&&""===e.input.username?(s=!1,t="Your e-mail address is missing"):""===e.input.password&&""===e.input.passwordCheck?(s=!1,t="You have not set your password"):e.input.password.length<16?(s=!1,t="Your password is too short"):e.input.password!=e.input.passwordCheck&&(s=!1,t="Passwords do not match"),s?(e.alertMessage="",e.showAlert=!1):(e.alertMessage=t,e.showAlert=!0),s}export const CreateAccountComponent={data:()=>({alertMessage:"",disableRegistration:!1,input:{buttonRegister:"Yes, sign me up!",username:"",password:"",passwordCheck:""},showAlert:!1}),methods:{signUp:function(e){var s=this,t=this.$router,o=this.$route;doValidation(s)&&axios.post("/api/account/create",{username:s.input.username,password:s.input.password,passwordCheck:s.input.passwordCheck}).then(function(e){sessionStore.setter.isLoggedIn(!0),s.showAlert=!1,t.push(o.query.redirect||"/")}).catch(function(e){s.showAlert=!0,400===e.response.status?s.alertMessage=e.response.data.errorMessage?e.response.data.errorMessage:e.response.data:s.alertMessage="Oops. Something went wrong. Please, try again later"})}},template:templateCreateAccount};let templateForgotPassword='<section class="account__section">   <div class="account__container">       <form name="create" class="account__form" novalidate="novalidate" v-on:submit.prevent="sendPasswordRecoveryEmail">           <img src="../images/login_logo.png" alt="TimeLogger logo" class="account__form__logo" />           <fieldset>               <div class="alert" v-bind:class="getAlertMessageClass" v-if="showAlert">{{ alertMessage }}</div>               <p>Enter your <strong>email address</strong></p>               <div><input id="inUsername" name="inUsername" type="email" class="ctrl" placeholder="you@example.com" autofocus="autofocus" v-model="input.username" /></div>               <div>                   <button class="btn btn--block btn--primary" type="submit">{{ input.buttonRecovery }}</button>               </div>               <ul>                   <li><router-link to="/login" class="btn btn--block btn--secondary">Sign in</router-link></li>               </ul>           </fieldset>       </form>   </div></section>';export const ForgotPasswordComponent={data:()=>({alertMessage:"",hasError:!1,input:{buttonRecovery:"Send recovery e-mail",username:""},showAlert:!1}),computed:{getAlertMessageClass:function(){return this.hasError?"alert--danger":"alert--success"}},methods:{sendPasswordRecoveryEmail:function(e){var s=this;s.input.username&&0!=s.input.username.length||(s.alertMessage=message,s.showAlert=!0),axios.post("/api/account/forgot",{username:s.input.username}).then(function(e){s.alertMessage="Password recovery email has been sent to specified address",s.hasError=!1,s.showAlert=!0}).catch(function(e){s.alertMessage="Oops. Something went wrong. Please, try again later",s.hasError=!0,s.showAlert=!0})}},template:templateForgotPassword};let templatePasswordReset='<section class="account__section">   <div class="account__container">       <form name="create" class="account__form" novalidate="novalidate" v-on:submit.prevent="resetPassword">           <img src="../images/login_logo.png" alt="TimeLogger logo" class="account__form__logo" />           <fieldset>               <div class="alert alert--danger" v-if="showAlert">{{ alertMessage }}</div>               <p>Enter your new <strong>password</strong> twice</p>               <div>                   <input id="inPassword" name="inPassword" type="password" class="ctrl" placeholder="password" v-model="input.password" />                   <span class="account__footnote">password policy: <strong>minimum 16 characters</strong></span>               </div>               <div><input id="inPasswordCheck" name="inPasswordCheck" type="password" class="ctrl" placeholder="password validation" v-model="input.passwordCheck" /></div>               <div>                   <button class="btn btn--block btn--primary" type="submit">{{ input.buttonReset }}</button>               </div>           </fieldset>       </form>   </div></section>';export const PasswordResetComponent={data:()=>({alertMessage:"",hasError:!1,input:{buttonReset:"Reset password",password:"",passwordCheck:""},showAlert:!1}),methods:{resetPassword:function(e){var s=this,t=this.$router,o=this.$route;doValidation(s)&&(o.params.id&&0!=o.params.id.length||t.push("/"),axios.post("/api/account/passwordreset",{password:s.input.password,passwordCheck:s.input.passwordCheck,passwordResetId:o.params.id}).then(function(e){s.showAlert=!1,t.push("/")}).catch(function(e){s.showAlert=!0,400===e.response.status?s.alertMessage=e.response.data.errorMessage?e.response.data.errorMessage:e.response.data:s.alertMessage="Oops. Something went wrong. Please, try again later"}))}},template:templatePasswordReset};