import{LayoutDefaultComponent}from"./layout.js";import{sessionStore}from"./clientstore.js";import{DateNavigatorComponent,DropDownSelectorComponent}from"./shared.js";import{dateFormatter,durationCalculator,durationFormatter,timeEntryFormatter}from"./common.js";let templateHome='<layout-default>    <header class="main__title">        <h1 class="main__title--title">Daily logs</h1>        <p class="main__title--sub">Logged today: <em class="main__title--info">{{totalDuration}}</em></p>    </header>    <drop-down label="View as" :options="[{text:\'Input\', value:\'I\'}, {text:\'Summary\', value:\'S\'}]" v-on:change="handleViewChange"></drop-down>    <date-navigator v-on:date-change="handleDateChange"></date-navigator>    <section class="main__content">        <div class="alert alert--danger" v-if="showAlert">{{ alertMessage }}</div>        <table class="table" v-if="viewMode == 0">            <thead>                <tr>                    <th class="table__col table__col--time">Begin</th>                    <th class="table__col table__col--time">End</th>                    <th class="table__col">Description</th>                    <th class="table__col table__col--actions">Actions</th>                </tr>            </thead>            <tbody v-if="timeEntries.length > 0">                <tr v-for="timeEntry in timeEntries" v-bind:class="{ \'table__row--edit\': selectedEntryId === timeEntry.id }" >                    <td class="table__col">{{timeEntry.begin}}</td>                    <td class="table__col">{{timeEntry.end}}</td>                    <td class="table__col">{{timeEntry.description}}</td>                    <td class="table__col table__col--actions">                        <a href="#" class="btn btn--sm btn--secondary" title="Cancel" v-if="selectedEntryId === timeEntry.id" v-on:click.prevent="clearEntryFromEdit()"><i class="icon action__cancel"></i></a>                        <a href="#" class="btn btn--sm" title="Edit" v-else v-on:click.prevent="setEntryToEdit(timeEntry.id)"><i class="icon action__edit"></i></a>                    </td>                </tr>            </tbody>            <tbody v-else>                <tr class="table__row--empty"><td colspan="4" class="table__col">It is rather lonely in here :( ...</td></tr>            </tbody>            <tfoot>                <tr>                    <td colspan="4">                        <form class="timelog__form" name="edit" novalidate="novalidate" v-on:submit.prevent="submitTimeEntry">                            <fieldset>                                <input id="inTimeLog" ref="inTimeLog" class="ctrl" type="text" name="tbEntry" placeholder="@08:00-12:00 Worked on non important stuff for #Task #Project" autocomplete="off"                                   v-model="input.entryText" />                             </fieldset>                            <div class="timelog__form--actions">                                <button class="btn btn--sm btn--primary" type="submit">Save</button>                                <button class="btn btn--sm btn--secondary" v-if="!selectedEntryId" v-on:click.prevent="clearTimeEntry">Clear</button>                                <button class="btn btn--sm btn--alert" v-if="selectedEntryId" v-on:click.prevent="deleteTimeEntry">Delete</button>                            </div>                        </form>                    </td>                </tr>            </tfoot>        </table>        <table class="table" v-else>            <thead>                <tr>                    <th class="table__col">Description</th>                    <th class="table__col table__col--duration">Duration</th>                </tr>            </thead>            <tbody v-if="summaryEntries.length > 0">                <tr v-for="summaryEntry in summaryEntries">                    <td class="table__col">{{summaryEntry.title}}</td>                    <td class="table__col table__col--duration">{{summaryEntry.durationString}}</td>                </tr>            </tbody>            <tbody v-else>                <tr class="table__row--empty"><td colspan="2" class="table__col">It is rather lonely in here :( ...</td></tr>            </tbody>        </table>    </section></layout-default>';export const HomeComponent={data:()=>({alertMessage:"",input:{entryText:""},selectedDate:dateFormatter.toIsoDate(new Date),selectedEntryId:null,showAlert:!1,timeEntries:[],summaryEntries:[],totalDuration:"0m",viewMode:0}),created(){this.fetchData()},methods:{clearEntryFromEdit:function(t){this.selectedEntryId=null,this.clearTimeEntry(t),this.setAlert()},clearTimeEntry:function(t){this.input.entryText=""},deleteTimeEntry:function(t){let e=this,n=e.timeEntries.findIndex(t=>t.id===e.selectedEntryId),a=e.selectedEntryId;e.timeEntries.splice(n,1),e.recalculateTotalDuration(),e.clearEntryFromEdit(),e.setAlert(),axios.post("api/timeentry/delete",{Id:a}).then(function(t){}).catch(function(t){401===t.response.status||403===t.response.status?(sessionStore.setter.isLoggedIn(!1),router.push("/")):e.setAlert("Oops. Something went wrong. Please, try again later")})},fetchData:function(){let t=this,e=this.$router;t.timeEntries=[],t.setAlert(),t.focusTimeLogInput(),axios.get("/api/timeentry/list",{params:{selectedDate:t.selectedDate}}).then(function(e){e.data.forEach(e=>{var n=t.newEntryFromApiEntry(e);t.timeEntries.push(n)}),t.recalculateTotalDuration()}).catch(function(n){401===n.response.status||403===n.response.status?(sessionStore.setter.isLoggedIn(!1),e.push("/")):t.setAlert("Oops. Something went wrong. Please, try again later")})},focusTimeLogInput:function(){var t=this;t.$nextTick(()=>{t.$refs.inTimeLog.focus()})},handleDateChange:function(t){this.selectedDate=t,this.fetchData()},handleViewChange:function(t){let e=this;"S"===t.target.selectedOptions[0].value?(e.prepareSummaryView(),e.viewMode=1):e.viewMode=0},insertTimeEntry:function(){let t=this,e=timeEntryFormatter.fromInputFieldToObject(t.selectedDate,t.input.entryText),n=t.newEntryFromApiEntry(e),a=Date.now();n.extId=a,t.timeEntries.push(n),t.recalculateTotalDuration(),t.clearTimeEntry(),t.setAlert(),axios.post("api/timeentry/create",e).then(function(e){var n=t.timeEntries.findIndex(t=>t.extId===a),r=t.newEntryFromApiEntry(e.data);t.timeEntries[n].id=r.id}).catch(function(e){401===e.response.status||403===e.response.status?(sessionStore.setter.isLoggedIn(!1),router.push("/")):t.setAlert("Oops. Something went wrong. Please, try again later")})},newEntryFromApiEntry:function(t){let e={id:t.id,begin:"",end:"",description:t.description,duration:0,durationStr:""};return t.begin&&(e.begin=dateFormatter.fromApiDateTime(t.begin)),t.end&&(e.end=dateFormatter.fromApiDateTime(t.end)),e.duration=durationCalculator.calc(t.begin,t.end),e.durationStr=durationFormatter.fromDuration(e.duration),e},prepareSummaryView:function(){let t=this;t.summaryEntries=[];for(var e=0;e<t.timeEntries.length;e++){let a=t.timeEntries[e],r=timeEntryFormatter.getTags(a.description);for(var n=0;n<r.length;n++){let e="#"+r[n],i=t.summaryEntries.findIndex(t=>t.title==e);-1===i?t.summaryEntries.push({title:e,duration:a.duration,durationString:durationFormatter.fromDuration(a.duration)}):(t.summaryEntries[i].duration+=a.duration,t.summaryEntries[i].durationString=durationFormatter.fromDuration(t.summaryEntries[i].duration))}}t.summaryEntries.sort(function(t,e){let n=t.title,a=e.title;return n<a?-1:n>a?1:0})},recalculateTotalDuration:function(){let t=0;this.timeEntries.forEach(e=>{t+=e.duration}),this.totalDuration=durationFormatter.fromDuration(t)},setAlert:function(t){this.showAlert=!!t,this.alertMessage=t},setEntryToEdit:function(t){let e,n=this.timeEntries.findIndex(e=>e.id===t);this.setAlert(),-1!=n&&(e=this.timeEntries[n],this.selectedEntryId=e.id,this.input.entryText=timeEntryFormatter.fromObjectToInputField(e),this.focusTimeLogInput())},submitTimeEntry:function(t){let e=this;e.selectedEntryId?e.updateTimeEntry():e.insertTimeEntry()},updateTimeEntry:function(){let t=this,e=timeEntryFormatter.fromInputFieldToObject(t.selectedDate,t.input.entryText),n=t.timeEntries.findIndex(e=>e.id===t.selectedEntryId);e.id=t.selectedEntryId,t.timeEntries[n]=t.newEntryFromApiEntry(e),t.recalculateTotalDuration(),t.clearEntryFromEdit(),t.setAlert(),axios.post("api/timeentry/update",e).then(function(t){}).catch(function(e){401===e.response.status||403===e.response.status?(sessionStore.setter.isLoggedIn(!1),router.push("/")):t.setAlert("Oops. Something went wrong. Please, try again later")})}},components:{"layout-default":LayoutDefaultComponent,"date-navigator":DateNavigatorComponent,"drop-down":DropDownSelectorComponent},template:templateHome};let templateInsights='<layout-default>    <header class="main__title">        <h1 class="main__title--title">Insights</h1>    </header></layout-default>';export const InsightsComponent={components:{"layout-default":LayoutDefaultComponent},template:templateInsights};let templateTasks='<layout-default>    <header class="main__title">        <h1 class="main__title--title">Task list</h1>    </header></layout-default>';export const TasksComponent={components:{"layout-default":LayoutDefaultComponent},template:templateTasks};let templateNotYetImplemented='<layout-default>    <header class="main__title">        <h1 class="main__title--title">Under construction</h1>    </header>    <section class="main__content content__nyi">        <p>This page does not exist yet. Check back soon.</p>    </section></layout-default>';export const NotYetImplementedComponent={components:{"layout-default":LayoutDefaultComponent},template:templateNotYetImplemented};