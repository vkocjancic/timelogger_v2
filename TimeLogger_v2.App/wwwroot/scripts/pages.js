import{LayoutDefaultComponent}from"./layout.js";import{sessionStore}from"./clientstore.js";import{DateNavigatorComponent}from"./shared.js";import{dateFormatter,durationCalculator,durationFormatter,timeEntryFormatter}from"./common.js";let templateHome='<layout-default>    <header class="main__title">        <h1 class="main__title--title">Daily logs</h1>        <p class="main__title--sub">Logged today: <em class="main__title--info">{{totalDuration}}</em></p>    </header>    <date-navigator v-on:date-change="handleDateChange"></date-navigator>    <section class="main__content">        <div class="alert alert--danger" v-if="showAlert">{{ alertMessage }}</div>        <table class="table">            <thead>                <tr>                    <th class="table__col table__col--time">Begin</th>                    <th class="table__col table__col--time">End</th>                    <th class="table__col">Description</th>                    <th class="table__col table__col--actions">Actions</th>                </tr>            </thead>            <tbody v-if="timeEntries.length > 0">                <tr v-for="timeEntry in timeEntries" v-bind:class="{ \'table__row--edit\': timeEntry.isEdited }" >                    <td class="table__col">{{timeEntry.begin}}</td>                    <td class="table__col">{{timeEntry.end}}</td>                    <td class="table__col">{{timeEntry.description}}</td>                    <td class="table__col table__col--actions">                        <a href="#" class="btn btn--sm btn--secondary" v-if="selectedEntryId === timeEntry.id">Cancel</a>                        <a href="#" class="btn btn--sm" v-else v-on:click.prevent="setEntryToEdit(timeEntry.id)">Edit</a>                    </td>                </tr>            </tbody>            <tbody v-else>                <tr class="table__row--empty"><td colspan="4" class="table__col">It is rather lonely in here :( ...</td></tr>            </tbody>            <tfoot>                <tr>                    <td colspan="4">                        <form class="timelog__form" name="edit" novalidate="novalidate" v-on:submit.prevent="submitTimeEntry">                            <fieldset>                                <input id="inTimeLog" class="ctrl" type="text" name="tbEntry" placeholder="@08:00-12:00 Worked on non important stuff for >Task #Channel" autocomplete="off" v-model="input.entryText" />                             </fieldset>                            <div class="timelog__form--actions">                                <button class="btn btn--sm btn--primary" type="submit">Save</button>                                <button class="btn btn--sm btn--secondary" v-if="!selectedEntryId" v-on:click.prevent="clearTimeEntry">Clear</button>                                <button class="btn btn--sm btn--secondary" v-if="selectedEntryId">Delete</button>                            </div>                        </form>                    </td>                </tr>            </tfoot>        </table>    </section></layout-default>';export const HomeComponent={data:()=>({alertMessage:"",input:{entryText:""},selectedDate:dateFormatter.toIsoDate(new Date),selectedEntryId:null,showAlert:!1,timeEntries:[],totalDuration:"0m"}),created(){this.fetchData()},methods:{clearTimeEntry:function(t){this.input.entryText=""},fetchData:function(){var t=this,e=this.$router;axios.get("/api/timeentry/list",{params:{selectedDate:t.selectedDate}}).then(function(e){e.data.forEach(e=>{var a=t.newEntryFromApiEntry(e);t.timeEntries.push(a)}),t.recalculateTotalDuration()}).catch(function(a){401===a.response.status||403===a.response.status?(sessionStore.setter.isLoggedIn(!1),e.push("/")):(t.alertMessage="Oops.Something went wrong.Please, try again later",t.showAlert=!0)})},handleDateChange:function(t){this.selectedDate=t,this.fetchData()},newEntryFromApiEntry:function(t){var e={id:t.id,begin:"",end:"",description:t.description,duration:0,durationStr:""};return t.begin&&(e.begin=dateFormatter.fromApiDateTime(t.begin)),t.end&&(e.end=dateFormatter.fromApiDateTime(t.end)),e.duration=durationCalculator.calc(t.begin,t.end),e.durationStr=durationFormatter.fromDuration(e.duration),e},recalculateTotalDuration:function(){var t=0;this.timeEntries.forEach(e=>{t+=e.duration}),this.totalDuration=durationFormatter.fromDuration(t)},setEntryToEdit:function(t){this.selectedEntryId=t},submitTimeEntry:function(t){var e=this,a=timeEntryFormatter.fromInputFieldToObject(e.selectedDate,e.input.entryText),n=e.newEntryFromApiEntry(a),o=Date.now();n.extId=o,e.timeEntries.push(n),e.recalculateTotalDuration(),e.input.entryText="",axios.post("api/timeentry/create",a).then(function(t){var a=e.timeEntries.findIndex(t=>t.extId===o),n=e.newEntryFromApiEntry(t.data);e.timeEntries[a].id=n.id,console.log(e.timeEntries[a])}).catch(function(t){401===t.response.status||403===t.response.status?(sessionStore.setter.isLoggedIn(!1),router.push("/")):(e.alertMessage="Oops.Something went wrong.Please, try again later",e.showAlert=!0)})}},components:{"layout-default":LayoutDefaultComponent,"date-navigator":DateNavigatorComponent},template:templateHome};let templateInsights='<layout-default>    <header class="main__title">        <h1 class="main__title--title">Insights</h1>    </header></layout-default>';export const InsightsComponent={components:{"layout-default":LayoutDefaultComponent},template:templateInsights};let templateTasks='<layout-default>    <header class="main__title">        <h1 class="main__title--title">Task list</h1>    </header></layout-default>';export const TasksComponent={components:{"layout-default":LayoutDefaultComponent},template:templateTasks};let templateNotYetImplemented='<layout-default>    <header class="main__title">        <h1 class="main__title--title">Under construction</h1>    </header>    <section class="main__content content__nyi">        <p>This page does not exist yet. Check back soon.</p>    </section></layout-default>';export const NotYetImplementedComponent={components:{"layout-default":LayoutDefaultComponent},template:templateNotYetImplemented};