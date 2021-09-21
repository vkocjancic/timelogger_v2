﻿/* * * * * * * * * * * * * * * * * * *
 *   LayoutDefaultComponent          *
 * * * * * * * * * * * * * * * * * * */
let templateLayoutDefault =
    '<div class="layout">' +
    '    <header>Header</header>' +
    '    <aside>Sidebar</aside>' +
    '    <main><slot /></main>' +
    '</div>';

export const LayoutDefaultComponent = {
    template: templateLayoutDefault
};
/* END LayoutDefaultComponent        */