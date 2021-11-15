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
    '                    <li><a href="#" class="icon page__project">Project 1</a></li>' +
    '                    <li><a href="#" class="icon page__project">Project 2</a></li>' +
    '                    <li><a href="#" class="icon page__project--add">Add project</a></li>' +
    '                </ul>' +
    '            </nav>' +
    '        </div>' +
    '    </header>' +
    '    <main>' +
    '        <slot />' +
    '    </main>' +
    '</div>';

export const LayoutDefaultComponent = {
    template: templateLayoutDefault
};
/* END LayoutDefaultComponent        */