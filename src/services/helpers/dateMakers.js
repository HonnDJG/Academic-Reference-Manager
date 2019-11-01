module.exports = {
    addDuration: function (date, duration) {
        let _duration;
        if ((typeof duration) == 'string') {
            _duration = parseInt(duration);
        } else {
            _duration = duration;
        }

        const datePlusDuration = new Date(date);
        datePlusDuration.setDate(datePlusDuration.getDate() + _duration);
        datePlusDuration.setHours(0, 0, 0, 0);


        return datePlusDuration;
    },
    subtractDuration: function (date, duration) {
        let _duration;
        if ((typeof duration) == 'string') {
            _duration = parseInt(duration);
        } else {
            _duration = duration;
        }

        const dateMinusDuration = new Date(date);
        dateMinusDuration.setDate(dateMinusDuration.getDate() - _duration);
        dateMinusDuration.setHours(0, 0, 0, 0);

        return dateMinusDuration;
    },
}