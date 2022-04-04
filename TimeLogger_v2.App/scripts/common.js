
export const dateFormatter = {
    fromApiDateTime: function (dateToConvert) {
        var dateTime = new Date(dateToConvert);
        return dateTime.getHours().toString().padStart(2, '0') + ':' + dateTime.getMinutes().toString().padStart(2, '0');
    },

    fromIsoDate: function (dateToConvert) {
        return new Date(dateToCovert);
    },

    toIsoDate: function (dateToConvert) {
        return dateToConvert.getFullYear() + '-' + (dateToConvert.getMonth() + 1).toString().padStart(2, '0') + '-' + dateToConvert.getDate().toString().padStart(2, '0');
    }
}

export const durationCalculator = {
    calc: function (dateBegin, dateEnd) {
        var duration = 0;
        if (dateBegin && dateEnd) {
            duration = (new Date(dateEnd) - new Date(dateBegin)) / 1000 / 60;
        }
        return duration;
    }
}

export const durationFormatter = {
    fromDuration: function (duration) {
        var hours = Math.floor(duration / 60);
        var minutes = duration % 60;
        return hours + 'h ' + minutes + 'm';
    }
}

export const timeEntryFormatter = {   
    fromInputFieldToObject: function (date, inputText) {
        var matchTime = inputText.match(/(\@\d{1,2}\:{0,1}\d{2})(\-{0,1}\d{1,2}\:{0,1}\d{2}){0,1}/),
            matchTags = timeEntryFormatter.getTags(inputText),
            matchDescription = (inputText.replace(/(\@\S+)/g, '') || '').trim();
        if (!matchTime) {
            let dateNow = new Date();
            let timeNow = '@' + dateNow.getHours() + dateNow.getMinutes().toString().padStart(2, '0');
            matchTime = [
                timeNow,
                timeNow,
                undefined
            ];
        }
        return {
            begin: timeEntryFormatter.fromInputTypeToISODate(date, matchTime[1]),
            end: timeEntryFormatter.fromInputTypeToISODate(date, matchTime[2]),
            description: matchDescription,
            tags: matchTags
        };
    },

    fromInputTypeToISODate: function (date, timeToConvert) {
        if (!timeToConvert) {
            return '';
        }
        var time = timeToConvert.slice(1);
        if (time.indexOf(':') == -1) {
            time = time.padStart(4, '0');
            time = time.slice(0, 2) + ':' + time.slice(-2);
        }
        else {
            time = time.padStart(5, '0');
        }
        return date + ' ' + time;
    },

    fromObjectToInputField: function (entry) {
        var description = '';
        description += '@' + entry.begin;
        if (entry.end) {
            description += '-' + entry.end;
        }
        if (entry.description) {
            description += ' ' + entry.description;
        }
        return description.trim();
    },

    getTags: function (description) {
        return (description.match(/(\>|\#)\S+/g) || []).map(t => t.slice(1));
    }
}

export const dailyLogsSummary = {
    create: function (entries) {
        let summary = [],
            unique = dailyLogsSummary.getUniqueEntries(entries);
        for (var i = 0; i < unique.length; i++) {
            let entry = unique[i],
                tags = timeEntryFormatter.getTags(entry.description);
            if (tags.length == 0) {
                tags.push('General');
            }
            for (var j = 0; j < tags.length; j++) {
                let tag = tags[j],
                    ix = summary.findIndex(e => e.tag === tag);
                if (ix === -1) {
                    summary.push({
                        'tag': tag,
                        'duration': 0,
                        'entries': []
                    });
                    ix = summary.length - 1;
                }
                summary[ix].duration += entry.duration;
                summary[ix].entries.push(entry);
            }
        }
        return summary;
    },

    getUniqueEntries: function (entries) {
        let keys = [],
            unique = [];
        for (var i = 0; i < entries.length; i++) {
            let ix = keys[entries[i].description];
            if (ix) {
                unique[ix-1].duration += entries[i].duration;
            }
            else {
                unique.push({
                    description: entries[i].description,
                    duration: entries[i].duration
                });
                keys[entries[i].description] = unique.length;
            }
        }
        return unique;
    }
}

/* PROTOTYPE EXTENSIONS */
Date.prototype.addDays = function (days) {
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
}

export default { addDays: Date.prototype.addDays }