export const dateFormatter={fromApiDateTime:function(t){var r=new Date(t);return r.getHours().toString().padStart(2,"0")+":"+r.getMinutes().toString().padStart(2,"0")},fromIsoDate:function(t){return new Date(dateToCovert)},toIsoDate:function(t){return t.getFullYear()+"-"+(t.getMonth()+1).toString().padStart(2,"0")+"-"+t.getDate().toString().padStart(2,"0")}};export const durationCalculator={calc:function(t,r){var e=0;return t&&r&&(e=(new Date(r)-new Date(t))/1e3/60),e}};export const durationFormatter={fromDuration:function(t){return Math.floor(t/60)+"h "+t%60+"m"}};export const timeEntryFormatter={fromInputFieldToObject:function(t,r){var e=r.match(/(\@\d{1,2}\:{0,1}\d{2})(\-{0,1}\d{1,2}\:{0,1}\d{2}){0,1}/),n=(r.match(/\>\S+/g)||[]).map(t=>t.slice(1)),a=(r.match(/\#\S+/g)||[]).map(t=>t.slice(1)),o=(r.replace(/(\@\S+)/g,"")||"").trim();return{begin:timeEntryFormatter.fromInputTypeToISODate(t,e[1]),end:timeEntryFormatter.fromInputTypeToISODate(t,e[2]),description:o,tasks:n,channels:a}},fromInputTypeToISODate:function(t,r){if(!r)return"";var e=r.slice(1);return t+" "+(e=-1==e.indexOf(":")?(e=e.padStart(4,"0")).slice(0,2)+":"+e.slice(-2):e.padStart(5,"0"))}};