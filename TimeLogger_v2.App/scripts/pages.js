﻿import { LayoutDefaultComponent } from './layout.js';
import { durationCalculator, timeEntryFormatter } from './common.js';

/* * * * * * * * * * * * * * * * * * *
 *   HomeComponent                   *
 * * * * * * * * * * * * * * * * * * */
let templateHome =
    '<layout-default>' +
    '    <header class="main__title">' + 
    '        <h1 class="main__title--title">Daily logs</h1>' +
    '        <p class="main__title--sub">Logged today: <em class="main__title--info">{{totalDuration}}</em></p>' +
    '    </header>' +
    '    <section class="main__content">' +
    '        <table class="table">'+
    '            <thead>'+
    '                <tr>'+
    '                    <th class="table__col table__col--time">Begin</th>'+
    '                    <th class="table__col table__col--time">End</th>'+
    '                    <th class="table__col">Description</th>'+
    '                    <th class="table__col table__col--actions">Actions</th>'+
    '                </tr>'+
    '            </thead>' +
    '            <tbody v-if="timeEntries.length > 0">' +
    '                <tr v-for="timeEntry in timeEntries">' +
    '                    <td class="table__col">{{timeEntry.begin}}</td>' +
    '                    <td class="table__col">{{timeEntry.end}}</td>' +
    '                    <td class="table__col">{{timeEntry.description}}</td>' +
    '                    <td class="table__col table__col--actions">' +
    '                        <a href="#" class="btn btn--sm btn--secondary" v-if="timeEntry.isEdited">Cancel</a>' +
    '                        <a href="#" class="btn btn--sm" v-else>Edit</a>' +
    '                    </td>' +
    '                </tr>' +
    '                <tr class="table__row--edit">'+
    '                    <td class="table__col">08:00</td>'+
    '                    <td class="table__col">10:35</td>'+
    '                    <td class="table__col">Worked on some important stuff #General _Task1</td>'+
    '                    <td class="table__col table__col--actions"><a href="#" class="btn btn--sm btn--secondary">Cancel</a></td>'+
    '                </tr>'+
    '                <tr>'+
    '                    <td class="table__col">10:35</td>'+
    '                    <td class="table__col">11:57</td>'+
    '                    <td class="table__col">Worked on some non-important stuff #General _Task2</td>'+
    '                    <td class="table__col table__col--actions"><a href="#" class="btn btn--sm">Edit</a></td>'+
    '                </tr>'+
    '            </tbody>' +
    '            <tbody v-else>' +
    '                <tr class="table__row--empty"><td colspan="4" class="table__col">It is rather lonely in here :( ...</td></tr>' +
    '            </tbody>' +
    '            <tfoot>'+
    '                <tr>'+
    '                    <td colspan="4">'+
    '                        <form class="timelog__form" name="edit" novalidate="novalidate">'+
    '                            <fieldset>'+
    '                                <input id="inTimeLog" class="ctrl" type="text" name="tbEntry" placeholder="@08:00-12:00 Worked on non important stuff for _Task #Channel" v-model="input.entryText" />'+
    '                            </fieldset>'+
    '                            <div class="timelog__form--actions">'+
    '                                <a href="#" class="btn btn--sm btn--primary">Save</a>'+
    '                                <a href="#" class="btn btn--sm btn--secondary">Delete</a>'+
    '                            </div>'+
    '                        </form>'+
    '                    </td>'+
    '                </tr>'+
    '            </tfoot>'+
    '        </table>'+
    '    </section>' +
    '</layout-default>';

export const HomeComponent = {
    data() {
        return {
            alertMessage: '',
            input: {
                entryText: ''
            },
            timeEntries: [],
            totalDuration: '0m'
        }
    },
    created() {
        this.fetchData();
    },
    methods: {
        fetchData: function () {
            var dailyLogs = this;
            axios.get('/api/timeentry/list').then(function (response) {
                var entries = response.data;
                var totalDuration = 0;
                entries.forEach((entry) => {
                    var newEntry = { id: entry.id, begin: '', end: '', description: entry.description, duration: 0, durationStr: '', isEdited: false };
                    if (entry.begin) {
                        newEntry.begin = timeEntryFormatter.fromApiDateTime(entry.begin);
                    }
                    if (entry.end) {
                        newEntry.end = timeEntryFormatter.fromApiDateTime(entry.end);
                    }
                    newEntry.duration = durationCalculator.calc(entry.begin, entry.end);
                    newEntry.durationStr = timeEntryFormatter.fromDuration(newEntry.duration);
                    dailyLogs.timeEntries.push(newEntry);
                    totalDuration += newEntry.duration;
                });
                dailyLogs.totalDuration = timeEntryFormatter.fromDuration(totalDuration);
            }).catch(function (error) {
                //TODO: display alert message
                console.log(error);
            });
        }

    },
    components: {
        'layout-default': LayoutDefaultComponent
    },
    template: templateHome
};


/* * * * * * * * * * * * * * * * * * *
 *   InsightsComponent               *
 * * * * * * * * * * * * * * * * * * */
let templateInsights =
    '<layout-default>' +
    '    <header class="main__title">' +
    '        <h1 class="main__title--title">Insights</h1>' +
    '    </header>' +
    '</layout-default>';

export const InsightsComponent = {
    components: {
        'layout-default': LayoutDefaultComponent
    },
    template: templateInsights
};


/* * * * * * * * * * * * * * * * * * *
 *   TasksComponent               *
 * * * * * * * * * * * * * * * * * * */
let templateTasks =
    '<layout-default>' +
    '    <header class="main__title">' +
    '        <h1 class="main__title--title">Task list</h1>' +
    '    </header>' +
    '</layout-default>';

export const TasksComponent = {
    components: {
        'layout-default': LayoutDefaultComponent
    },
    template: templateTasks
};


/* * * * * * * * * * * * * * * * * * *
 *   NotYetImplementedComponent      *
 * * * * * * * * * * * * * * * * * * */
let templateNotYetImplemented =
    '<layout-default>' +
    '    <header class="main__title">' +
    '        <h1 class="main__title--title">Under construction</h1>' +
    '    </header>' +
    '    <section class="main__content content__nyi">' +
    '        <p>This page does not exist yet. Check back soon.</p>' +
    '    </section>' +
    '</layout-default>';

export const NotYetImplementedComponent = {
    components: {
        'layout-default': LayoutDefaultComponent
    },
    template: templateNotYetImplemented
};
