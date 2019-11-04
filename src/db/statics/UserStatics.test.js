const context = require('../../IoC/context').newContext();

const db = context('db')(context);

afterAll(async (done) => {
    await db.connection.close();
    done();
});

describe("Test User queries", () => {

    let createdUsers;
    let errorCaught = false;

    beforeEach(async (done) => {
        await db.User.deleteMany();
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

        errorCaught = false;

        done();
    });

    describe("getAllUsers", () => {
        it("should get all users", async (done) => {
            const allUsers = await db.User.getAllUsers();

            expect(createdUsers[0].first_name).toEqual(allUsers[0].first_name);
            expect(createdUsers[0].first_name).toEqual(allUsers[0].first_name);
            done();
        });

        it("it should return an empty array", async (done) => {
            await db.User.deleteMany();
            const allUsers = await db.User.getAllUsers();
            expect(allUsers.length).toBe(0);
            done();
        });
    });

    describe("checkExistence", () => {
        it("should not throw as user was found", async (done) => {
            const user = await db.User.findOne();

            try {
                await db.User.checkExistence(user._id);
            } catch (e) {
                errorCaught = true;
            }
            expect(errorCaught).toEqual(false);

            done();
        });

        it("should throw Cast when ID is invalid", async (done) => {
            try {
                await db.User.checkExistence("123");
            } catch (e) {
                errorCaught = true;
                expect(e.name).toBe("CastError");
            }
            expect(errorCaught).toEqual(true);

            done();
        });

        it("should throw not found error", async (done) => {
            try {
                await db.User.checkExistence("123123123123");
            } catch (e) {
                errorCaught = true;
                expect(e.output.payload.error).toBe("Not Found");
            }
            expect(errorCaught).toEqual(true);

            done();
        });
    });

    describe("getAllUsers", () => {
        it("Should find all users", async (done) => {
            let users;
            try {
                users = await db.User.getAllUsers();
            } catch (e) {
                errorCaught = true;
            }

            expect(errorCaught).toEqual(false);
            expect(users.length).toBe(4);
            expect(users[0].first_name).toBe("user1");
            expect(users[1].first_name).toBe("user2");
            expect(users[2].first_name).toBe("user3");
            expect(users[3].first_name).toBe("user4");

            done();
        });

        it("Should return empty array", async (done) => {
            await db.User.deleteMany();
            let users;
            try {
                users = await db.User.getAllUsers();
            } catch (e) {
                errorCaught = true;
            }

            expect(errorCaught).toEqual(false);
            expect(users.length).toBe(0);
            done();
        })
    });

    describe("createUser", () => {
        it("Should create and return a basic user", async (done) => {
            let user;
            try {
                user = await db.User.createUser({
                    first_name: "hello",
                    email: "hello@there.com"
                });
            } catch (e) {
                errorCaught = true;
            }

            expect(errorCaught).toEqual(false);
            expect(user.first_name).toBe("hello");
            done();
        });

        it("Should throw ValidationError because of missing all required fields", async (done) => {
            let user;
            try {
                user = await db.User.createUser({
                    last_name: "hello"
                });
            } catch (e) {
                errorCaught = true;
                expect(e.name).toBe("ValidationError");
                expect(e.errors.email).toBeDefined();
                expect(e.errors.first_name).toBeDefined();
            }

            expect(errorCaught).toEqual(true);
            expect(user).toBeUndefined();
            done();
        });

        it("Should throw ValidationError because of missing email", async (done) => {
            let user;
            try {
                user = await db.User.createUser({
                    first_name: "hello"
                });
            } catch (e) {
                errorCaught = true;
                expect(e.name).toBe("ValidationError");
                expect(e.errors.email).toBeDefined();
                expect(e.errors.first_name).toBeUndefined();
            }

            expect(errorCaught).toEqual(true);
            expect(user).toBeUndefined();
            done();
        });

        it("Should throw ValidationError because of missing first_name", async (done) => {
            let user;
            try {
                user = await db.User.createUser({
                    email: "hello@there.com"
                });
            } catch (e) {
                errorCaught = true;
                expect(e.name).toBe("ValidationError");
                expect(e.errors.email).toBeUndefined();
                expect(e.errors.first_name).toBeDefined();
            }

            expect(errorCaught).toEqual(true);
            expect(user).toBeUndefined();
            done();
        });

        it("Should throw ValidationError because of invalid email", async (done) => {
            let user;
            try {
                user = await db.User.createUser({
                    first_name: "heehee",
                    email: "hello"
                });
            } catch (e) {
                errorCaught = true;
                expect(e.name).toBe("ValidationError");
                expect(e.errors.email).toBeDefined();
                expect(e.errors.first_name).toBeUndefined();
            }

            expect(errorCaught).toEqual(true);
            expect(user).toBeUndefined();
            done();
        });
    });

    describe("getUserById", () => {
        it("should find a user", async (done) => {
            const aUser = await db.User.findOne();
            let user;
            try {
                user = await db.User.getUserById(aUser._id);
            } catch (e) {
                errorCaught = true;
            }

            expect(errorCaught).toEqual(false);
            expect(user.first_name).toBeDefined();
            done();
        });

        it("should return null as user not found", async (done) => {
            let user;
            try {
                user = await db.User.getUserById("123123123123");
            } catch (e) {
                errorCaught = true;
            }

            expect(errorCaught).toEqual(false);
            expect(user).toBeNull();
            done();
        });

        it("should throw error because of invalid id", async (done) => {
            let user;
            try {
                user = await db.User.getUserById("hehe");
            } catch (e) {
                errorCaught = true;
                expect(e.name).toBe("CastError");
            }
            expect(errorCaught).toEqual(true);
            expect(user).toBeUndefined();
            done();
        });
    });

    describe("getUserById", () => {
        it("should delete and return deleted user", async (done) => {
            const aUser = await db.User.findOne();
            let user;
            try {
                user = await db.User.deleteUser(aUser._id);
            } catch (e) {
                errorCaught = true;
            }

            const findDeletedUser = await db.User.findById(aUser._id);

            expect(errorCaught).toEqual(false);
            expect(user).toBeDefined();
            expect(findDeletedUser).toBeNull();
            done();
        });

        it("should throw invalid ID", async (done) => {
            let user;
            try {
                user = await db.User.deleteUser("hello");
            } catch (e) {
                errorCaught = true;
                expect(e.name).toEqual("CastError");
            }

            expect(errorCaught).toEqual(true);
            expect(user).toBeUndefined();

            done();
        });
    });




});