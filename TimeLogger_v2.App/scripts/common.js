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