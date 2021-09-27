/* * * * * * * * * * * * * * * * * * *
 *   LayoutDefaultComponent          *
 * * * * * * * * * * * * * * * * * * */
let templateLayoutDefault =
    '<div class="layout">' +
    '    <header class="header__main">' +
    '         Header' +
    '    </header> ' +
    '    <aside class="sidebar">' +
    '        <nav class="sidebar__nav--main">' +
    '            <ul>' +
    '                <li><a href="#" class="icon page__daily-logs">Daily logs</a></li>' +
    '                <li><a href="#" class="icon page__insights">Insights</a></li>' +
    '                <li><a href="#" class="icon page__tasks">Tasks</a></li>' +
    '            </ul>' +
    '        </nav>' +
    '        <nav class="sidebar__nav--projects">' +
    '            <h3>Projects</h3>' +
    '            <ul>' +
    '                <li><a href="#" class="icon page__project">Adacta</a></li>' +
    '                <li><a href="#" class="icon page__project">TimeLogger</a></li>' +
    '                <li><a href="#" class="icon page__project--add">Add project</a></li>' +
    '            </ul>' +
    '        </nav>' +
    '    </aside>' +
    '    <main><slot /></main>' +
    '</div>';

export const LayoutDefaultComponent = {
    template: templateLayoutDefault
};
/* END LayoutDefaultComponent        */