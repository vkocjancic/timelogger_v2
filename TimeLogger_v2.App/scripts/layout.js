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
    '                    <li><a href="#" class="icon page__daily-logs">Daily logs</a></li>' +
    '                    <li><a href="#" class="icon page__insights">Insights</a></li>' +
    '                    <li><a href="#" class="icon page__tasks">Tasks</a></li>' +
    '                </ul>' +
    '            </nav>' +
    '            <nav class="nav__main--projects">' +
    '                <h3>Projects</h3>' +
    '                <ul>' +
    '                    <li><a href="#" class="icon page__project">Adacta</a></li>' +
    '                    <li><a href="#" class="icon page__project">TimeLogger</a></li>' +
    '                    <li><a href="#" class="icon page__project--add">Add project</a></li>' +
    '                </ul>' +
    '            </nav>' +
    '        </div>' +
    '    </header>' +
    '    <main>' +
    '        <h1>Home page</h1>' +
    '    </main>' +
    '</div>';

export const LayoutDefaultComponent = {
    template: templateLayoutDefault
};
/* END LayoutDefaultComponent        */