const context = require('../IoC/context').newContext();
const db = context('db')(context);
const server = context('server')(context);
const supertest = require('supertest')
const app = server.app;;
const request = supertest(app)

// Inserts dummy data
beforeAll(async done => {
    await db.User.deleteMany();
    await db.Loan.deleteMany();
    await db.Review.deleteMany();
    await db.Publication.deleteMany();
    await db.User.create(
        {
            "last_name": "DeSousa",
            "address": "034 Roth Road",
            "phone": "+57-186-656-8400",
            "_id": "5dbf564e0ade253c5a4c7b60",
            "first_name": "Jen",
            "email": "jdesousa1@soundcloud.com"
        }
    );
    await db.Publication.insertMany([
        {
            "editor_last_name": "Creighton",
            "type": "electronic",
            "journal": "Elsevier",
            "year": 2004,
            "_id": "5dbf564e0ade253c5a4c7779",
            "editor_first_name": "Torre",
            "publication_title": "Alopex lagopus",
            "isbn": "140771152-0"
        },
        {
            "editor_last_name": "Levensky",
            "type": "electronic",
            "journal": "Springer",
            "year": 1999,
            "_id": "5dbf564e0ade253c5a4c777a",
            "editor_first_name": "Stacey",
            "publication_title": "Tayassu tajacu",
            "isbn": "293552152-8"
        }
    ]);
    await db.Loan.create(
        {
            "user": "5dbf564e0ade253c5a4c7b60",
            "publication": "5dbf564e0ade253c5a4c7779",
            "borrow_date": "2019-08-02T00:00:00.000Z",
            "return_date": "2019-09-15T00:00:00.000Z"
        });
    await db.Review.create(
        {
            "user": "5dbf564e0ade253c5a4c7b60",
            "publication": "5dbf564e0ade253c5a4c7779",
            "rating": "3"
        }
    );
    done();
});

afterAll(async done => {
    await db.connection.close();
    done();
});

// Success case tests
describe("Tests the success cases of the user routes", () => {
    // User tests
    it('posts a new user', async done => {
        const response = await request.post('/users').set("Authorization", "admin")
            .send(
                {
                    "last_name": "Giles",
                    "address": "803 Spenser Hill",
                    "phone": "+86-559-705-3742",
                    "first_name": "Wang",
                    "email": "wgiles0@nps.gov"
                });
        expect(response.status).toBe(201);
        done();
    })

    it('gets the users endpoint', async done => {
        const response = await request.get('/users').set("Authorization", "admin");
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(2); // Gets two users, one added in by beforeAll and one created in POST test
        done();
    })

    it('should get the user with given ID"', async done => {
        const response = await request.get('/users/5dbf564e0ade253c5a4c7b60').set("Authorization", "admin");
        expect(response.status).toBe(200);
        expect(response.body._id).toBe("5dbf564e0ade253c5a4c7b60");
        done();
    })

    it('should update the user with given ID"', async done => {
        const response = await request.put("/users/5dbf564e0ade253c5a4c7b60").set("Authorization", "admin")
            .send(
                {
                    "first_name": "Dang",
                });;
        const get = await request.get('/users/5dbf564e0ade253c5a4c7b60').set("Authorization", "admin");
        expect(response.status).toBe(200);
        expect(get.body.first_name).toBe("Dang");
        done();
    })

    // Loans tests
    it('should loan a given publication to user with given ID', async done => {
        const response = await request.post('/users/5dbf564e0ade253c5a4c7b60/publications/5dbf564e0ade253c5a4c777a').set("Authorization", "admin")
            .send(
                {
                    "borrow_date": "2019-11-02",
                    "return_date": "2019-11-15"
                });
        expect(response.status).toBe(201);
        done();
    })

    it('should get all publications on loan to user with ID "5dbf564e0ade253c5a4c7b60"', async done => {
        const response = await request.get("/users/5dbf564e0ade253c5a4c7b60/publications").set("Authorization", "admin")
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        done();
    })

    it('should update given publication for user with given ID"', async done => {
        const response = await request.put("/users/5dbf564e0ade253c5a4c7b60/publications/5dbf564e0ade253c5a4c777a").set("Authorization", "admin")
            .send(
                {
                    "return_date": "2019-11-17",
                });
        expect(response.status).toBe(200);
        done();
    })

    // Reviews

    it('should create a review for a given publication for user with given ID"', async done => {
        const response = await request.post("/users/5dbf564e0ade253c5a4c7b60/reviews/5dbf564e0ade253c5a4c777a").set("Authorization", "admin")
        .send(
            {
                "rating": "4",
            });
        expect(response.status).toBe(201);
        done();
    })

    it('should get all reviews a user with a given ID has left', async done => {
        const response = await request.get("/users/5dbf564e0ade253c5a4c7b60/reviews").set("Authorization", "admin");
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(2);
        done();
    })

    it('should get review for given publication from a user with a given ID has left', async done => {
        const response = await request.get("/users/5dbf564e0ade253c5a4c7b60/reviews/5dbf564e0ade253c5a4c777a").set("Authorization", "admin")
        expect(response.status).toBe(200);
        expect(response.body.rating).toBe(4);
        done();
    })

    // Testing Deletes
    it('should delete given publication for user with given ID"', async done => {
        let get = await request.get('/users/5dbf564e0ade253c5a4c7b60/publications').set("Authorization", "admin");
        let prevLength = get.body.length;
        const response = await request.delete('/users/5dbf564e0ade253c5a4c7b60/publications/5dbf564e0ade253c5a4c777a').set("Authorization", "admin");
        get = await request.get('/users/5dbf564e0ade253c5a4c7b60/publications').set("Authorization", "admin");
        expect(response.status).toBe(200);
        expect(get.body.length).toBe(prevLength - 1);
        done();
    })

    it('should delete the user with given ID', async done => {
        let get = await request.get('/users').set("Authorization", "admin");
        let prevLength = get.body.length;
        const response = await request.delete('/users/5dbf564e0ade253c5a4c7b60').set("Authorization", "admin");
        get = await request.get('/users').set("Authorization", "admin");
        expect(response.status).toBe(200);
        expect(get.body.length).toBe(prevLength - 1);
        done();
    })
})