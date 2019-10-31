module.exports = {
    addDuration: (date, duration) => {
        let _duration;
        if ((typeof duration) == 'string') {
            _duration = parseInt(duration);
        } else {
            _duration = duration;
        }

        const datePlusDuration = new Date(date);
        datePlusDuration.setDate(datePlusDuration.getDate() + _duration);
        datePlusDuration.setHours(0);
        datePlusDuration.setMinutes(0);
        datePlusDuration.setSeconds(0);
        datePlusDuration.setMilliseconds(0);

        return datePlusDuration;
    },
    subtractDuration: (date, duration) => {
        let _duration;
        if ((typeof duration) == 'string') {
            _duration = parseInt(duration);
        } else {
            _duration = duration;
        }

        const dateMinusDuration = new Date(date);
        dateMinusDuration.setDate(dateMinusDuration.getDate() - _duration);
        dateMinusDuration.setHours(0);
        dateMinusDuration.setMinutes(0);
        dateMinusDuration.setSeconds(0);
        dateMinusDuration.setMilliseconds(0);

        return dateMinusDuration;
    }
}