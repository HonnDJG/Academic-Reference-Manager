const context = require('../IoC/context').newContext();

const db = context('db')(context);

beforeEach(async (done) => {
    await db.User.deleteMany();
    done();
});

afterAll(async (done) => {
    await db.connection.close();
    done();
});

describe("Test User queries", () => {

    let createdUsers;

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

        done();
    });

    it("should get all users", async (done) => {
        const allUsers = await db.User.getAllUsers();

        expect(createdUsers[0].first_name).toEqual(allUsers[0].first_name);
        expect(createdUsers[0].first_name).toEqual(allUsers[0].first_name);
        done();
    });

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


})