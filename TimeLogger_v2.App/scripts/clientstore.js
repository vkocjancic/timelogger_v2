export const sessionStore = {
    getter: {
        isLoggedIn: function () {
            return sessionStorage.getItem('isLoggedIn') == 'true';
        }
    },
    setter: {
        isLoggedIn: function (value) {
            sessionStorage.setItem('isLoggedIn', value);
        }
    }
};