import { LayoutDefaultComponent } from './layout.js';

/* * * * * * * * * * * * * * * * * * *
 *   HomeComponent                   *
 * * * * * * * * * * * * * * * * * * */
let templateHome =
    '<layout-default>' +
    '    <h1>Home page</h1>' +
    '</layout-default>';

export const HomeComponent = {
    components: {
        'layout-default': LayoutDefaultComponent
    },
    template: templateHome
};