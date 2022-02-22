import { LayoutDefaultComponent } from './layout.js';
import { sessionStore } from './clientstore.js';
import { DateNavigatorComponent, DropDownSelectorComponent } from './shared.js';
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
    '    <drop-down label="View as" :options="[{text:\'Input\', value:\'I\'}, {text:\'Summary\', value:\'S\'}]" v-on:change="handleViewChange"></drop-down>' +
    '    <date-navigator v-on:date-change="handleDateChange"></date-navigator>' +
    '    <section class="main__content">' +
    '        <div class="alert alert--danger" v-if="showAlert">{{ alertMessage }}</div>' +
    '        <table class="table" v-if="viewMode == 0">'+
    '            <thead>'+
    '                <tr>'+
    '                    <th class="table__col table__col--time">Begin</th>'+
    '                    <th class="table__col table__col--time">End</th>'+
    '                    <th class="table__col">Description</th>'+
    '                    <th class="table__col table__col--actions">Actions</th>'+
    '                </tr>'+
    '            </thead>' +
    '            <tbody v-if="timeEntries.length > 0">' +
    '                <tr v-for="timeEntry in timeEntries" v-bind:class="{ \'table__row--edit\': selectedEntryId === timeEntry.id }" >' +
    '                    <td class="table__col">{{timeEntry.begin}}</td>' +
    '                    <td class="table__col">{{timeEntry.end}}</td>' +
    '                    <td class="table__col">{{timeEntry.description}}</td>' +
    '                    <td class="table__col table__col--actions">' +
    '                        <a href="#" class="btn btn--sm btn--secondary" title="Cancel" v-if="selectedEntryId === timeEntry.id" v-on:click.prevent="clearEntryFromEdit()"><i class="icon action__cancel"></i></a>' +
    '                        <a href="#" class="btn btn--sm" title="Edit" v-else v-on:click.prevent="setEntryToEdit(timeEntry.id)"><i class="icon action__edit"></i></a>' +
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
    '                                <input id="inTimeLog" ref="inTimeLog" class="ctrl" type="text" name="tbEntry" placeholder="@08:00-12:00 Worked on non important stuff for #Task #Project" autocomplete="off"' +
    '                                   v-model="input.entryText" /> ' +
    '                            </fieldset>'+
    '                            <div class="timelog__form--actions">'+
    '                                <button class="btn btn--sm btn--primary" type="submit">Save</button>'+
    '                                <button class="btn btn--sm btn--secondary" v-if="!selectedEntryId" v-on:click.prevent="clearTimeEntry">Clear</button>'+
    '                                <button class="btn btn--sm btn--secondary" v-if="selectedEntryId" v-on:click.prevent="deleteTimeEntry">Delete</button>'+
    '                            </div>'+
    '                        </form>'+
    '                    </td>'+
    '                </tr>'+
    '            </tfoot>'+
    '        </table>' +
    '        <table class="table" v-else>' +
    '            <thead>' +
    '                <tr>' +
    '                    <th class="table__col">Description</th>' +
    '                    <th class="table__col table__col--duration">Duration</th>' +
    '                </tr>' +
    '            </thead>' +
    '            <tbody v-if="summaryEntries.length > 0">' +
    '                <tr v-for="summaryEntry in summaryEntries">' +
    '                    <td class="table__col">{{summaryEntry.title}}</td>' +
    '                    <td class="table__col table__col--duration">{{summaryEntry.durationString}}</td>' +
    '                </tr>' +
    '            </tbody>' +
    '            <tbody v-else>' +
    '                <tr class="table__row--empty"><td colspan="2" class="table__col">It is rather lonely in here :( ...</td></tr>' +
    '            </tbody>' +
    '        </table>' +
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
            summaryEntries: [],
            totalDuration: '0m',
            viewMode: 0
        }
    },
    created() {
        this.fetchData();
    },
    methods: {

        clearEntryFromEdit: function (event) {
            let dailyLogs = this;
            dailyLogs.selectedEntryId = null;
            dailyLogs.clearTimeEntry(event);
            dailyLogs.setAlert();
        },

        clearTimeEntry: function (event) {
            this.input.entryText = '';
        },

        deleteTimeEntry: function (event) {
            let dailyLogs = this,
                ixEntry = dailyLogs.timeEntries.findIndex(o => o.id === dailyLogs.selectedEntryId),
                ix = dailyLogs.selectedEntryId;
            // copy new object back into the stack
            dailyLogs.timeEntries.splice(ixEntry, 1);
            dailyLogs.recalculateTotalDuration();
            dailyLogs.clearEntryFromEdit();
            dailyLogs.setAlert();
            // submit entry to server
            axios.post('api/timeentry/delete', { Id: ix }).then(function (response) {
                // we don't need to do anything
            }).catch(function (error) {
                if (error.response.status === 401 || error.response.status === 403) {
                    sessionStore.setter.isLoggedIn(false);
                    router.push('/');
                }
                else {
                    dailyLogs.setAlert('Oops. Something went wrong. Please, try again later');
                }
            });
        },

        fetchData: function () {
            let dailyLogs = this,
                router = this.$router;
            dailyLogs.timeEntries = [];
            dailyLogs.setAlert();
            dailyLogs.focusTimeLogInput();
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
                    dailyLogs.setAlert('Oops. Something went wrong. Please, try again later');
                }
            });
        },

        focusTimeLogInput: function () {
            var dailyLogs = this;
            dailyLogs.$nextTick(() => {
                dailyLogs.$refs.inTimeLog.focus();
            });
        },

        handleDateChange: function (newDate) {
            let dailyLogs = this;
            dailyLogs.selectedDate = newDate;
            dailyLogs.fetchData();
        },

        handleViewChange: function (obj) {
            let dailyLogs = this,
                viewMode = obj.target.selectedOptions[0].value;
            if (viewMode === 'S') {
                dailyLogs.prepareSummaryView();
                dailyLogs.viewMode = 1;
            }
            else {
                dailyLogs.viewMode = 0;
            }
        },

        insertTimeEntry: function () {
            let dailyLogs = this,
                entryFromString = timeEntryFormatter.fromInputFieldToObject(dailyLogs.selectedDate, dailyLogs.input.entryText),
                entryTemporary = dailyLogs.newEntryFromApiEntry(entryFromString),
                extid = Date.now();
            // set external id, add entry directly to timeEntriesArray and recalculate duration
            entryTemporary.extId = extid;
            dailyLogs.timeEntries.push(entryTemporary);
            dailyLogs.recalculateTotalDuration();
            dailyLogs.clearTimeEntry();
            dailyLogs.setAlert();
            // submit entry to server
            axios.post('api/timeentry/create', entryFromString).then(function (response) {
                var ixEntry = dailyLogs.timeEntries.findIndex((o => o.extId === extid)),
                    newEntry = dailyLogs.newEntryFromApiEntry(response.data);
                dailyLogs.timeEntries[ixEntry].id = newEntry.id;
            }).catch(function (error) {
                if (error.response.status === 401 || error.response.status === 403) {
                    sessionStore.setter.isLoggedIn(false);
                    router.push('/');
                }
                else {
                    dailyLogs.setAlert('Oops. Something went wrong. Please, try again later');
                }
            });
        },

        newEntryFromApiEntry: function (entry) {
            let newEntry = { id: entry.id, begin: '', end: '', description: entry.description, duration: 0, durationStr: ''};
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

        prepareSummaryView: function () {
            let dailyLogs = this;
            dailyLogs.summaryEntries = [];
            for (var i = 0; i < dailyLogs.timeEntries.length; i++) {
                let entry = dailyLogs.timeEntries[i],
                    tags = timeEntryFormatter.getTags(entry.description);
                for (var j = 0; j < tags.length; j++) {
                    let tag = '#' + tags[j],
                        ix = dailyLogs.summaryEntries.findIndex(e => e.title == tag);
                    if (ix === -1) {
                        dailyLogs.summaryEntries.push({
                            title: tag,
                            duration: entry.duration,
                            durationString: durationFormatter.fromDuration(entry.duration)
                        });
                    }
                    else {
                        dailyLogs.summaryEntries[ix].duration += entry.duration;
                        dailyLogs.summaryEntries[ix].durationString = durationFormatter.fromDuration(dailyLogs.summaryEntries[ix].duration);
                    }
                }
            }
            dailyLogs.summaryEntries.sort(function (a, b) {
                let titleA = a.title,
                    titleB = b.title;
                if (titleA < titleB)
                    return -1;
                if (titleA > titleB)
                    return 1;
                return 0;
            });
        },

        recalculateTotalDuration: function () {
            let dailyLogs = this,
                totalDuration = 0;
            dailyLogs.timeEntries.forEach((entry) => {
                totalDuration += entry.duration;
            });
            dailyLogs.totalDuration = durationFormatter.fromDuration(totalDuration);
        },

        setAlert: function (message) {
            let dailyLogs = this;
            dailyLogs.showAlert = (message) ? true : false;
            dailyLogs.alertMessage = message;
        },

        setEntryToEdit: function (entryId) {
            let dailyLogs = this,
                ixEntry = dailyLogs.timeEntries.findIndex((o => o.id === entryId)),
                entry;
            dailyLogs.setAlert();
            if (ixEntry == -1) {
                return;
            }
            entry = dailyLogs.timeEntries[ixEntry];
            dailyLogs.selectedEntryId = entry.id;
            dailyLogs.input.entryText = timeEntryFormatter.fromObjectToInputField(entry);
            dailyLogs.focusTimeLogInput();
        },

        submitTimeEntry: function (event) {
            let dailyLogs = this;
            if (dailyLogs.selectedEntryId) {
                dailyLogs.updateTimeEntry();
            }
            else {
                dailyLogs.insertTimeEntry();
            }
        },

        updateTimeEntry: function () {
            let dailyLogs = this,
                entryFromString = timeEntryFormatter.fromInputFieldToObject(dailyLogs.selectedDate, dailyLogs.input.entryText),
                ixEntry = dailyLogs.timeEntries.findIndex(o => o.id === dailyLogs.selectedEntryId);
            entryFromString.id = dailyLogs.selectedEntryId;
            // copy new object back into the stack
            dailyLogs.timeEntries[ixEntry] = dailyLogs.newEntryFromApiEntry(entryFromString);
            dailyLogs.recalculateTotalDuration();
            dailyLogs.clearEntryFromEdit();
            dailyLogs.setAlert();
            // submit entry to server
            axios.post('api/timeentry/update', entryFromString).then(function (response) {
                // we don't need to do anything
            }).catch(function (error) {
                if (error.response.status === 401 || error.response.status === 403) {
                    sessionStore.setter.isLoggedIn(false);
                    router.push('/');
                }
                else {
                    dailyLogs.setAlert('Oops. Something went wrong. Please, try again later');
                }
            });
        }

    },
    components: {
        'layout-default': LayoutDefaultComponent,
        'date-navigator': DateNavigatorComponent,
        'drop-down': DropDownSelectorComponent
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
