﻿import { dateFormatter } from './common.js';


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


/* * * * * * * * * * * * * * * * * * *
 *   TableComponent                  *
 * * * * * * * * * * * * * * * * * * */
let templateTableComponent =
    '<table class="table">' +
    '  <thead v-if="columns && columns.length > 0">' +
    '    <th class="table__col" :class="{ \'table__col--duration\': column.type == \'DURATION\', \'table__col--time\': column.type == \'TIME\' }" ' +
    '      v-for="column in columns">{{column.name}}</th>' +
    '    <th class="table__col table__col--actions" v-if="rowActions && rowActions.length > 0">Actions</th>' +
    '  </thead>' +
    '  <tbody v-if="values && values.length > 0">' +
    '    <tr v-for="value in values">' +
    '      <td class="table__col" :class="{ \'table__col--duration\': column.type == \'DURATION\', \'table__col--time\': column.type == \'TIME\'  }" ' +
    '        v-for="column in columns">{{ this.getColValue(column, value) }}' +
    '        <ul class="summary__details" v-if="displayDetails">' +
    '          <li v-for="entry in value.entries" class="summary__details--item">{{ this.getColDetailsValue(column, entry) }}</li>' +
    '        </ul>' +
    '      </td>' +
    '      <td class="table__col table__col--actions" v-if="rowActions && rowActions.length > 0" >' +
    '        <template v-for="action in rowActions">' +
    '          <a href="#" class="btn btn--sm btn--stack" :class="{\'btn--secondary\': action.style == \'secondary\'}" :title="action.name" ' +
    '            v-if="action.visible && value.actions.indexOf(action.name) != -1" v-on:click.prevent="$emit(\'action-clicked\', action.name, value.id)">' +
    '            <i class="icon" :class="\'action__\' + action.name.toLowerCase()"></i>' +
    '          </a>' +
    '        </template>' +
    '      </td>' +
    '    </tr>' +
    '  </tbody> ' +
    '  <tbody v-else>' +
    '    <tr class="table__row--empty"><td :colspan="getColCount" class="table__col">It is rather lonely in here :( ...</td></tr>' +
    '  </tbody> ' +
    '</table>';

export const TableComponent = {
    props: ['columns', 'displayDetails', 'idCol', 'rowActions', 'values'],
    data() {
        return {
        }
    },
    computed: {
        getColCount: function () {
            let control = this,
                colCount = control.columns.length;
            if (control.rowActions && control.rowActions.length > 0) {
                colCount++;
            }
            return colCount;
        }
    },
    methods:
    {
        getColValue: function (column, value) {
            let control = this,
                output = value[column.bindTo || column.name];
            return control.transformColValue(column, output);
        },

        getColDetailsValue: function (column, value) {
            let control = this,
                output = value[column.detailsBindTo || column.bindTo || column.name];
            return control.transformColValue(column, output);
        },

        transformColValue(column, output) {
            if (output && column.transform) {
                output = column.transform(output);
            }
            return output;
        }
    },
    template: templateTableComponent
};
/* END RangeNavigatorComponent       */