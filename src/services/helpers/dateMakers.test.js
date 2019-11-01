const dateMakersFactory = require('../helpers/dateMakers');
const dateMakers = dateMakersFactory();

describe("Test date makers", () => {
    it("Should return a date 30 days prior with string input", () => {
        const date = new Date("2010-10-10");
        const desiredDate = new Date("2010-09-10");
        const newDate = dateMakers.subtractDuration(date, '30');

        expect(newDate).toEqual(desiredDate);
    });

    it("Should return a date 30 days prior with number input", () => {
        const date = new Date("2010-10-10");
        const desiredDate = new Date("2010-09-10");
        const newDate = dateMakers.subtractDuration(date, 30);

        expect(newDate).toEqual(desiredDate);
    });

    it("Should return a date 10 days into the future with string input", () => {
        const date = new Date("2010-10-10");
        const desiredDate = new Date("2010-10-20");
        const newDate = dateMakers.addDuration(date, '10');

        expect(newDate).toEqual(desiredDate);
    });

    it("Should return a date 10 days into the future with number input", () => {
        const date = new Date("2010-10-10");
        const desiredDate = new Date("2010-10-20");
        const newDate = dateMakers.addDuration(date, 10);

        expect(newDate).toEqual(desiredDate);
    });
})