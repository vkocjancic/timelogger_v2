import { sessionStore } from './clientstore.js';

/* * * * * * * * * * * * * * * * * * *
 *   LayoutDefaultComponent          *
 * * * * * * * * * * * * * * * * * * */
let templateLayoutDefault =
    '<div class="layout">' +
    '    <header class="header__main">' +
    '        <h1>Timelogger v2</h1>' +
    '        <input type="checkbox" id="nav__main--toggle" class="nav__main--toggle" />' +
    '        <label for="nav__main--toggle" class="nav__main--toggle-label">' +
    '            <span></span>' +
    '        </label>' +
    '        <div class="nav__main">' +
    '            <nav class="nav__main--pages">' +
    '                <ul>' +
    '                    <li><router-link to="/" class="icon page__daily-logs">Daily logs</router-link></li>' +
    '                    <li><router-link to="/insights" class="icon page__insights">Insights</router-link></li>' +
    '                    <li><router-link to="/tasks" class="icon page__tasks">Tasks</router-link></li>' +
    '                </ul>' +
    '            </nav>' +
    '            <nav class="nav__main--projects">' +
    '                <h3>Projects</h3>' +
    '                <ul>' +
    '                    <li v-for="project in projects" :key="project.id"><router-link to="/nyi" class="icon page__project">{{ project.name }}</router-link></li>' +
    '                    <li><router-link to="/nyi" class="icon page__project--add">Add project</router-link></li>' +
    '                </ul>' +
    '            </nav>' +
    '        </div>' +
    '        <input type="checkbox" id="nav__sub--toggle" class="nav__sub--toggle" />' +
    '        <label for="nav__sub--toggle" class="nav__sub--toggle-label">' +
    '          <i></i>' +
    '        </label>' +
    '        <div class="nav__sub">' +
    '          <h3>{{username}}</h3>' +
    '          <ul>' +
    '        	<li><router-link to="/logout">Sign out of TimeLogger</router-link></li>' +
    '          </ul>' +
    '        </div>' +
    '    </header>' +
    '    <main>' +
    '        <slot />' +
    '    </main>' +
    '</div>';

export const LayoutDefaultComponent = {
    data() {
        return {
            projects: [],
            username: sessionStore.getter.username()
        }
    },
    created() {
        this.fetchData();
    },
    methods: {
        fetchData: function () {
            var layout = this;
            layout.projects = sessionStore.getter.projects();
            if (!layout.projects || layout.projects.length === 0) {
                axios.get('/api/project/list').then(function (response) {
                    layout.projects = response.data;
                    sessionStore.setter.projects(layout.projects);
                }).catch(function (error) {
                    console.log(error);
                });
            }
        }

    },
    template: templateLayoutDefault
};
/* END LayoutDefaultComponent        */