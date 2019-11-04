const context = require('../../IoC/context').newContext();

const db = context('db')(context);

afterAll(async (done) => {
    await db.connection.close();
    done();
});

describe("Test review queries", () => {

    let createdPublications;
    let createdUsers;
    let createdReviews;
    let errorCaught = false;

    beforeEach(async (done) => {
        await db.Publication.deleteMany();
        await db.User.deleteMany();
        await db.Review.deleteMany();

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
            }
        ]);
        createdReviews = await db.Review.insertMany([
            {
                user: createdUsers[0]._id,
                publication: createdPublications[0]._id,
                rating: 2
            },
            {
                user: createdUsers[1]._id,
                publication: createdPublications[0]._id,
                rating: 4
            }
        ]);

        errorCaught = false;

        done();
    });

    describe("getAllReviews", () => {
        it("should get all reviews", async (done) => {
            let allReviews;
            try{
                allReviews = await db.Review.getAllReviews();
            } catch(e) {
                errorCaught = true;
            }
            expect(errorCaught).toBe(false);
            expect(allReviews.length).toBe(2);
            expect(createdReviews[0].user).toEqual(allReviews[0].user);
            expect(createdReviews[0].publication).toEqual(allReviews[0].publication);
            expect(createdReviews[0].rating).toEqual(allReviews[0].rating);
            expect(createdReviews[1].user).toEqual(allReviews[1].user);
            done();
        });

        it("it should return an empty array", async (done) => {
            await db.Review.deleteMany();
            let allReviews;
            try{
                allReviews = await db.Review.getAllReviews();
            } catch(e) {
                errorCaught = true;
            }
            expect(errorCaught).toBe(false);
            expect(allReviews.length).toBe(0);
            done();
        });
    });

    describe("getReviewsByPublicationId", () => {
        it("it should return a review", async (done) => {
            let reviews;
            try{
                reviews = await db.Review.getReviewsByPublicationId(createdPublications[0]._id);
            } catch(e) {
                errorCaught = true;
            }
            expect(errorCaught).toBe(false);
            expect(reviews.length).toBe(2);
            done();
        });
        it("should throw error because of an invalid id", async (done) => {
            let reviews;
            try {
                reviews = await db.Review.getReviewsByPublicationId("hehe");
            } catch (e) {
                errorCaught = true;
                expect(e.name).toBe("CastError");
            }
            expect(errorCaught).toEqual(true);
            expect(reviews).toBeUndefined();
            done();
        });
        it("should return null as no reviews are found for publication", async (done) => {
            let reviews;
            try {
                reviews = await db.Review.getReviewsByPublicationId(createdPublications[1]._id);
            } catch (e) {
                errorCaught = true;
            }

            expect(errorCaught).toEqual(false);
            expect(reviews.length).toBe(0);
            done();
        });
    });

    describe("getReviewsByUserId", () => {
        it("it should return a review", async (done) => {
            let reviews;
            try{
                reviews = await db.Review.getReviewsByUserId(createdUsers[0]._id);
            } catch(e) {
                errorCaught = true;
            }
            expect(errorCaught).toBe(false);
            expect(reviews.length).toBe(1);
            done();
        });
        it("should throw error because of an invalid id", async (done) => {
            let reviews;
            try {
                reviews = await db.Review.getReviewsByUserId("hehe");
            } catch (e) {
                errorCaught = true;
                expect(e.name).toBe("CastError");
            }
            expect(errorCaught).toEqual(true);
            expect(reviews).toBeUndefined();
            done();
        });
        it("should return empty list as no reviews are found for user", async (done) => {
            let reviews;
            try {
                reviews = await db.Review.getReviewsByUserId(createdUsers[2]._id);
            } catch (e) {
                errorCaught = true;
            }

            expect(errorCaught).toEqual(false);
            expect(reviews.length).toBe(0);
            done();
        });
    });
    describe("getReviewByPublicationAndUserId", () => {
        it("it should return a review", async (done) => {
            let review;
            try{
                review = await db.Review.getReviewByPublicationAndUserId(createdPublications[0]._id,createdUsers[0]._id);
            } catch(e) {
                errorCaught = true;
            }
            expect(errorCaught).toBe(false);
            expect(review._id).toEqual(createdReviews[0]._id);
            done();
        });
        it("should throw error because of an invalid publication id", async (done) => {
            let review;
            try {
                review = await db.Review.getReviewByPublicationAndUserId("hehe", createdUsers[0]._id);
            } catch (e) {
                errorCaught = true;
                expect(e.name).toBe("CastError");
            }
            expect(errorCaught).toEqual(true);
            expect(review).toBeUndefined();
            done();
        });
        it("should throw error because of an invalid user id", async (done) => {
            let review;
            try {
                review = await db.Review.getReviewByPublicationAndUserId( createdPublications[0]._id, "hehe");
            } catch (e) {
                errorCaught = true;
                expect(e.name).toBe("CastError");
            }
            expect(errorCaught).toEqual(true);
            expect(review).toBeUndefined();
            done();
        });
        it("should return null as no review is found for user on this publication", async (done) => {
            let review;
            try {
                review = await db.Review.getReviewByPublicationAndUserId(createdPublications[1]._id, createdUsers[0]._id);
            } catch (e) {
                errorCaught = true;
            }

            expect(errorCaught).toEqual(false);
            expect(review).toBeNull();
            done();
        });
    });

    describe("createUserReview", () => {
        it("Should create and return a user review", async (done) => {
            let review;
            try {
                review = await db.Review.createUserReview({
                    user: createdUsers[0],
                    publication: createdPublications[1],
                    rating: 5
                });
            } catch (e) {
                errorCaught = true;
            }

            expect(errorCaught).toEqual(false);
            expect(review.rating).toBe(5);
            done();
        });

        it("Should throw ValidationError because of missing all required fields", async (done) => {
            let review;
            try {
                review = await db.Review.createUserReview({
                });
            } catch (e) {
                errorCaught = true;
                expect(e.name).toBe("ValidationError");
                expect(e.errors.user).toBeDefined();
                expect(e.errors.publication).toBeDefined();
                expect(e.errors.rating).toBeDefined();
            }

            expect(errorCaught).toEqual(true);
            expect(review).toBeUndefined();
            done();
        });

        it("Should throw ValidationError because of missing user", async (done) => {
            let review;
            try {
                review = await db.Review.createUserReview({
                    publication: createdPublications[1],
                    rating: 5
                });
            } catch (e) {
                errorCaught = true;
                expect(e.name).toBe("ValidationError");
                expect(e.errors.user).toBeDefined();
                expect(e.errors.publication).toBeUndefined();
                expect(e.errors.rating).toBeUndefined();
            }

            expect(errorCaught).toEqual(true);
            expect(review).toBeUndefined();
            done();
        });

        it("Should throw ValidationError because of missing publication", async (done) => {
            let review;
            try {
                review = await db.Review.createUserReview({
                    user: createdUsers[0],
                    rating: 5
                });
            } catch (e) {
                errorCaught = true;
                expect(e.name).toBe("ValidationError");
                expect(e.errors.publication).toBeDefined();
                expect(e.errors.user).toBeUndefined();
                expect(e.errors.rating).toBeUndefined();
            }

            expect(errorCaught).toEqual(true);
            expect(review).toBeUndefined();
            done();
        });

        it("Should throw ValidationError because of missing publication", async (done) => {
            let review;
            try {
                review = await db.Review.createUserReview({
                    user: createdUsers[0],
                    publication: createdPublications[1]
                });
            } catch (e) {
                errorCaught = true;
                expect(e.name).toBe("ValidationError");
                expect(e.errors.rating).toBeDefined();
                expect(e.errors.user).toBeUndefined();
                expect(e.errors.publication).toBeUndefined();
            }

            expect(errorCaught).toEqual(true);
            expect(review).toBeUndefined();
            done();
        });

        it("Should throw error because of invalid user id", async (done) => {
            let review;
            try {
                review = await db.Review.createUserReview({
                    user: bla,
                    publication: createdPublications[1],
                    rating: 5
                });
            } catch (e) {
                errorCaught = true;
            }

            expect(errorCaught).toEqual(true);
            expect(review).toBeUndefined();
            done();
        });
        it("Should throw ValidationError because of invalid rating", async (done) => {
            let review;
            try {
                review = await db.Review.createUserReview({
                    user: createdUsers[0],
                    publication: createdPublications[1],
                    rating: 6
                });
            } catch (e) {
                errorCaught = true;
            }

            expect(errorCaught).toEqual(true);
            expect(review).toBeUndefined();
            done();
        });
    });
    describe("updateUserReview", () => {
        it("should update and return updated review", async (done) => {
            let testReview = createdReviews[0];
            let review;
            try {
                review = await db.Review.updateUserReview(testReview.publication, testReview.user, {
                    rating: 4
                });
            } catch (e) {
                errorCaught = true;
            }

            expect(errorCaught).toEqual(false);
            expect(review.rating).toBe(4);
            done();
        });

        it("should throw validationError because of invalid rating", async (done) => {
            let testReview = createdReviews[0];
            let review;
            try {
                review = await db.Review.updateUserReview(testReview.publication, testReview.user, {
                    rating: 7
                });
            } catch (e) {
                errorCaught = true;
            }

            expect(errorCaught).toEqual(true);
            expect(review).toBeUndefined();
            done();
        });

        it("should throw invalid publicationId", async (done) => {
            let testReview = createdReviews[0];
            let review;
            try {
                review = await db.Review.updateUserReview("hehe", testReview.user, {
                    rating: 4
                });
            } catch (e) {
                errorCaught = true;
            }

            expect(errorCaught).toEqual(true);
            expect(review).toBeUndefined();
            done();
        });
        it("should throw invalid userId", async (done) => {
            let testReview = createdReviews[0];
            let review;
            try {
                review = await db.Review.updateUserReview(testReview.publication, "hehe", {
                    rating: 4
                });
            } catch (e) {
                errorCaught = true;
            }

            expect(errorCaught).toEqual(true);
            expect(review).toBeUndefined();
            done();
        });
    });
    describe("removeUserReview", () => {
        it("should delete and return deleted review", async (done) => {
            let testReview = createdReviews[0];
            let review;
            try {
                review = await db.Review.removeUserReview(testReview.publication, testReview.user);
            } catch (e) {
                errorCaught = true;
            }

            const findDeletedReview = await db.Review.getReviewByPublicationAndUserId(testReview.publication, testReview.user);

            expect(errorCaught).toEqual(false);
            expect(review).toBeDefined();
            expect(findDeletedReview).toBeNull();
            done();
        });

        it("should throw invalid publicationID", async (done) => {
            let review;
            try {
                review = await db.Review.removeUserReview("hello", testReview.user);
            } catch (e) {
                errorCaught = true;
            }

            expect(errorCaught).toEqual(true);
            expect(review).toBeUndefined();

            done();
        });
        it("should throw invalid userID", async (done) => {
            let review;
            try {
                review = await db.Review.removeUserReview( testReview.publication, "hello");
            } catch (e) {
                errorCaught = true;
            }

            expect(errorCaught).toEqual(true);
            expect(review).toBeUndefined();

            done();
        });
        
    });
    describe("getRecommendationExcludingBorrowed", () => {
        it("should return a list with one publication", async (done) => {
            let reviews;
            try {
                reviews = await db.Review.getRecommendationExcludingBorrowed([createdPublications[1]._id]);
            } catch (e) {
                errorCaught = true;
            }
            expect(errorCaught).toEqual(false);
            expect(reviews.length).toBe(1);
            done();
        });

        it("should return a list with no publications", async (done) => {
            let reviews;
            try {
                reviews = await db.Review.getRecommendationExcludingBorrowed([createdPublications[0]._id]);
            } catch (e) {
                errorCaught = true;
            }
            expect(errorCaught).toEqual(false);
            expect(reviews.length).toBe(0);
            done();
        });
        
    });

});