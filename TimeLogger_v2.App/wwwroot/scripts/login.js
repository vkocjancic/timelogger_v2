import{sessionStore}from"./clientstore.js";let template='<section class="container d-flex h-100">   <div class="justify-content-center align-self-center mx-auto col-md-8 col-lg-5">       <div class="alert alert-danger" v-if="showAlert">{{ alertMessage }}</div>       <form name="login" class="form-signin" novalidate="novalidate" v-on:submit.prevent="signIn">           <fieldset>              <p>Enter your <strong>email address</strong> and <strong>password</strong></p>               <div><input id="inUsername" name="inUsername" type="email" class="form-control" placeholder="you@example.com" autofocus="autofocus" v-model="input.username" /></div>               <div><input id="inPassword" name="inPassword" type="password" class="form-control" placeholder="password" v-model="input.password" /></div>               <div><button class="btn btn-lg btn-success btn-block" type="submit" :disabled="disableLogin">{{ input.buttonSignIn }}</button></div>               <ul>                   <li><router-link to="/forgot">Forgot password?</router-link></li>                   <li>Don\'t have an account yet? <router-link to="/create">Create one</router-link></li>               </ul>           </fieldset>       </form>   </div></section>';export const LoginComponent={data:()=>({alertMessage:"",disableLogin:!1,input:{buttonSignIn:"Sign in",username:"",password:""},showAlert:!1}),methods:{signIn:function(e){var t=this,n=this.$router,o=this.$route;axios.post("/api/account/login",{username:t.input.username,password:t.input.password}).then(function(e){sessionStore.setter.isLoggedIn(!0),t.showAlert=!1,n.push(o.query.redirect||"/")}).catch(function(e){if(t.showAlert=!0,401===e.response.status){t.alertMessage="Sorry, you have entered invalid e-mail or password",t.disableLogin=!0;var n=e.response.data.nextLoginTimeout;t.input.buttonSignIn="Next attempt in... "+n--;var o=setInterval(function(){0===n?(t.input.buttonSignIn="Sign in",t.disableLogin=!1,clearInterval(o)):t.input.buttonSignIn="Next attempt in... "+n--},1e3)}else t.alertMessage="Oops. Something went wrong. Please, try again later"})}},template:template};