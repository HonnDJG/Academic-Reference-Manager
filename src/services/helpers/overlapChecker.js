module.exports = {
    checkOverlap: function (startA, endA, startB, endB) {
        //return ((startA <= endB) && (endA >= startB));
        if (endA == null) {
            return (startA > endB);
        }
        else if (endB == null) {
            return (startB > endA);
        }
        else if (endA == null && endB == null) {
            return false;
        }
        return (endA <= startB || startA >= endB);
    },

    createDate: function(d) {
        d = new Date(d)
        d.setHours(0, 0, 0, 0);
        return d;
    },
}