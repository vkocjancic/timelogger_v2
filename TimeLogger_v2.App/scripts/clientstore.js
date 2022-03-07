export const sessionStore = {
    getter: {
        accountDetails: function () {
            return JSON.parse(sessionStorage.getItem('accountDetails'));
        },
        isLoggedIn: function () {
            return sessionStorage.getItem('isLoggedIn') == 'true';
        },
        projects: function () {
            return JSON.parse(sessionStorage.getItem('projects'));
        }
    },
    setter: {
        accountDetails: function (value) {
            sessionStorage.setItem('accountDetails', JSON.stringify(value));
        },
        isLoggedIn: function (value) {
            sessionStorage.setItem('isLoggedIn', value);
        },
        projects: function (value) {
            sessionStorage.setItem('projects', JSON.stringify(value));
        }
    }
};