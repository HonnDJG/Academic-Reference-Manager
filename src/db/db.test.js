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

    it("Loan should module exist", () => {
        expect(db.User.Loan).toBeDefined();
    });

    it("Review should module exist", () => {
        expect(db.Review).toBeDefined();
    });
});
