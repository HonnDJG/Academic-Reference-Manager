const context = require('../IoC/context').newContext();

const db = context('db')(context);

const validUser = {
    "first_name": "Wang", "last_name": "Giles", "address": "803 Spenser Hill", "phone": "+86-559-705-3742", "email": "wgiles0@nps.gov"
}

let errorCaught = false;

beforeEach(async (done) => {
    await db.User.deleteMany();
    await db.Publication.deleteMany();
    errorCaught = false;
    done();
});

afterAll(async (done) => {
    await db.connection.close();
    done();
})

describe("Test for connection", () => {

    it("User should module exist", () => {
        expect(db.User).toBeDefined();
    });

    it("Publication should module exist", () => {
        expect(db.Publication).toBeDefined();
    });
});

describe("Test User collection", () => {

    it("should be able to create basic a user", async (done) => {
        try {
            const initialCount = await db.User.countDocuments();
            expect(initialCount).toBe(0);

            await db.User.create(validUser);

            const afterAddCount = await db.User.countDocuments();
            expect(afterAddCount).toBe(1);
        } catch (e) {
            expect(e.name).toBe("ValidationError");
            errorCaught = true;
        }

        expect(errorCaught).toBeFalsy();

        done();
    });

    it("should succeed creating a user with only required", async (done) => {
        try {
            const initialCount = await db.User.countDocuments();
            expect(initialCount).toBe(0);
            await db.User.create({ first_name: "hello", email: "hello@games.com" })
            const afterAddCount = await db.User.countDocuments();
            expect(afterAddCount).toBe(1);
        } catch (e) {
            expect(e.name).toBe("ValidationError");
            errorCauhgt = true;
        }
        expect(errorCaught).toBeFalsy();

        done();
    });

    it("should fail creating an invalid user (missing all required)", async (done) => {
        try {
            await db.User.create({ name: "hello" })
        } catch (e) {
            expect(e.name).toBe("ValidationError");
            errorCaught = true;
        }

        expect(errorCaught).toBeTruthy();

        done();
    });

    it("should fail creating an invalid user (missing email)", async (done) => {
        let errorCaught = false;
        try {
            await db.User.create({ first_name: "hello" })
        } catch (e) {
            expect(e.name).toBe("ValidationError");
            errorCaught = true;
        }
        expect(errorCaught).toBeTruthy();

        done();
    });

    it("should fail inputting invalid email", async (done) => {
        try {
            await db.User.create({ first_name: "hello", email: "hello@games" })
        } catch (e) {
            expect(e.name).toBe("ValidationError");
            errorCaught = true;
        }
        expect(errorCaught).toBeTruthy();

        errorCaught = false;

        try {
            await db.User.create({ first_name: "hello", email: 123 })
        } catch (e) {
            expect(e.name).toBe("ValidationError");
            errorCaught = true;
        }
        expect(errorCaught).toBeTruthy();

        errorCaught = false;

        try {
            await db.User.create({ first_name: "hello", email: "hello" })
        } catch (e) {
            expect(e.name).toBe("ValidationError");
            errorCaught = true;
        }
        expect(errorCaught).toBeTruthy();

        done();
    });



    it("should fail creating a user with invalid phone number", async (done) => {
        try {
            await db.User.create({ first_name: "hello", email: "hello@games.com", phone: 123456 })
        } catch (e) {
            expect(e.name).toBe("ValidationError");
            errorCaught = true;
        }
        expect(errorCaught).toBeTruthy();

        errorCaught = false;

        try {
            await db.User.create({ first_name: "hello", email: "hello@games.com", phone: "123456" })
        } catch (e) {
            expect(e.name).toBe("ValidationError");
            errorCaught = true;
        }
        expect(errorCaught).toBeTruthy();
        errorCaught = false;

        try {
            await db.User.create({ first_name: "hello", email: "hello@games.com", phone: "+123456" })
        } catch (e) {
            expect(e.name).toBe("ValidationError");
            errorCaught = true;
        }
        expect(errorCaught).toBeTruthy();
        errorCaught = false;

        try {
            await db.User.create({ first_name: "hello", email: "hello@games.com", phone: "hello!" })
        } catch (e) {
            expect(e.name).toBe("ValidationError");
            errorCaught = true;
        }
        expect(errorCaught).toBeTruthy();
        errorCaught = false;

        done();
    });

    describe("Borrowed publications", () => {
        it("should fail when creating user with borrowed publications but missing required fields", async (done) => {
            try {
                await db.User.create({
                    first_name: "hello",
                    email: "email@hello.com",
                    publications: [{
                        return_date: "2010-10-10"
                    }]
                })
            } catch (e) {
                expect(e.name).toBe("ValidationError");
                errorCaught = true;
            }

            expect(errorCaught).toBeTruthy();

            done();
        });
        it("should fail when creating user with borrowed publications but missing id", async (done) => {
            try {
                await db.User.create({
                    first_name: "hello",
                    email: "email@hello.com",
                    publications: [
                        {
                            borrow_date: "2013-10-10"
                        }
                    ]
                })
            } catch (e) {
                expect(e.name).toBe("ValidationError");
                errorCaught = true;
            }

            expect(errorCaught).toBeTruthy();

            done();
        });

        it("should fail when creating user with borrowed publication but missing borrow_date", async (done) => {
            try {
                await db.User.create({
                    first_name: "hello",
                    email: "email@hello.com",
                    publications: [
                        {
                            publication: "5db9dc4791e9a35fc3ebb638"
                        }
                    ]
                })
            } catch (e) {
                expect(e.name).toBe("ValidationError");
                errorCaught = true;
            }

            expect(errorCaught).toBeTruthy();

            done();
        });

        it("should succeed when creating user with correct borrowed publication format", async (done) => {
            try {
                const initCount = await db.User.countDocuments();
                await db.User.create({
                    first_name: "hello",
                    email: "email@hello.com",
                    publications: [
                        {
                            publication: "5db9dc4791e9a35fc3ebb638",
                            borrow_date: "2019-10-10"
                        }
                    ]
                });

                const afterCount = await db.User.countDocuments();

                expect(initCount).toBe(0);
                expect(afterCount).toBe(1);
            } catch (e) {
                errorCaught = true;
            }

            expect(errorCaught).toBeFalsy();

            done();
        });
    });
});