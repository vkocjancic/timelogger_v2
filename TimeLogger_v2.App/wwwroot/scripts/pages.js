import{LayoutDefaultComponent}from"./layout.js";import{sessionStore}from"./clientstore.js";import{AlertComponent,DateNavigatorComponent,DropDownSelectorComponent,RangeNavigatorComponent,TableComponent}from"./shared.js";import{dailyLogsSummary,dateFormatter,durationCalculator,durationFormatter,timeEntryFormatter}from"./common.js";const ViewMode={INPUT:0,SUMMARY:1};let templateHome='<layout-default>    <header class="main__title">        <h1 class="main__title--title">Daily logs</h1>        <p class="main__title--sub">Logged today: <em class="main__title--info">{{totalDuration}}</em></p>    </header>    <drop-down label="View as" :options="[{text:\'Input\', value:\'I\'}, {text:\'Summary\', value:\'S\'}]" v-on:change="handleViewChange"></drop-down>    <date-navigator v-on:date-change="handleDateChange"></date-navigator>    <section class="main__content">        <alert :message="alertMessage" />        <table-dynamic v-bind="tableDataInput" v-if="viewMode == 0" v-on:action-clicked="tableInputActionClicked" />        <form class="timelog__form" name="edit" novalidate="novalidate" v-if="viewMode == 0" v-on:submit.prevent="submitTimeEntry">            <fieldset>                <input id="inTimeLog" ref="inTimeLog" class="ctrl" type="text" name="tbEntry" placeholder="@08:00-12:00 Worked on non important stuff for #Task #Project" autocomplete="off"                   v-model="input.entryText" />             </fieldset>            <div class="timelog__form--actions">                <button class="btn btn--sm btn--primary" type="submit">Save</button>                <button class="btn btn--sm btn--secondary" v-if="!selectedEntryId" v-on:click.prevent="clearTimeEntry">Clear</button>                <button class="btn btn--sm btn--alert" v-if="selectedEntryId" v-on:click.prevent="deleteTimeEntry">Delete</button>            </div>        </form>        <table-dynamic v-bind="tableDataSummary" v-else />    </section></layout-default>';export const HomeComponent={data:()=>({actionsAll:["Copy","Edit","Cancel"],alertMessage:"",input:{entryText:""},selectedDate:dateFormatter.toIsoDate(new Date),selectedEntryId:null,timeEntries:[],tableDataInput:{idCol:"id",rowActions:[{name:"Copy"},{name:"Edit"},{name:"Cancel",style:"secondary"}],columns:[{name:"Begin",bindTo:"begin",type:"TIME"},{name:"End",bindTo:"end",type:"TIME"},{name:"Description",bindTo:"description",type:"NORMAL"}],sortCol:"begin",sortDirection:"asc",values:[]},tableDataSummary:{displayDetails:!0,columns:[{name:"Description",bindTo:"tag",type:"NORMAL",detailsBindTo:"description"},{name:"Duration",bindTo:"duration",type:"DURATION",transform:durationFormatter.fromDuration}],values:[]},totalDuration:"0m",viewMode:ViewMode.INPUT}),created(){this.fetchData()},methods:{clearEntryFromEdit:function(t){this.setSelectedEntry(null,!1),this.clearTimeEntry(t),this.alertMessage=null},clearTimeEntry:function(t){this.input.entryText="",this.focusTimeLogInput()},deleteTimeEntry:function(t){let e=this,a=e.timeEntries.findIndex(t=>t.id===e.selectedEntryId),n=e.selectedEntryId;e.clearEntryFromEdit(),e.timeEntries.splice(a,1),e.tableDataInput.values=e.timeEntries,e.recalculateTotalDuration(),e.alertMessage=null,axios.post("api/timeentry/delete",{Id:n}).then(function(t){}).catch(e.handleError)},fetchData:function(){let t=this;t.timeEntries=[],t.alertMessage=null,axios.get("/api/timeentry/list",{params:{selectedDate:t.selectedDate}}).then(function(e){e.data.forEach(e=>{var a=t.newEntryFromApiEntry(e);t.timeEntries.push(a)}),t.recalculateTotalDuration(),t.viewMode===ViewMode.SUMMARY?t.prepareSummaryView():(t.tableDataInput.values=t.timeEntries,t.tableDataInput.values.forEach(t=>{t.actions=["Copy","Edit"]}))}).catch(t.handleError)},focusTimeLogInput:function(){var t=this;t.viewMode===ViewMode.INPUT&&t.$nextTick(()=>{t.$refs.inTimeLog.focus()})},formatDuration:function(t){return durationFormatter.fromDuration(t)},handleDateChange:function(t){this.selectedDate=t,this.fetchData()},handleError:function(t){let e=this,a=this.$router;401===t.response.status||403===t.response.status?(sessionStore.setter.isLoggedIn(!1),a.push("/")):e.alertMessage="Oops. Something went wrong. Please, try again later"},handleViewChange:function(t){let e=this;"S"===t.target.selectedOptions[0].value?(e.prepareSummaryView(),e.viewMode=ViewMode.SUMMARY):(e.viewMode=ViewMode.INPUT,e.fetchData(),e.focusTimeLogInput())},insertTimeEntry:function(){let t=this,e=timeEntryFormatter.fromInputFieldToObject(t.selectedDate,t.input.entryText),a=t.newEntryFromApiEntry(e),n=Date.now();a.extId=n,t.timeEntries.push(a),t.tableDataInput.values=t.timeEntries,t.setUpdatingEntry(t.timeEntries.length-1,!0),t.recalculateTotalDuration(),t.clearTimeEntry(),t.alertMessage=null,axios.post("api/timeentry/create",e).then(function(e){var a=t.timeEntries.findIndex(t=>t.extId===n),i=t.newEntryFromApiEntry(e.data);t.timeEntries[a].id=i.id,t.setUpdatingEntry(a,!1)}).catch(function(e){if(401===e.response.status||403===e.response.status)sessionStore.setter.isLoggedIn(!1),router.push("/");else{var a=t.timeEntries.findIndex(t=>t.extId===n);t.setUpdatingEntry(a,!1),e.response.data&&"ERR_TIME_ENTRY_END_BEFORE_BEGIN"===e.response.data?(t.alertMessage="Entry cannot end before it begins. Please, check your time format",t.input.entryText=timeEntryFormatter.fromObjectToInputField(t.timeEntries[a]),t.timeEntries.splice(a,1),t.tableDataInput.values=t.timeEntries,t.focusTimeLogInput()):t.alertMessage="Oops. Something went wrong. Please, try again later."}})},makeCopyForEntry:function(t){let e,a=this.timeEntries.findIndex(e=>e.id===t);if(this.alertMessage=null,-1!=a)return e=this.timeEntries[a],this.input.entryText=timeEntryFormatter.fromObjectToInputField(e),this.focusTimeLogInput(),e},newEntryFromApiEntry:function(t){let e={id:t.id,begin:"",end:"",description:t.description,duration:0,durationStr:"",isUpdating:!1,actions:this.actionsAll};return t.begin&&(e.begin=dateFormatter.fromApiDateTime(t.begin)),t.end&&(e.end=dateFormatter.fromApiDateTime(t.end)),e.duration=durationCalculator.calc(t.begin,t.end),e.durationStr=durationFormatter.fromDuration(e.duration),e},prepareSummaryView:function(){this.tableDataSummary.values=dailyLogsSummary.create(this.timeEntries),this.tableDataSummary.values.sort(function(t,e){let a=t.duration,n=e.duration;return a<n?1:a>n?-1:0})},recalculateTotalDuration:function(){let t=0;this.timeEntries.forEach(e=>{t+=e.duration}),this.totalDuration=durationFormatter.fromDuration(t)},setEntryToEdit:function(t){let e=this.makeCopyForEntry(t);this.setSelectedEntry(e.id,!0)},setSelectedEntry:function(t,e){let a=this,n=a.tableDataInput.values.findIndex(e=>e.id==(t||a.selectedEntryId));a.selectedEntryId=t,a.tableDataInput.values[n].isUpdating||(a.tableDataInput.values[n].actions=e?a.actionsAll.filter(function(t){return"Edit"!==t}):a.actionsAll.filter(function(t){return"Cancel"!==t}))},setUpdatingEntry:function(t,e){let a=this;a.tableDataInput.values[t].isUpdating=e,a.tableDataInput.values[t].actions=e?[]:a.actionsAll.filter(function(t){return"Cancel"!==t})},submitTimeEntry:function(t){let e=this;e.selectedEntryId?e.updateTimeEntry():e.insertTimeEntry()},tableInputActionClicked:function(t,e){let a=this;"Cancel"===t?a.clearEntryFromEdit():"Copy"===t?a.makeCopyForEntry(e):"Edit"===t&&a.setEntryToEdit(e)},updateTimeEntry:function(){let t=this,e=t.selectedEntryId,a=timeEntryFormatter.fromInputFieldToObject(t.selectedDate,t.input.entryText),n=t.timeEntries.findIndex(t=>t.id===e);a.id=t.selectedEntryId,t.timeEntries[n]=t.newEntryFromApiEntry(a),t.tableDataInput.values=t.timeEntries,t.setUpdatingEntry(n,!0),t.recalculateTotalDuration(),t.clearEntryFromEdit(),t.alertMessage=null,axios.post("api/timeentry/update",a).then(function(a){n=t.timeEntries.findIndex(t=>t.id===e),t.setUpdatingEntry(n,!1)}).catch(function(a){401===a.response.status||403===a.response.status?(sessionStore.setter.isLoggedIn(!1),router.push("/")):(n=t.timeEntries.findIndex(t=>t.id===e),t.setUpdatingEntry(n,!1),t.alertMessage="Oops. Something went wrong. Please, try again later")})}},components:{"layout-default":LayoutDefaultComponent,alert:AlertComponent,"date-navigator":DateNavigatorComponent,"drop-down":DropDownSelectorComponent,"table-dynamic":TableComponent},template:templateHome};let templateInsights='<layout-default>    <header class="main__title">        <h1 class="main__title--title">Insights</h1>    </header>    <range-navigator v-on:range-change="handleRangeChange"></range-navigator>    <section class="main__content">      <alert :message="alertMessage" />      <div class="insights__graph">    \t <canvas id="insightsGraph" ref="insightsGraph" class="insights__graph--canvas"></canvas>      </div>      <table-dynamic v-bind="tableData" />    </section></layout-default>';export const InsightsComponent={data:()=>({alertMessage:"",chart:null,chartData:{datasets:[{label:"",data:[]},{label:"",data:[]},{label:"",data:[]}],labels:[""]},selectedStartDate:dateFormatter.toIsoDate((new Date).addDays(-7)),selectedEndDate:dateFormatter.toIsoDate(new Date),tableData:{columns:[{name:"Tag",bindTo:"tag",type:"NORMAL"},{name:"Duration",bindTo:"duration",type:"DURATION",transform:durationFormatter.fromDuration}],values:[]}}),created(){this.fetchData()},methods:{fetchData:function(){let t=this,e=this.$router;t.chartData=null,t.tableData.values=[],axios.get("/api/insights/list",{params:{startDate:t.selectedStartDate,endDate:t.selectedEndDate}}).then(function(e){t.chartData=e.data.chartData,t.tableData.values=e.data.reportData,t.drawChart()}).catch(function(a){console.log(a),401===a.response.status||403===a.response.status?(sessionStore.setter.isLoggedIn(!1),e.push("/")):t.alertMessage="Oops. Something went wrong. Please, try again later"})},formatDuration:function(t){return durationFormatter.fromDuration(t)},handleRangeChange:function(t,e){this.selectedStartDate=t,this.selectedEndDate=e,this.fetchData()},drawChart:function(){let t=this,e=t.$refs.insightsGraph.getContext("2d"),a=t.chartData;t.chart&&t.chart.destroy(),t.chart=new Chart(e,{type:"bar",data:{datasets:[{label:a.datasets[0].label,data:a.datasets[0].data,backgroundColor:"rgba(126, 185, 20, 0.3)",borderColor:"rgba(126, 185, 20, 0.7)",borderWidth:2},{type:"line",label:a.datasets[1].label,data:a.datasets[1].data,backgroundColor:"rgba(199, 31, 22, .3)",borderColor:"rgba(199, 31, 22, 1)"},{type:"line",label:a.datasets[2].label,data:a.datasets[2].data,backgroundColor:"rgba(8, 21, 40, .3)",borderColor:"rgba(8, 21, 40, 1)"}],labels:a.labels},options:{animation:!1,responsive:!0,scales:{yAxis:{ticks:{beginAtZero:!0}}}}})}},components:{"layout-default":LayoutDefaultComponent,alert:AlertComponent,"range-navigator":RangeNavigatorComponent,"table-dynamic":TableComponent},template:templateInsights};let templateUpgradeAccount='<layout-default>    <header class="main__title">        <h1 class="main__title--title">Upgrade account</h1>        <p class="main__title--sub">Current plan: <em class="main__title--info">{{account.type}} (expires {{getExpiresMessage}})</em></p>    </header>    <section class="main__content">        <alert :message="alertMessage" />        <div class="plan--container">             <div v-for="package in packages" v-bind:class="[\'plan\', \'plan--\' + package.code ]">    \t          <h2 class="plan--title">{{ package.title }}</h2>    \t          <p class="plan--sub">{{ getPlanExpires(package.expires) }}</p>    \t          <ul class="plan--info">    \t              <li v-for="item in package.info">{{ item }}</li>    \t          </ul>    \t          <h3 class="plan--price">{{package.currency}} {{package.price}}</h3>                 <a v-if="package.mode == 0" v-bind:href="\'https://paypal.me/vkocjancic/\' + package.price" class="btn btn--block btn--secondary" target="_blank">Upgrade account</a>                 <a v-if="package.mode == 1" v-bind:href="\'https://paypal.me/vkocjancic/\' + package.price" class="btn btn--block btn--secondary" target="_blank">Extend</a>    \t      </div>             <ol class="plan--footnotes">                 <li>All changes made to your accounts apply after current subscription expires.</li>                 <li>Your subscription will default to Free account if no extension is made. No data will be lost, but will be made invisible, if out of bounds of current plan.</li>             </ol>        </div>    </section></layout-default>';export const UpgradeAccountComponent={data:()=>({account:sessionStore.getter.accountDetails(),packages:[]}),computed:{getExpiresMessage:function(){return this.account.expires?new Date(this.account.expires).toDateString():"never"}},created(){this.fetchData()},methods:{fetchData:function(){let t=this,e=this.$router;t.packages=[],axios.get("/api/account/getSubscriptionList").then(function(e){t.packages=e.data}).catch(function(a){401===a.response.status||403===a.response.status?(sessionStore.setter.isLoggedIn(!1),e.push("/")):t.alertMessage="Oops. Something went wrong. Please, try again later"})},getPlanExpires:function(t){return 0==t?"Perpetual":"Expires in "+t+" year"}},components:{"layout-default":LayoutDefaultComponent,alert:AlertComponent},template:templateUpgradeAccount};let templateNotYetImplemented='<layout-default>    <header class="main__title">        <h1 class="main__title--title">Under construction</h1>    </header>    <section class="main__content content__nyi">        <p>This page does not exist yet. Check back soon.</p>    </section></layout-default>';export const NotYetImplementedComponent={components:{"layout-default":LayoutDefaultComponent},template:templateNotYetImplemented};