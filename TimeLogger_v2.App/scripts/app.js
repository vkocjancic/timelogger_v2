import { sessionStore } from './clientstore.js';
import { CreateAccountComponent, ForgotPasswordComponent, LoginComponent, LogoutComponent, PasswordResetComponent } from './account.js';
import { HomeComponent, InsightsComponent, UpgradeAccountComponent, NotYetImplementedComponent } from './pages.js';

const PrivacyPolicyComponent = { template: '<p>Privacy policy</p>' };
const TermsOfServiceComponent = { template: '<p>Terms of service</p>' };

const DEFAULT_TITLE = "TimeLoggerLive v2";

const routes = [
    // public access routes
    { name: 'CreateAccount', path: '/create', component: CreateAccountComponent, meta: { isPublicPage: true, title: 'Create account' } },
    { name: 'ForgotPassword', path: '/forgot', component: ForgotPasswordComponent, meta: { isPublicPage: true, title: 'Forgot password' } },
    { name: 'Login', path: '/login', component: LoginComponent, meta: { isPublicPage: true, title: 'Login' } },
    { name: 'Logout', path: '/logout', component: LogoutComponent, meta: { isPublicPage: true } },
    { name: 'PasswordReset', path: '/password-reset/:id', component: PasswordResetComponent, meta: { isPublicPage: true, title: 'Password reset' } },
    { name: 'PrivacyPolicy', path: '/privacy', component: PrivacyPolicyComponent, meta: { isPublicPage: true, title: 'Privacy policy' } },
    { name: 'TermsOfService', path: '/terms-of-service', component: TermsOfServiceComponent, meta: { isPublicPage: true, title: 'Terms of service' } },
    // restricted access routes
    { name: 'Home', path: '/home', component: HomeComponent, meta: { title: 'Daily logs' } },
    { name: 'Insights', path: '/insights', component: InsightsComponent, meta: { title: 'Insights' } },
    { name: 'UpgradeAccount', path: '/upgrade-account', component: UpgradeAccountComponent, meta: { title: 'Upgrade your account' } },
    { name: 'NotYetImplemented', path: '/nyi', component: NotYetImplementedComponent, meta: { title: 'Not yet implemented' } },
    { path: '/', redirect: { name: 'Home' } }
];

const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
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
});

router.afterEach((to, from) => {
    Vue.nextTick(() => {
        let title = DEFAULT_TITLE;
        if (to.meta.title) {
            title += ' | ' + to.meta.title;
        }
        document.title = title;
    });
});

const vue_app = Vue.createApp({});
vue_app.use(router);
vue_app.mount('#app');