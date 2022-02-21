export const sessionStore = {
    getter: {
        isLoggedIn: function () {
            return sessionStorage.getItem('isLoggedIn') == 'true';
        },
        projects: function () {
            return JSON.parse(sessionStorage.getItem('projects'));
        },
        username: function () {
            return sessionStorage.getItem('username');
        }
    },
    setter: {
        isLoggedIn: function (value) {
            sessionStorage.setItem('isLoggedIn', value);
        },
        projects: function (value) {
            sessionStorage.setItem('projects', JSON.stringify(value));
        },
        username: function (value) {
            sessionStorage.setItem('username', value);
        }
    }
};