const overlapChecker = require('../helpers/overlapChecker');

describe("Test overlap checker", () => {
    it("Should return that the dates do not overlap", () => {
        const startA = new Date("2019-02-27");
        const endA = new Date("2019-03-28");
        const startB = new Date("2019-07-20");
        const endB = new Date("2019-08-20");
        overlap = overlapChecker.checkOverlap(startA, endA, startB, endB);
        expect(overlap).toEqual(true);
    });

    it("Should return that the dates do overlap", () => {
        const startA = new Date("2019-02-27");
        const endA = new Date("2019-07-28");
        const startB = new Date("2019-07-20");
        const endB = new Date("2019-08-20");
        overlap = overlapChecker.checkOverlap(startA, endA, startB, endB);
        expect(overlap).toEqual(false);
    });

    it("Should return a date from a string", () => {
        let date1 = "2019-02-27";
        const date2 = new Date("2019-02-27");
        date1 = overlapChecker.createDate(date1);
        expect(date1).toEqual(date2);
    });

    it("Should return that the data type of the variable is date", () => {
        let date1 = "2019-02-27";
        date1 = overlapChecker.createDate(date1);
        expect(date1 instanceof Date).toEqual(true);
    })
})