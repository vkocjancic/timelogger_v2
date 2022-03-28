import { LayoutDefaultComponent } from './layout.js';
import { sessionStore } from './clientstore.js';
import { DateNavigatorComponent, DropDownSelectorComponent } from './shared.js';
import { dailyLogsSummary, dateFormatter, durationCalculator, durationFormatter, timeEntryFormatter } from './common.js';

const ViewMode = {
    INPUT: 0,
    SUMMARY: 1
};

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
    '        <table class="table" v-if="viewMode == 0">' +
    '            <thead>' +
    '                <tr>' +
    '                    <th class="table__col table__col--time">Begin</th>' +
    '                    <th class="table__col table__col--time">End</th>' +
    '                    <th class="table__col">Description</th>' +
    '                    <th class="table__col table__col--actions">Actions</th>' +
    '                </tr>' +
    '            </thead>' +
    '            <tbody v-if="timeEntries.length > 0">' +
    '                <tr v-for="timeEntry in timeEntries" v-bind:class="{ \'table__row--edit\': selectedEntryId === timeEntry.id }" >' +
    '                    <td class="table__col">{{timeEntry.begin}}</td>' +
    '                    <td class="table__col">{{timeEntry.end}}</td>' +
    '                    <td class="table__col">{{timeEntry.description}}</td>' +
    '                    <td class="table__col table__col--actions">' +
    '                        <a href="#" class="btn btn--sm" title="Copy" v-if="!timeEntry.isUpdating" v-on:click.prevent="makeCopyForEntry(timeEntry.id)"><i class="icon action__copy"></i></a>' +
    '                        <a href="#" class="btn btn--sm btn--secondary" title="Cancel" v-if="selectedEntryId === timeEntry.id" v-on:click.prevent="clearEntryFromEdit()"><i class="icon action__cancel"></i></a>' +
    '                        <a href="#" class="btn btn--sm" title="Edit" v-if="selectedEntryId !== timeEntry.id && !timeEntry.isUpdating" v-on:click.prevent="setEntryToEdit(timeEntry.id)"><i class="icon action__edit"></i></a>' +
    '                    </td>' +
    '                </tr>' +
    '            </tbody>' +
    '            <tbody v-else>' +
    '                <tr class="table__row--empty"><td colspan="4" class="table__col">It is rather lonely in here :( ...</td></tr>' +
    '            </tbody>' +
    '            <tfoot>' +
    '                <tr>' +
    '                    <td colspan="4">' +
    '                        <form class="timelog__form" name="edit" novalidate="novalidate" v-on:submit.prevent="submitTimeEntry">' +
    '                            <fieldset>' +
    '                                <input id="inTimeLog" ref="inTimeLog" class="ctrl" type="text" name="tbEntry" placeholder="@08:00-12:00 Worked on non important stuff for #Task #Project" autocomplete="off"' +
    '                                   v-model="input.entryText" /> ' +
    '                            </fieldset>' +
    '                            <div class="timelog__form--actions">' +
    '                                <button class="btn btn--sm btn--primary" type="submit">Save</button>' +
    '                                <button class="btn btn--sm btn--secondary" v-if="!selectedEntryId" v-on:click.prevent="clearTimeEntry">Clear</button>' +
    '                                <button class="btn btn--sm btn--alert" v-if="selectedEntryId" v-on:click.prevent="deleteTimeEntry">Delete</button>' +
    '                            </div>' +
    '                        </form>' +
    '                    </td>' +
    '                </tr>' +
    '            </tfoot>' +
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
    '                    <td class="table__col">#{{summaryEntry.tag}}' +
    '                        <ul class="summary__details">' +
    '                            <li v-for="entry in summaryEntry.entries" class="summary__details--item">{{entry.description}}</li>' +
    '                        </ul>' +
    '                    </td> ' +
    '                    <td class="table__col table__col--duration">{{this.formatDuration(summaryEntry.duration)}}' +
    '                        <ul class="summary__details">' +
    '                            <li v-for="entry in summaryEntry.entries" class="summary__details--item">{{this.formatDuration(entry.duration)}}</li>' +
    '                        </ul>' +
    '                    </td>' +
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
            viewMode: ViewMode.INPUT
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
            let dailyLogs = this;
            dailyLogs.input.entryText = '';
            dailyLogs.focusTimeLogInput();
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
            axios.get('/api/timeentry/list', { params: { 'selectedDate': dailyLogs.selectedDate } }).then(function (response) {
                var entries = response.data;
                var totalDuration = 0;
                entries.forEach((entry) => {
                    var newEntry = dailyLogs.newEntryFromApiEntry(entry);
                    dailyLogs.timeEntries.push(newEntry);
                });
                dailyLogs.recalculateTotalDuration();
                if (dailyLogs.viewMode === ViewMode.SUMMARY) {
                    dailyLogs.prepareSummaryView();
                }
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
            if (dailyLogs.viewMode === ViewMode.INPUT) {
                dailyLogs.$nextTick(() => {
                    dailyLogs.$refs.inTimeLog.focus();
                });
            }
        },

        formatDuration: function (value) {
            return durationFormatter.fromDuration(value);
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
                dailyLogs.viewMode = ViewMode.SUMMARY;
            }
            else {
                dailyLogs.viewMode = ViewMode.INPUT;
                dailyLogs.focusTimeLogInput();
            }
        },

        insertTimeEntry: function () {
            let dailyLogs = this,
                entryFromString = timeEntryFormatter.fromInputFieldToObject(dailyLogs.selectedDate, dailyLogs.input.entryText),
                entryTemporary = dailyLogs.newEntryFromApiEntry(entryFromString),
                extid = Date.now();
            // set external id, add entry directly to timeEntriesArray and recalculate duration
            entryTemporary.extId = extid;
            entryTemporary.isUpdating = true;
            dailyLogs.timeEntries.push(entryTemporary);
            dailyLogs.recalculateTotalDuration();
            dailyLogs.clearTimeEntry();
            dailyLogs.setAlert();
            // submit entry to server
            axios.post('api/timeentry/create', entryFromString).then(function (response) {
                var ixEntry = dailyLogs.timeEntries.findIndex((o => o.extId === extid)),
                    newEntry = dailyLogs.newEntryFromApiEntry(response.data);
                dailyLogs.timeEntries[ixEntry].id = newEntry.id;
                dailyLogs.timeEntries[ixEntry].isUpdating = false;
            }).catch(function (error) {
                if (error.response.status === 401 || error.response.status === 403) {
                    sessionStore.setter.isLoggedIn(false);
                    router.push('/');
                }
                else {
                    var ixEntry = dailyLogs.timeEntries.findIndex((o => o.extId === extid));
                    dailyLogs.timeEntries[ixEntry].isUpdating = false;
                    if (error.response.data
                        && error.response.data === "ERR_TIME_ENTRY_END_BEFORE_BEGIN") {
                        dailyLogs.setAlert('Entry cannot end before it begins. Please, check your time format');
                        dailyLogs.input.entryText = timeEntryFormatter.fromObjectToInputField(dailyLogs.timeEntries[ixEntry]);
                        dailyLogs.timeEntries.splice(ixEntry, 1);
                        dailyLogs.focusTimeLogInput();
                    }
                    else {
                        dailyLogs.setAlert('Oops. Something went wrong. Please, try again later.');
                    }
                }
            });
        },

        makeCopyForEntry: function (entryId) {
            let dailyLogs = this,
                ixEntry = dailyLogs.timeEntries.findIndex((o => o.id === entryId)),
                entry;
            dailyLogs.setAlert();
            if (ixEntry == -1) {
                return;
            }
            entry = dailyLogs.timeEntries[ixEntry];
            dailyLogs.input.entryText = timeEntryFormatter.fromObjectToInputField(entry);
            dailyLogs.focusTimeLogInput();
            return entry;
        },

        newEntryFromApiEntry: function (entry) {
            let newEntry = { id: entry.id, begin: '', end: '', description: entry.description, duration: 0, durationStr: '', isUpdating: false };
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
            dailyLogs.summaryEntries = dailyLogsSummary.create(dailyLogs.timeEntries);
            dailyLogs.summaryEntries.sort(function (a, b) {
                let valueA = a.duration,
                    valueB = b.duration;
                if (valueA < valueB)
                    return 1;
                if (valueA > valueB)
                    return -1;
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
                entry = dailyLogs.makeCopyForEntry(entryId);
            dailyLogs.selectedEntryId = entry.id;
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
                selectedId = dailyLogs.selectedEntryId,
                entryFromString = timeEntryFormatter.fromInputFieldToObject(dailyLogs.selectedDate, dailyLogs.input.entryText),
                ixEntry = dailyLogs.timeEntries.findIndex(o => o.id === selectedId);
            entryFromString.id = dailyLogs.selectedEntryId;
            // copy new object back into the stack
            dailyLogs.timeEntries[ixEntry] = dailyLogs.newEntryFromApiEntry(entryFromString);
            dailyLogs.timeEntries[ixEntry].isUpdating = true;
            dailyLogs.recalculateTotalDuration();
            dailyLogs.clearEntryFromEdit();
            dailyLogs.setAlert();
            // submit entry to server
            axios.post('api/timeentry/update', entryFromString).then(function (response) {
                var ixEntry = dailyLogs.timeEntries.findIndex((o => o.id === selectedId));
                dailyLogs.timeEntries[ixEntry].isUpdating = false;
            }).catch(function (error) {
                if (error.response.status === 401 || error.response.status === 403) {
                    sessionStore.setter.isLoggedIn(false);
                    router.push('/');
                }
                else {
                    var ixEntry = dailyLogs.timeEntries.findIndex((o => o.id === selectedId));
                    dailyLogs.timeEntries[ixEntry].isUpdating = false;
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
 *   UpgradeAccountComponent         *
 * * * * * * * * * * * * * * * * * * */
let templateUpgradeAccount =
    '<layout-default>' +
    '    <header class="main__title">' +
    '        <h1 class="main__title--title">Upgrade account</h1>' +
    '        <p class="main__title--sub">Current plan: <em class="main__title--info">{{account.type}} (expires {{getExpiresMessage}})</em></p>' +
    '    </header>' +
    '    <section class="main__content">' +
    '        <div class="alert alert--danger" v-if="showAlert">{{ alertMessage }}</div>' +
    '        <div class="plan--container">' +
    '             <div v-for="package in packages" v-bind:class="[\'plan\', \'plan--\' + package.code ]">' +
    '    	          <h2 class="plan--title">{{ package.title }}</h2>' +
    '    	          <p class="plan--sub">{{ getPlanExpires(package.expires) }}</p>' +
    '    	          <ul class="plan--info">' +
    '    	              <li v-for="item in package.info">{{ item }}</li>' +
    '    	          </ul>' +
    '    	          <h3 class="plan--price">{{package.currency}} {{package.price}}</h3>' +
    '                 <a v-if="package.mode == 0" v-bind:href="\'https://paypal.me/vkocjancic/\' + package.price" class="btn btn--block btn--secondary" target="_blank">Upgrade account</a>' +
    '                 <a v-if="package.mode == 1" v-bind:href="\'https://paypal.me/vkocjancic/\' + package.price" class="btn btn--block btn--secondary" target="_blank">Extend</a>' +
    '    	      </div>' +
    '             <ol class="plan--footnotes">' +
    '                 <li>All changes made to your accounts apply after current subscription expires.</li>' +
    '                 <li>Your subscription will default to Free account if no extension is made. No data will be lost, but will be made invisible, if out of bounds of current plan.</li>' +
    '             </ol>' +
    '        </div>' +
    '    </section>' +
    '</layout-default>';

export const UpgradeAccountComponent = {
    data() {
        return {
            account: sessionStore.getter.accountDetails(),
            packages: []
        }
    },
    computed: {
        getExpiresMessage: function () {
            var layout = this;
            return layout.account.expires ? new Date(layout.account.expires).toDateString() : 'never';
        }
    },
    created() {
        this.fetchData();
    },
    methods: {

        fetchData: function () {
            let upgrade = this,
                router = this.$router;
            upgrade.packages = [];
            axios.get('/api/account/getSubscriptionList').then(function (response) {
                upgrade.packages = response.data;
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

        getPlanExpires: function (expires) {
            return (expires == 0) ? 'Perpetual' : 'Expires in ' + expires + ' year';
        }

    },
    components: {
        'layout-default': LayoutDefaultComponent
    },
    template: templateUpgradeAccount
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
