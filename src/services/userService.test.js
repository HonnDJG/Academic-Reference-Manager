const userServiceFactory = require('./userService');

let dependencies;
let userService;

const date = new Date();
date.setHours(0, 0, 0, 0);
const query = { loanDuration: '10', loanDate: date }

const resetDeps = () => dependencies = {
    db: (context) => ({
        User: {
            getAllUsers: () => ({
                select: (x) => [1, 2, 3]
            }),
            getAllUsersWithLoansLongerThanDurationOnDate: jest.fn((x, y) => [4, 5, 6]),
            getAllUsersWithOnGoingLoanOnDate: jest.fn((x, y) => [7, 8, 9])
        }
    }),
    boom: {
        badImplementation: () => { throw new Error(); }
    },
    dateMakers: () => ({
        subtractDuration: jest.fn((x, y) => new Date(2015 - 10 - 10))
    }),
    throwCreator: (context) => () => { throw new Error() }
}

resetDeps();

const context = (name) => {
    return dependencies[name];
}

beforeEach(() => {
    resetDeps();
    userService = userServiceFactory(context);
});

describe("It should test User gets", () => {
    describe("getAllUsers", () => {
        it("should return a list", async (done) => {
            const result = await userService.getAllUsers();
            expect(result).toEqual([1, 2, 3]);
            done();
        });

        it("should throw bad implementation", async (done) => {
            dependencies.db = (context) => (
                {
                    User: {
                        getAllUsers: () => ({
                            select: (x) => { throw new Error(); }
                        })
                    }
                }
            );
            userService = userServiceFactory(context);

            try {
                await userService.getAllUsers()
            } catch (e) {
                expect(e).toBeDefined();
            }
            done();
        });
    });

    describe("getUsersByDateAndDuration", () => {

        it("Should return a list", async (done) => {
            const result = await userService.getUsersByDateAndDuration(query);
            expect(result).toEqual([4, 5, 6]);
            done();
        });

        it("Should throw bad implementation", async (done) => {
            dependencies.db = (context) => ({
                User: {
                    getAllUsersWithLoansLongerThanDurationOnDate: (x, y) => { throw new Error(); }
                }
            });

            userService = userServiceFactory(context);

            try {
                await userService.getUsersByDateAndDuration(query);
            } catch (e) {
                expect(e).toBeDefined();
            }

            done();
        });
    });

    describe("getUsersByDate", () => {

        it("Should return a list", async (done) => {
            const result = await userService.getUsersByDate(query);
            expect(result).toEqual([7, 8, 9]);
            done();
        });

        it("Should throw bad implementation", async (done) => {
            dependencies.db = (context) => ({
                User: {
                    getAllUsersWithOnGoingLoanOnDate: (x, y) => { throw new Error(); }
                }
            });

            userService = userServiceFactory(context);

            try {
                await userService.getUsersByDate(query);
            } catch (e) {
                expect(e).toBeDefined();
            }

            done();
        });
    });

    describe("getUserByDuration", () => {

        it("should return a list", async (done) => {
            const result = await userService.getUsersByDuration(query);
            expect(result).toEqual([4, 5, 6]);
            done();
        });

        it("should throw bad implementation", async (done) => {
            dependencies.db = (context) => ({
                User: {
                    getAllUsersWithLoansLongerThanDurationOnDate: (x, y) => { throw new Error(); }
                }
            });

            userService = userServiceFactory(context);

            try {
                await userService.getUsersByDuration(query);
            } catch (e) {
                expect(e).toBeDefined();
            }

            done();
        });
    });
});



