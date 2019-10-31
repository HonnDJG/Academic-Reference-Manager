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

        return dateMinusDuration;
    }
}