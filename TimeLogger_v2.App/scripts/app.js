import { sessionStore } from './clientstore.js';
import { CreateAccountComponent, ForgotPasswordComponent, LoginComponent, PasswordResetComponent } from './account.js';
import { HomeComponent, InsightsComponent, TasksComponent } from './pages.js';

const PrivacyPolicyComponent = { template: '<p>Privacy policy</p>' };
const TermsOfServiceComponent = { template: '<p>Terms of service</p>' };

const routes = [
    // public access routes
    { name: 'CreateAccount', path: '/create', component: CreateAccountComponent, meta: { isPublicPage: true } },
    { name: 'ForgotPassword', path: '/forgot', component: ForgotPasswordComponent, meta: { isPublicPage: true } },
    { name: 'Login', path: '/login', component: LoginComponent, meta: { isPublicPage: true } },
    { name: 'PasswordReset', path: '/password-reset/:id', component: PasswordResetComponent, meta: { isPublicPage: true } },
    { name: 'PrivacyPolicy', path: '/privacy', component: PrivacyPolicyComponent, meta: { isPublicPage: true } },
    { name: 'TermsOfService', path: '/terms-of-service', component: TermsOfServiceComponent, meta: { isPublicPage: true } },
    // restricted access routes
    { name: 'Home', path: '/home', component: HomeComponent },
    { name: 'Insights', path: '/insights', component: InsightsComponent },
    { name: 'Tasks', path: '/tasks', component: TasksComponent },
    { path: '/', redirect: { name: 'Home' } }
];

const router = new VueRouter({
    routes
});

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta && record.meta.isPublicPage)) {
        next();
    }
    else {
        if (sessionStore.getter.isLoggedIn()) {
            next();
        } else {
            next({ name: 'Login', query: { redirect: to.fullPath } });
        }
    }
})

var vue_app = new Vue({
    router
}).$mount("#app");