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
        "novFirst": new Date("2015-11-01"),
        "novFifth": new Date("2015-11-05")
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
                users = await db.Loan.getUsersOnLoanByDatesAndPublicationId( hehe, dates.septThirtieth, dates.octFifth);
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
    describe("getPublicationsOnLoanByPublicationIdAndDates", () => {
        it("it should return a publication", async (done) => {
            let publications;
            try{
                publications = await db.Loan.getPublicationsOnLoanByPublicationIdAndDates(createdPublications[0]._id , dates.septThirtieth, dates.octFifth);
            } catch(e) {
                errorCaught = true;
            }
            expect(errorCaught).toBe(false);
            expect(publications.length).toBe(1);
            done();
        });
        it("it should throw an error because of wrong publicationId", async (done) => {
            let publications;
            try{
                publications = await db.Loan.getPublicationsOnLoanByPublicationIdAndDates("hehe", dates.septThirtieth, dates.octFifth);
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
                publications = await db.Loan.getPublicationsOnLoanByPublicationIdAndDates( createdPublications[0]._id, dates.septThirtieth, dates.octFifteenth);
            } catch(e) {
                errorCaught = true;
            }
            expect(errorCaught).toBe(false);
            expect(publications.length).toBe(0);
            done();
        });
    });
    describe("createLoan", () => {
        it("Should create and return a loan", async (done) => {
            let loan;
            try {
                loan = await db.Loan.createLoan({
                    user: createdUsers[1],
                    publication: createdPublications[1],
                    borrow_date: dates.septThirtieth
                });
            } catch (e) {
                errorCaught = true;
            }

            expect(errorCaught).toEqual(false);
            expect(loan.borrow_date).toBe(dates.septThirtieth);
            done();
        });

        it("Should throw ValidationError because of missing all required fields", async (done) => {
            let loan;
            try {
                loan = await db.Loan.createLoan({
                });
            } catch (e) {
                errorCaught = true;
                expect(e.name).toBe("ValidationError");
                expect(e.errors.user).toBeDefined();
                expect(e.errors.publication).toBeDefined();
                expect(e.errors.borrow_date).toBeDefined();
            }

            expect(errorCaught).toEqual(true);
            expect(loan).toBeUndefined();
            done();
        });

        it("Should throw ValidationError because of missing user", async (done) => {
            let loan;
            try {
                loan = await db.Loan.createLoan({
                    publication: createdPublications[1],
                    borrow_date: 5
                });
            } catch (e) {
                errorCaught = true;
                expect(e.name).toBe("ValidationError");
                expect(e.errors.user).toBeDefined();
                expect(e.errors.publication).toBeUndefined();
                expect(e.errors.borrow_date).toBeUndefined();
            }

            expect(errorCaught).toEqual(true);
            expect(loan).toBeUndefined();
            done();
        });

        it("Should throw error because of invalid user id", async (done) => {
            let loan;
            try {
                loan = await db.Loan.createLoan({
                    user: bla,
                    publication: createdPublications[1],
                    rating: 5
                });
            } catch (e) {
                errorCaught = true;
            }

            expect(errorCaught).toEqual(true);
            expect(loan).toBeUndefined();
            done();
        });
    });
    describe("updateLoan", () => {
        it("should update and return updated loan", async (done) => {
            let testLoan = createdLoans[0];
            let loan;
            try {
                loan = await db.Loan.updateLoan({
                    user: testLoan.user,
                    publication: testLoan.publication,
                    return_date: dates.novFifth
                });
            } catch (e) {
                errorCaught = true;
            }

            expect(errorCaught).toEqual(false);
            expect(loan.return_date).toEqual(dates.novFifth);
            done();
        });

        it("should throw because of invalid userId", async (done) => {
            let testLoan = createdLoans[0];
            let loan;
            try {
                loan = await db.Loan.updateLoan( {
                    user: "hehe",
                    publication: testLoan.publication,
                    return_date: dates.novFifth
                });
            } catch (e) {
                errorCaught = true;
            }

            expect(errorCaught).toEqual(true);
            expect(loan).toBeUndefined();
            done();
        });
    });
    describe("returnLoan", () => {
        it("should update return date and return updated loan", async (done) => {
            let testLoan = createdLoans[0];
            let loan;
            try {
                loan = await db.Loan.returnLoan( testLoan.user, testLoan.publication, dates.novFifth);
            } catch (e) {
                errorCaught = true;
            }

            expect(errorCaught).toEqual(false);
            expect(loan.return_date).toEqual(dates.novFifth);
            done();
        });

        it("should throw invalid publicationID", async (done) => {
            let testLoan = createdLoans[0];
            let loan;
            try {
                loan = await db.Loan.returnLoan( testLoan.user, "hehe", dates.novFifth);
            } catch (e) {
                errorCaught = true;
            }

            expect(errorCaught).toEqual(true);
            expect(loan).toBeUndefined();
            done();
        });
        it("should throw invalid userID", async (done) => {
            let testLoan = createdLoans[0];
            let loan;
            try {
                loan = await db.Loan.returnLoan( "hehe", testLoan.publication, dates.novFifth);
            } catch (e) {
                errorCaught = true;
            }

            expect(errorCaught).toEqual(true);
            expect(loan).toBeUndefined();
            done();
        });
        
    });
});