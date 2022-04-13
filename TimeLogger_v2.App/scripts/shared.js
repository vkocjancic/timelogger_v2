import { dateFormatter } from './common.js';


/* * * * * * * * * * * * * * * * * * *
 *   AlertComponent                  *
 * * * * * * * * * * * * * * * * * * */
let templateAlert =
    '<div class="alert" v-bind:class="getAlertClass" v-if="message">{{ message }}</div>';

export const AlertComponent = {
    props: ['message', 'type'],
    computed: {
        getAlertClass: function () {
            let alert = this,
                className = alert.type || 'danger';
            return 'alert--' + className;
        }
    },
    template: templateAlert
};
/* END DateNavigatorComponent        */


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
            selectedDate: dateFormatter.toIsoDate(new Date())
        }
    },

    props: ['type'],
    template: templateDateNavigator
};
/* END DateNavigatorComponent        */



/* * * * * * * * * * * * * * * * * * *
 *   DropDownSelectorComponent       *
 * * * * * * * * * * * * * * * * * * */
let templateDropDownSelector =
    '<section class="dd dd-pos-right">' +
    '    <label for="view-selector" class="dd--label">{{label}}:</label>' +
    '    <select name="view-selector" class="ctrl ctrl-inline dd--select" v-model="selectedValue">' +
    '	     <option v-for="option in options" class="dd--option" :value="option.value" :selected="option.value == selectedValue">{{option.text}}</option>' +
    '    </select>' +
    '</section>';

export const DropDownSelectorComponent = {
    data() {
        return {
            selectedValue: ''
        }
    },

    props: {
        label: String,
        options: Array
    },

    created() {
        let dd = this;
        if (dd.options) {
            dd.selectedValue = dd.options[0].value;
        }
    },

    template: templateDropDownSelector
};
/* END DropDownSelectorComponent     */


/* * * * * * * * * * * * * * * * * * *
 *   RangeNavigatorComponent         *
 * * * * * * * * * * * * * * * * * * */
let templateRangeNavigator =
    '<nav class="range__nav">' +
    '  <div class="range__nav--item">' +
    '	 <label for="tbDateFrom">From</label>' +
    '	 <input type="date" name="tbDateFrom" class="date__nav--picker" v-model="selectedDateFrom" v-on:change="$emit(\'range-change\', selectedDateFrom, selectedDateTo)" />' +
    '  </div>' +
    '  <div class="range__nav--item">' +
    '	 <label for="tbDateFrom">To</label>' +
    '	 <input type="date" name="tbDateTo" class="date__nav--picker" v-model="selectedDateTo" v-on:change="$emit(\'range-change\', selectedDateFrom, selectedDateTo)" />' +
    '  </div>' +
    '</nav>';

export const RangeNavigatorComponent = {
    data() {
        return {
            selectedDateFrom: dateFormatter.toIsoDate(new Date().addDays(-7)),
            selectedDateTo: dateFormatter.toIsoDate(new Date())
        }
    },

    props: ['type'],
    template: templateRangeNavigator
};
/* END RangeNavigatorComponent       */