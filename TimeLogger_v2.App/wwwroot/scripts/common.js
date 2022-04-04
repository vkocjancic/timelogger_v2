export const dateFormatter={fromApiDateTime:function(t){var e=new Date(t);return e.getHours().toString().padStart(2,"0")+":"+e.getMinutes().toString().padStart(2,"0")},fromIsoDate:function(t){return new Date(dateToCovert)},toIsoDate:function(t){return t.getFullYear()+"-"+(t.getMonth()+1).toString().padStart(2,"0")+"-"+t.getDate().toString().padStart(2,"0")}};export const durationCalculator={calc:function(t,e){var r=0;return t&&e&&(r=(new Date(e)-new Date(t))/1e3/60),r}};export const durationFormatter={fromDuration:function(t){return Math.floor(t/60)+"h "+t%60+"m"}};export const timeEntryFormatter={fromInputFieldToObject:function(t,e){var r=e.match(/(\@\d{1,2}\:{0,1}\d{2})(\-{0,1}\d{1,2}\:{0,1}\d{2}){0,1}/),n=timeEntryFormatter.getTags(e),a=(e.replace(/(\@\S+)/g,"")||"").trim();if(!r){let t=new Date,e="@"+t.getHours()+t.getMinutes().toString().padStart(2,"0");r=[e,e,void 0]}return{begin:timeEntryFormatter.fromInputTypeToISODate(t,r[1]),end:timeEntryFormatter.fromInputTypeToISODate(t,r[2]),description:a,tags:n}},fromInputTypeToISODate:function(t,e){if(!e)return"";var r=e.slice(1);return t+" "+(r=-1==r.indexOf(":")?(r=r.padStart(4,"0")).slice(0,2)+":"+r.slice(-2):r.padStart(5,"0"))},fromObjectToInputField:function(t){var e="";return e+="@"+t.begin,t.end&&(e+="-"+t.end),t.description&&(e+=" "+t.description),e.trim()},getTags:function(t){return(t.match(/(\>|\#)\S+/g)||[]).map(t=>t.slice(1))}};export const dailyLogsSummary={create:function(t){let e=[],r=dailyLogsSummary.getUniqueEntries(t);for(var n=0;n<r.length;n++){let t=r[n],o=timeEntryFormatter.getTags(t.description);0==o.length&&o.push("General");for(var a=0;a<o.length;a++){let r=o[a],n=e.findIndex(t=>t.tag===r);-1===n&&(e.push({tag:r,duration:0,entries:[]}),n=e.length-1),e[n].duration+=t.duration,e[n].entries.push(t)}}return e},getUniqueEntries:function(t){let e=[],r=[];for(var n=0;n<t.length;n++){let a=e[t[n].description];a?r[a-1].duration+=t[n].duration:(r.push({description:t[n].description,duration:t[n].duration}),e[t[n].description]=r.length)}return r}};Date.prototype.addDays=function(t){var e=new Date(this.valueOf());return e.setDate(e.getDate()+t),e};export default{addDays:Date.prototype.addDays};