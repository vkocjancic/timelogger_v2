export const durationCalculator = {
    calc: function (dateBegin, dateEnd) {
        var duration = 0;
        if (dateBegin && dateEnd) {
            duration = (new Date(dateEnd) - new Date(dateBegin)) / 1000 / 60;
        }
        return duration;
    }
}

export const timeEntryFormatter = {
    fromApiDateTime: function (dateToConvert) {
        var dateTime = new Date(dateToConvert);
        return dateTime.getHours().toString().padStart(2, '0') + ':' + dateTime.getMinutes().toString().padStart(2, '0');
    },
    fromDuration: function (duration) {
        let hours = Math.floor(duration / 60);
        let minutes = duration % 60;
        return hours + 'h ' + minutes + 'm';
    }
};