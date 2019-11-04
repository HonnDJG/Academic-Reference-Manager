const context = require('../IoC/context').newContext();
const db = context('db')(context);
const server = context('server')(context);
const supertest = require('supertest')
const app = server.app;
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
            "return_date": null
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
describe("Tests publication routes", () => {
    // User tests
    it('should create a new publication', async done => {
        const response = await request.post('/publications').set("Authorization", "admin")
            .send(
                {
                    "editor_last_name": "Shade",
                    "type": "printed",
                    "journal": "IGI Global",
                    "year": 2013,
                    "editor_first_name": "Dyane",
                    "publication_title": "Cacatua tenuirostris",
                    "isbn": "532571600-X"
                });
        expect(response.status).toBe(201);
        done();
    })

    it('should get all publications', async done => {
        const response = await request.get('/publications').set("Authorization", "admin");
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(3); // Gets two users, one added in by beforeAll and one created in POST test
        done();
    })

    it('should get publications with LoanDate query', async done => {
        const response = await request.get('/publications?LoanDate=2019-08-07').set("Authorization", "admin");
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        done();
    })

    it('should get publications with LoanDuration query', async done => {
        const response = await request.get('/publications?LoanDuration=10').set("Authorization", "admin");
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        done();
    })

    it('should get publications with loandate and LoanDuration query', async done => {
        const response = await request.get('/publications?LoanDate=2019-08-15&LoanDuration=10').set("Authorization", "admin");
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        done();
    })

    it('should get the publication with given ID"', async done => {
        const response = await request.get('/publications/5dbf564e0ade253c5a4c777a').set("Authorization", "admin");
        expect(response.status).toBe(200);
        expect(response.body._id).toBe("5dbf564e0ade253c5a4c777a");
        done();
    })

    it('should update the publication with given ID"', async done => {
        const response = await request.put("/publications/5dbf564e0ade253c5a4c777a").set("Authorization", "admin")
            .send(
                {
                    "editor_last_name": "Bane",
                });
        const get = await request.get('/publications/5dbf564e0ade253c5a4c777a').set("Authorization", "admin");
        expect(response.status).toBe(200);
        expect(get.body.editor_last_name).toBe("Bane");
        done();
    })

    it('should get all reviews', async done => {
        const response = await request.get("/publications/reviews").set("Authorization", "admin");
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        done();
    })

    it('should get all reviews a publication has', async done => {
        const response = await request.get("/publications/5dbf564e0ade253c5a4c7779/reviews").set("Authorization", "admin");
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        done();
    })

    it('should get review for given publication from a user with a given ID has left', async done => {
        const response = await request.get("/publications/5dbf564e0ade253c5a4c7779/reviews/5dbf564e0ade253c5a4c7b60").set("Authorization", "admin")
        expect(response.status).toBe(200);
        expect(response.body.rating).toBe(3);
        done();
    })

    it('should update the review given user and publication ID"', async done => {
        const response = await request.put("/publications/5dbf564e0ade253c5a4c7779/reviews/5dbf564e0ade253c5a4c7b60").set("Authorization", "admin")
            .send(
                {
                    "rating": "1",
                });
        const get = await request.get('/publications/5dbf564e0ade253c5a4c7779/reviews/5dbf564e0ade253c5a4c7b60').set("Authorization", "admin");
        expect(response.status).toBe(200);
        expect(get.body.rating).toBe(1);
        done();
    })
    
    // User tests fails
    it('posts a new publication without a title, should catch an error', async done => {
        const response = await request.post('/publications').set("Authorization", "admin")
            .send(
                {
                    "editor_last_name": "Shade",
                    "type": "printed",
                    "journal": "IGI Global",
                    "year": 2013,
                    "editor_first_name": "Dyane",
                    "isbn": "532571600-X"
                });
        expect(response.status).toBe(412);
        expect(response.body.message[0]).toBe('Path `publication_title` is required.')
        done();
    })

    it('gets the publications endpoint', async done => {
        const response = await request.get('/users').set("Authorization", "user");
        expect(response.status).toBe(401);
        done();
    })

    it('should try to get user that does not exist and return 404"', async done => {
        const response = await request.get('/publications/5dbf564e0ade253c5a4c7000').set("Authorization", "admin");
        expect(response.status).toBe(404);
        done();
    })

    it('should try to update user that does not exist and return 404"', async done => {
        const response = await request.put("/publications/5dbf564e0ade253c5a4c7000").set("Authorization", "admin")
            .send(
                {
                    "editor_last_name": "Bane",
                });;
        expect(response.status).toBe(404);
        done();
    })

        // Reviews

        it('should try get all reviews for publications that does not exist and fail', async done => {
            const response = await request.get("/publications/5dbf564e0ade253c5a4c7000/reviews").set("Authorization", "admin");
            expect(response.status).toBe(404);
            done();
        })

        it('should get review for publication from user that does not exist and fail', async done => {
            const response = await request.get("/publications/5dbf564e0ade253c5a4c7779/reviews/5dbf564e0ade253c5a4c7000").set("Authorization", "admin")
            expect(response.status).toBe(404);
            done();
        })

        it('should try to update the review given user and publication ID that does not exist and fail"', async done => {
            const response = await request.put("/publications/5dbf564e0ade253c5a4c7b60/reviews/5dbf564e0ade253c5a4c7000").set("Authorization", "admin")
                .send(
                    {
                        "rating": "1",
                    });
            expect(response.status).toBe(404);
            done();
        })

        // Testing Deletes
        it('should try to delete review and fail because publication does not exist"', async done => {
            const response = await request.delete('/publications/5dbf564e0ade253c5a4c777a/reviews/5dbf564e0ade253c5a4c7000').set("Authorization", "admin");
            expect(response.status).toBe(404);
            done();
        })

        it('should try to delete the publication with given ID that does not exist and fail', async done => {
            const response = await request.delete('/publications/5dbf564e0ade253c5a4c7000').set("Authorization", "admin");
            expect(response.status).toBe(404);
            done();
        })
        
        // Testing Deletes
        it('should delete given review for publication with given ID"', async done => {
            let get = await request.get('/publications/5dbf564e0ade253c5a4c7779/reviews').set("Authorization", "admin");
            let prevLength = get.body.length;
            const response = await request.delete('/publications/5dbf564e0ade253c5a4c7779/reviews/5dbf564e0ade253c5a4c7b60').set("Authorization", "admin");
            get = await request.get('/publications/5dbf564e0ade253c5a4c7779/reviews').set("Authorization", "admin");
            expect(response.status).toBe(200);
            expect(get.body.length).toBe(prevLength - 1);
            done();
        })
    
        it('should delete the user with given ID', async done => {
            let get = await request.get('/publications').set("Authorization", "admin");
            let prevLength = get.body.length;
            const response = await request.delete('/publications/5dbf564e0ade253c5a4c7779').set("Authorization", "admin");
            get = await request.get('/publications').set("Authorization", "admin");
            expect(response.status).toBe(200);
            expect(get.body.length).toBe(prevLength - 1);
            done();
        })
})