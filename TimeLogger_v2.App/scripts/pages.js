import { LayoutDefaultComponent } from './layout.js';
import { sessionStore } from './clientstore.js';
import { DateNavigatorComponent } from './shared.js';
import { dateFormatter, durationCalculator, durationFormatter, timeEntryFormatter } from './common.js';

/* * * * * * * * * * * * * * * * * * *
 *   HomeComponent                   *
 * * * * * * * * * * * * * * * * * * */
let templateHome =
    '<layout-default>' +
    '    <header class="main__title">' + 
    '        <h1 class="main__title--title">Daily logs</h1>' +
    '        <p class="main__title--sub">Logged today: <em class="main__title--info">{{totalDuration}}</em></p>' +
    '    </header>' +
    '    <date-navigator v-on:date-change="handleDateChange"></date-navigator>' +
    '    <section class="main__content">' +
    '        <div class="alert alert--danger" v-if="showAlert">{{ alertMessage }}</div>' +
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
    '                <tr v-for="timeEntry in timeEntries" v-bind:class="{ \'table__row--edit\': timeEntry.isEdited }" >' +
    '                    <td class="table__col">{{timeEntry.begin}}</td>' +
    '                    <td class="table__col">{{timeEntry.end}}</td>' +
    '                    <td class="table__col">{{timeEntry.description}}</td>' +
    '                    <td class="table__col table__col--actions">' +
    '                        <a href="#" class="btn btn--sm btn--secondary" v-if="selectedEntryId === timeEntry.id">Cancel</a>' +
    '                        <a href="#" class="btn btn--sm" v-else v-on:click.prevent="setEntryToEdit(timeEntry.id)">Edit</a>' +
    '                    </td>' +
    '                </tr>' +
    '            </tbody>' +
    '            <tbody v-else>' +
    '                <tr class="table__row--empty"><td colspan="4" class="table__col">It is rather lonely in here :( ...</td></tr>' +
    '            </tbody>' +
    '            <tfoot>'+
    '                <tr>'+
    '                    <td colspan="4">'+
    '                        <form class="timelog__form" name="edit" novalidate="novalidate" v-on:submit.prevent="submitTimeEntry">'+
    '                            <fieldset>'+
    '                                <input id="inTimeLog" class="ctrl" type="text" name="tbEntry" placeholder="@08:00-12:00 Worked on non important stuff for >Task #Channel" autocomplete="off" v-model="input.entryText" /> '+
    '                            </fieldset>'+
    '                            <div class="timelog__form--actions">'+
    '                                <button class="btn btn--sm btn--primary" type="submit">Save</button>'+
    '                                <button class="btn btn--sm btn--secondary" v-if="!selectedEntryId" v-on:click.prevent="clearTimeEntry">Clear</button>'+
    '                                <button class="btn btn--sm btn--secondary" v-if="selectedEntryId">Delete</button>'+
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
            selectedDate: dateFormatter.toIsoDate(new Date()),
            selectedEntryId: null,
            showAlert: false,
            timeEntries: [],
            totalDuration: '0m',
        }
    },
    created() {
        this.fetchData();
    },
    methods: {
        clearTimeEntry: function (event) {
            this.input.entryText = '';
        },

        fetchData: function () {
            var dailyLogs = this,
                router = this.$router;
            axios.get('/api/timeentry/list', { params: { 'selectedDate': dailyLogs.selectedDate }}).then(function (response) {
                var entries = response.data;
                var totalDuration = 0;
                entries.forEach((entry) => {
                    var newEntry = dailyLogs.newEntryFromApiEntry(entry);
                    dailyLogs.timeEntries.push(newEntry);
                });
                dailyLogs.recalculateTotalDuration();
            }).catch(function (error) {
                if (error.response.status === 401 || error.response.status === 403) {
                    sessionStore.setter.isLoggedIn(false);
                    router.push('/');
                }
                else {
                    dailyLogs.alertMessage = 'Oops.Something went wrong.Please, try again later';
                    dailyLogs.showAlert = true;
                }
            });
        },

        handleDateChange: function (newDate) {
            var dailyLogs = this;
            dailyLogs.selectedDate = newDate;
            dailyLogs.fetchData();
        },

        newEntryFromApiEntry: function (entry) {
            var newEntry = { id: entry.id, begin: '', end: '', description: entry.description, duration: 0, durationStr: ''};
            if (entry.begin) {
                newEntry.begin = dateFormatter.fromApiDateTime(entry.begin);
            }
            if (entry.end) {
                newEntry.end = dateFormatter.fromApiDateTime(entry.end);
            }
            newEntry.duration = durationCalculator.calc(entry.begin, entry.end);
            newEntry.durationStr = durationFormatter.fromDuration(newEntry.duration);
            return newEntry;
        },

        recalculateTotalDuration: function () {
            var dailyLogs = this,
                totalDuration = 0;
            dailyLogs.timeEntries.forEach((entry) => {
                totalDuration += entry.duration;
            });
            dailyLogs.totalDuration = durationFormatter.fromDuration(totalDuration);
        },

        setEntryToEdit: function (entryId) {
            var dailyLogs = this;
            dailyLogs.selectedEntryId = entryId;
            //TODO: decide what to do with this...
        },

        submitTimeEntry: function (event) {
            var dailyLogs = this,
                entryFromString = timeEntryFormatter.fromInputFieldToObject(dailyLogs.selectedDate, dailyLogs.input.entryText),
                entryTemporary = dailyLogs.newEntryFromApiEntry(entryFromString),
                extid = Date.now();
            // set external id, add entry directly to timeEntriesArray and recalculate duration
            entryTemporary.extId = extid;
            dailyLogs.timeEntries.push(entryTemporary);
            dailyLogs.recalculateTotalDuration();
            // clear input field
            dailyLogs.input.entryText = '';
            // submit entry to server
            axios.post('api/timeentry/create', entryFromString).then(function (response) {
                var ixEntry = dailyLogs.timeEntries.findIndex((o => o.extId === extid)),
                    newEntry = dailyLogs.newEntryFromApiEntry(response.data);
                dailyLogs.timeEntries[ixEntry].id = newEntry.id;
                console.log(dailyLogs.timeEntries[ixEntry]);
            }).catch(function (error) {
                if (error.response.status === 401 || error.response.status === 403) {
                    sessionStore.setter.isLoggedIn(false);
                    router.push('/');
                }
                else {
                    dailyLogs.alertMessage = 'Oops. Something went wrong. Please, try again later';
                    dailyLogs.showAlert = true;
                }
            });
        }

    },
    components: {
        'layout-default': LayoutDefaultComponent,
        'date-navigator': DateNavigatorComponent
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
