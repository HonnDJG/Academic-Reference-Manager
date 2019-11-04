const context = require('../../IoC/context').newContext();

const db = context('db')(context);


afterAll(async (done) => {
    await db.connection.close();
    done();
});

describe("Test User queries", () => {

    let createdUsers;
    let createdPublications;
    let createdLoans;
    errorCaught = false;

    const dates = {
        "octFirst": new Date("2015-10-01"),
        "octFifth": new Date("2015-10-05"),
        "octTenth": new Date("2015-10-10"),
        "octFifteenth": new Date("2015-10-15"),
        "octTwentieth": new Date("2015-10-20"),
        "octThirtieth": new Date("2015-10-30"),
        "septThirtieth": new Date("2015-09-30"),
        "novFirst": new Date("2015-11-01")
    }

    beforeEach(async (done) => {
        await db.User.deleteMany();
        await db.Loan.deleteMany();
        await db.Publication.deleteMany();
        createdUsers = await db.User.insertMany([
            {
                first_name: "user1",
                email: "hello@123.com",
            },
            {
                first_name: "user2",
                email: "hello@123.com",
            },
            {
                first_name: "user3",
                email: "hello@123.com",
            },
            {
                first_name: "user4",
                email: "hello@123.com",
            }
        ]);
        createdPublications = await db.Publication.insertMany([
            {
                editor_first_name: "editor1",
                publication_title: "publication1",
                isbn: "isbn1",
            },
            {
                editor_first_name: "editor2",
                publication_title: "publication2",
                isbn: "isbn2",
            }
        ]);
        createdLoans = await db.Loan.insertMany([
            {
                user: createdUsers[0]._id,
                publication: createdPublications[0]._id,
                borrow_date: dates.novFirst
            },
            {
                user: createdUsers[1]._id,
                publication: createdPublications[0]._id,
                borrow_date: dates.septThirtieth,
                return_date: dates.octFifteenth
            }
        ]);
        errorCaught = false;
        done();
    });

    describe("checkExistence", () => {
        it("should not throw as loan was found", async (done) => {
            const loan = createdLoans[0];

            try {
                await db.Loan.checkExistence(loan._id);
            } catch (e) {
                errorCaught = true;
            }
            expect(errorCaught).toEqual(false);

            done();
        });

        it("should throw Cast when ID is invalid", async (done) => {
            try {
                await db.Loan.checkExistence("123");
            } catch (e) {
                errorCaught = true;
                expect(e.name).toBe("CastError");
            }
            expect(errorCaught).toEqual(true);

            done();
        });

        it("should throw not found error", async (done) => {
            try {
                await db.Loan.checkExistence("123123123123");
            } catch (e) {
                errorCaught = true;
                expect(e.output.payload.error).toBe("Not Found");
            }
            expect(errorCaught).toEqual(true);

            done();
        });
    });

    describe("getLoansByUserId", () => {
        it("it should return loans", async (done) => {
            let loans;
            try{
                loans = await db.Loan.getLoansByUserId(createdUsers[0]._id);
            } catch(e) {
                errorCaught = true;
            }
            expect(errorCaught).toBe(false);
            expect(loans.length).toBe(1);
            done();
        });
        it("should throw error because of an invalid id", async (done) => {
            let loans;
            try {
                loans = await db.Loan.getLoansByUserId("hehe");
            } catch (e) {
                errorCaught = true;
                expect(e.name).toBe("CastError");
            }
            expect(errorCaught).toEqual(true);
            expect(loans).toBeUndefined();
            done();
        });
        it("should return empty list as no loans are found for user", async (done) => {
            let loans;
            try {
                loans = await db.Loan.getLoansByUserId(createdUsers[2]._id);
            } catch (e) {
                errorCaught = true;
            }

            expect(errorCaught).toEqual(false);
            expect(loans.length).toBe(0);
            done();
        });
    });
    describe("getLoansByPublicationId", () => {
        it("it should return loans", async (done) => {
            let loans;
            try{
                loans = await db.Loan.getLoansByPublicationId(createdPublications[0]._id);
            } catch(e) {
                errorCaught = true;
            }
            expect(errorCaught).toBe(false);
            expect(loans.length).toBe(2);
            done();
        });
        it("should throw error because of an invalid id", async (done) => {
            let loans;
            try {
                loans = await db.Loan.getLoansByPublicationId("hehe");
            } catch (e) {
                errorCaught = true;
                expect(e.name).toBe("CastError");
            }
            expect(errorCaught).toEqual(true);
            expect(loans).toBeUndefined();
            done();
        });
        it("should return null as no loans are found for publication", async (done) => {
            let loans;
            try {
                loans = await db.Loan.getLoansByPublicationId(createdPublications[1]._id);
            } catch (e) {
                errorCaught = true;
            }

            expect(errorCaught).toEqual(false);
            expect(loans.length).toBe(0);
            done();
        });
    });
    describe("getLoanByPublicationAndUserId", () => {
        it("it should return a loan", async (done) => {
            let loan;
            try{
                loan = await db.Loan.getLoanByPublicationAndUserId(createdPublications[0]._id,createdUsers[0]._id);
            } catch(e) {
                errorCaught = true;
            }
            expect(errorCaught).toBe(false);
            expect(loan._id).toEqual(createdLoans[0]._id);
            done();
        });
        it("should throw error because of an invalid publication id", async (done) => {
            let loan;
            try {
                loan = await db.Loan.getLoanByPublicationAndUserId("hehe", createdUsers[0]._id);
            } catch (e) {
                errorCaught = true;
                expect(e.name).toBe("CastError");
            }
            expect(errorCaught).toEqual(true);
            expect(loan).toBeUndefined();
            done();
        });
        it("should throw error because of an invalid user id", async (done) => {
            let loan;
            try {
                loan = await db.Loan.getLoanByPublicationAndUserId( createdPublications[0]._id, "hehe");
            } catch (e) {
                errorCaught = true;
                expect(e.name).toBe("CastError");
            }
            expect(errorCaught).toEqual(true);
            expect(loan).toBeUndefined();
            done();
        });
        it("should return null as no review is found for user on this publication", async (done) => {
            let loan;
            try {
                loan = await db.Loan.getLoanByPublicationAndUserId(createdPublications[1]._id, createdUsers[0]._id);
            } catch (e) {
                errorCaught = true;
            }

            expect(errorCaught).toEqual(false);
            expect(loan).toBeNull();
            done();
        });
    });
    describe("getPublicationsOnLoanByDates", () => {
        it("it should return a loan", async (done) => {
            let publications;
            try{
                publications = await db.Loan.getPublicationsOnLoanByDates(dates.septThirtieth,dates.octFifth);
            } catch(e) {
                errorCaught = true;
            }
            expect(errorCaught).toBe(false);
            expect(publications.length).toBe(1);
            done();
        });
        it("it should return an empty list", async (done) => {
            let publications;
            try{
                publications = await db.Loan.getPublicationsOnLoanByDates(dates.septThirtieth, dates.octFifteenth);
            } catch(e) {
                errorCaught = true;
            }
            expect(errorCaught).toBe(false);
            expect(publications.length).toBe(0);
            done();
        });
    });
    describe("getPublicationsOnLoanByDatesAndUserId", () => {
        it("it should return a publication", async (done) => {
            let publications;
            try{
                publications = await db.Loan.getPublicationsOnLoanByDatesAndUserId(createdUsers[1]._id , dates.septThirtieth, dates.octFifth);
            } catch(e) {
                errorCaught = true;
            }
            expect(errorCaught).toBe(false);
            expect(publications.length).toBe(1);
            done();
        });
        it("it should throw an error because of wrong userId", async (done) => {
            let publications;
            try{
                publications = await db.Loan.getPublicationsOnLoanByDatesAndUserId("hehe", dates.septThirtieth, dates.octFifth);
            } catch(e) {
                errorCaught = true;
            }
            expect(errorCaught).toBe(true);
            expect(publications).toBeUndefined();
            done();
        });
        it("it should return an empty list", async (done) => {
            let publications;
            try{
                publications = await db.Loan.getPublicationsOnLoanByDatesAndUserId( createdUsers[0]._id, dates.septThirtieth, dates.octFifteenth);
            } catch(e) {
                errorCaught = true;
            }
            expect(errorCaught).toBe(false);
            expect(publications.length).toBe(0);
            done();
        });
    });
    describe("getUsersOnLoanByDates", () => {
        it("it should return a user", async (done) => {
            let users;
            try{
                users = await db.Loan.getUsersOnLoanByDates(dates.septThirtieth,dates.octFifth);
            } catch(e) {
                errorCaught = true;
            }
            expect(errorCaught).toBe(false);
            expect(users.length).toBe(1);
            done();
        });
        it("it should return an empty list", async (done) => {
            let loans;
            try{
                loans = await db.Loan.getUsersOnLoanByDates(dates.septThirtieth, dates.octFifteenth);
            } catch(e) {
                errorCaught = true;
            }
            expect(errorCaught).toBe(false);
            expect(loans.length).toBe(0);
            done();
        });
    });
    describe("getUsersOnLoanByDatesAndPublicationId", () => {
        it("it should return a user", async (done) => {
            let users;
            try{
                users = await db.Loan.getUsersOnLoanByDatesAndPublicationId(createdPublications[0]._id , dates.septThirtieth, dates.octFifth);
            } catch(e) {
                errorCaught = true;
            }
            expect(errorCaught).toBe(false);
            expect(users.length).toBe(1);
            done();
        });
        it("it should throw an error because of wrong publicationId", async (done) => {
            let users;
            try{
                users = await db.Loan.getUsersOnLoanByDatesAndPublicationId("hehe", dates.septThirtieth, dates.octFifth);
            } catch(e) {
                errorCaught = true;
            }
            expect(errorCaught).toBe(true);
            expect(users).toBeUndefined();
            done();
        });
        it("it should return an empty list", async (done) => {
            let users;
            try{
                users = await db.Loan.getUsersOnLoanByDatesAndPublicationId( createdPublications[1]._id, dates.septThirtieth, dates.octFifteenth);
            } catch(e) {
                errorCaught = true;
            }
            expect(errorCaught).toBe(false);
            expect(users.length).toBe(0);
            done();
        });
    });
    /*
    describe("Users with loans on date", () => {
        it("Should return those who borrowed on the day", async (done) => {
            const queriedUsers = await db.User.getAllUsersWithOnGoingLoanOnDate(dates.octFirst);
            expect(queriedUsers[0].first_name).toBe("user1");
            expect(queriedUsers[1].first_name).toBe("user2");
            expect(queriedUsers.length).toBe(2);

            done();
        });

        it("Should return those who have on going loans on date", async (done) => {
            const queriedUsers = await db.User.getAllUsersWithOnGoingLoanOnDate(dates.octFifteenth);
            expect(queriedUsers[0].first_name).toBe("user1");
            expect(queriedUsers[1].first_name).toBe("user3");
            expect(queriedUsers[2].first_name).toBe("user4");
            expect(queriedUsers.length).toBe(3);

            done();
        });

        it("Should not return a person who returned on the date", async (done) => {
            const queriedUsers = await db.User.getAllUsersWithOnGoingLoanOnDate(dates.octTenth);
            expect(queriedUsers[0].first_name).toBe("user1");
            expect(queriedUsers[1].first_name).toBe("user3");
            expect(queriedUsers[2].first_name).toBe("user4");
            expect(queriedUsers.length).toBe(3);

            done();
        });

        it("Should not return people who have returned prior to the date", async (done) => {
            const queriedUsers = await db.User.getAllUsersWithOnGoingLoanOnDate(dates.octThirtieth);
            expect(queriedUsers[0].first_name).toBe("user3");
            expect(queriedUsers[1].first_name).toBe("user4");
            expect(queriedUsers.length).toBe(2);

            done();
        });

        it("Should not return any thing on dates with no loans on going (before everything)", async (done) => {
            const queriedUsers = await db.User.getAllUsersWithOnGoingLoanOnDate(dates.septThirtieth);
            expect(queriedUsers.length).toBe(0);

            done();
        });

        it("Should return only user with NULL return date", async (done) => {
            const queriedUsers = await db.User.getAllUsersWithOnGoingLoanOnDate(dates.novFirst);
            expect(queriedUsers[0].first_name).toBe("user3");
            expect(queriedUsers.length).toBe(1);

            done();
        });
    });

    describe("Users with loans longer than ", () => {

        it("Should return everybody borrowing longer than 1 day", async (done) => {
            const borrow_date = new Date("2015-10-04");
            const return_date = new Date("2015-10-05");
            const queriedUsers = await db.User.getAllUsersWithLoansLongerThanDurationOnDate(borrow_date, return_date);
            expect(queriedUsers[0].first_name).toBe("user1");
            expect(queriedUsers[1].first_name).toBe("user2");
            expect(queriedUsers.length).toBe(2);

            done();
        });

        it("Should return nobody", async (done) => {
            const borrow_date = new Date("2015-09-30");
            const return_date = new Date("2015-10-01");
            const queriedUsers = await db.User.getAllUsersWithLoansLongerThanDurationOnDate(borrow_date, return_date);
            expect(queriedUsers.length).toBe(0);

            done();
        });

        it("Should return users who borrowed longer than 5 days", async (done) => {
            let borrow_date = new Date("2015-10-01");
            let return_date = new Date("2015-10-06");
            let queriedUsers = await db.User.getAllUsersWithLoansLongerThanDurationOnDate(borrow_date, return_date);
            expect(queriedUsers[0].first_name).toBe("user1");
            expect(queriedUsers[1].first_name).toBe("user2");
            expect(queriedUsers.length).toBe(2);


            borrow_date = new Date("2016-01-01");
            return_date = new Date("2016-01-06");
            queriedUsers = await db.User.getAllUsersWithLoansLongerThanDurationOnDate(borrow_date, return_date);
            expect(queriedUsers[0].first_name).toBe("user3");
            expect(queriedUsers.length).toBe(1);

            done();
        });

        it("Should return users who have borrowed longer than 10 days", async (done) => {
            let borrow_date = new Date("2015-10-01");
            let return_date = new Date("2015-10-11");
            let queriedUsers = await db.User.getAllUsersWithLoansLongerThanDurationOnDate(borrow_date, return_date);
            expect(queriedUsers[0].first_name).toBe("user1");
            expect(queriedUsers.length).toBe(1);


            borrow_date = new Date("2015-10-05");
            return_date = new Date("2015-10-15");
            queriedUsers = await db.User.getAllUsersWithLoansLongerThanDurationOnDate(borrow_date, return_date);
            expect(queriedUsers[0].first_name).toBe("user1");
            expect(queriedUsers[1].first_name).toBe("user4");
            expect(queriedUsers.length).toBe(2);


            borrow_date = new Date("2015-11-05");
            return_date = new Date("2015-10-26");
            queriedUsers = await db.User.getAllUsersWithLoansLongerThanDurationOnDate(borrow_date, return_date);
            expect(queriedUsers[0].first_name).toBe("user3");
            expect(queriedUsers[1].first_name).toBe("user4");
            expect(queriedUsers.length).toBe(2);

            done();
        });

    });
    */


});