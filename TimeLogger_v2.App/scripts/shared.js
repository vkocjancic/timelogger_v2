import { dateFormatter } from './common.js';


/* * * * * * * * * * * * * * * * * * *
 *   DateNavigatorComponent          *
 * * * * * * * * * * * * * * * * * * */
let templateDateNavigator =
    '<nav class="date__nav">' +
    '    <input type="date" name="tbDate" class="date__nav--picker" v-model="selectedDate" v-on:change="$emit(\'date-change\', selectedDate)" />' +
    '</nav>';

export const DateNavigatorComponent = {
    data() {
        return {
            selectedDate: dateFormatter.toISODate(new Date())
        }
    },

    props: ['type'],
    template: templateDateNavigator
};
/* END DateNavigatorComponent        */