const context = require('../../IoC/context').newContext();

const db = context('db')(context);

afterAll(async (done) => {
    await db.connection.close();
    done();
});

describe("Test Publication queries", () => {

    let createdPublications;
    let errorCaught = false;

    beforeEach(async (done) => {
        await db.Publication.deleteMany();
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
            },
            {
                editor_first_name: "editor3",
                publication_title: "publication3",
                isbn: "isbn3",
            },
            {
                editor_first_name: "editor4",
                publication_title: "publication4",
                isbn: "isbn4",
            }
        ]);

        errorCaught = false;

        done();
    });

    describe("getAllpublications", () => {
        it("should get all publications", async (done) => {
            let allPublications;
            try{
                allPublications = await db.Publication.getAllPublications();
            } catch(e) {
                errorCaught = true;
            }
            expect(errorCaught).toBe(false);
            expect(createdPublications[0].editor_first_name).toEqual(allPublications[0].editor_first_name);
            expect(createdPublications[0].publication_title).toEqual(allPublications[0].publication_title);
            expect(createdPublications[0].isbn).toEqual(allPublications[0].isbn);
            expect(createdPublications[1].editor_first_name).toEqual(allPublications[1].editor_first_name);
            expect(createdPublications[2].editor_first_name).toEqual(allPublications[2].editor_first_name);
            expect(createdPublications[3].editor_first_name).toEqual(allPublications[3].editor_first_name);
            done();
        });

        it("it should return an empty array", async (done) => {
            await db.Publication.deleteMany();
            let allPublications;
            try{
                allPublications = await db.Publication.getAllPublications();
            } catch(e) {
                errorCaught = true;
            }
            expect(errorCaught).toBe(false);
            expect(allPublications.length).toBe(0);
            done();
        });
    });

    describe("checkExistence", () => {
        it("should not throw as publication was found", async (done) => {
            const publication = await db.Publication.findOne();

            try {
                await db.Publication.checkExistence(publication._id);
            } catch (e) {
                errorCaught = true;
            }
            expect(errorCaught).toEqual(false);

            done();
        });

        it("should throw Cast when ID is invalid", async (done) => {
            try {
                await db.Publication.checkExistence("123");
            } catch (e) {
                errorCaught = true;
                expect(e.name).toBe("CastError");
            }
            expect(errorCaught).toEqual(true);

            done();
        });

        it("should throw not found error", async (done) => {
            try {
                await db.Publication.checkExistence("123123123123");
            } catch (e) {
                errorCaught = true;
                expect(e.output.payload.error).toBe("Not Found");
            }
            expect(errorCaught).toEqual(true);

            done();
        });
    });

    describe("createPublication", () => {
        it("Should create and return a basic publication", async (done) => {
            let publication;
            try {
                publication = await db.Publication.createPublication({
                    editor_first_name: "editor",
                    publication_title: "publication",
                    isbn: "isbn"
                });
            } catch (e) {
                errorCaught = true;
            }

            expect(errorCaught).toEqual(false);
            expect(publication.editor_first_name).toBe("editor");
            done();
        });

        it("Should throw ValidationError because of missing all required fields", async (done) => {
            let publication;
            try {
                publication = await db.Publication.createPublication({
                    editor_last_name: "editor"
                });
            } catch (e) {
                errorCaught = true;
                expect(e.name).toBe("ValidationError");
                expect(e.errors.editor_first_name).toBeDefined();
                expect(e.errors.publication_title).toBeDefined();
                expect(e.errors.isbn).toBeDefined();
            }

            expect(errorCaught).toEqual(true);
            expect(publication).toBeUndefined();
            done();
        });

        it("Should throw ValidationError because of missing isbn", async (done) => {
            let publication;
            try {
                publication = await db.Publication.createPublication({
                    editor_first_name: "editor",
                    publication_title: "publication"
                });
            } catch (e) {
                errorCaught = true;
                expect(e.name).toBe("ValidationError");
                expect(e.errors.isbn).toBeDefined();
                expect(e.errors.editor_first_name).toBeUndefined();
                expect(e.errors.publication_title).toBeUndefined();
            }

            expect(errorCaught).toEqual(true);
            expect(publication).toBeUndefined();
            done();
        });

        it("Should throw ValidationError because of missing publication_title", async (done) => {
            let publication;
            try {
                publication = await db.Publication.createPublication({
                    editor_first_name: "editor",
                    isbn: "isbn",
                });
            } catch (e) {
                errorCaught = true;
                expect(e.name).toBe("ValidationError");
                expect(e.errors.isbn).toBeUndefined();
                expect(e.errors.editor_first_name).toBeUndefined();
                expect(e.errors.publication_title).toBeDefined();
            }

            expect(errorCaught).toEqual(true);
            expect(publication).toBeUndefined();
            done();
        });

        it("Should throw ValidationError because of missing editor_first_name", async (done) => {
            let publication;
            try {
                publication = await db.Publication.createPublication({
                    publication_title: "publication",
                    isbn: "isbn",
                });
            } catch (e) {
                errorCaught = true;
                expect(e.name).toBe("ValidationError");
                expect(e.errors.isbn).toBeUndefined();
                expect(e.errors.publication_title).toBeUndefined();
                expect(e.errors.editor_first_name).toBeDefined();
            }

            expect(errorCaught).toEqual(true);
            expect(publication).toBeUndefined();
            done();
        });
    });
    describe("getPublicationById", () => {
        it("should find a publication", async (done) => {
            const testPublication = await db.Publication.findOne();
            let publication;
            try {
                publication = await db.Publication.getPublicationById(testPublication._id);
            } catch (e) {
                errorCaught = true;
            }

            expect(errorCaught).toEqual(false);
            expect(publication.editor_first_name).toBeDefined();
            done();
        });

        it("should return null as publication not found", async (done) => {
            let publication;
            try {
                publication = await db.Publication.getPublicationById("123123123123");
            } catch (e) {
                errorCaught = true;
            }

            expect(errorCaught).toEqual(false);
            expect(publication).toBeNull();
            done();
        });

        it("should throw error because of invalid id", async (done) => {
            let publication;
            try {
                publication = await db.Publication.getPublicationById("hehe");
            } catch (e) {
                errorCaught = true;
                expect(e.name).toBe("CastError");
            }
            expect(errorCaught).toEqual(true);
            expect(publication).toBeUndefined();
            done();
        });
    });

    describe("removePublicationById", () => {
        it("should delete and return deleted publication", async (done) => {
            const testPublication = await db.Publication.findOne();
            let publication;
            try {
                publication = await db.Publication.removePublicationById(testPublication._id);
            } catch (e) {
                errorCaught = true;
            }

            const findDeletedPublication = await db.Publication.findById(testPublication._id);

            expect(errorCaught).toEqual(false);
            expect(publication).toBeDefined();
            expect(findDeletedPublication).toBeNull();
            done();
        });

        it("should throw invalid ID", async (done) => {
            let publication;
            try {
                publication = await db.Publication.removePublicationById("hello");
            } catch (e) {
                errorCaught = true;
                expect(e.name).toEqual("CastError");
            }

            expect(errorCaught).toEqual(true);
            expect(publication).toBeUndefined();

            done();
        });
    });
    describe("updatePublicationById", () => {
        it("should update and return updated publication", async (done) => {
            const testPublication = await db.Publication.findOne();
            let publication;
            try {
                publication = await db.Publication.updatePublicationById(testPublication._id, {
                    editor_first_name: "newEditor"
                });
            } catch (e) {
                errorCaught = true;
            }

            expect(errorCaught).toEqual(false);
            expect(publication.editor_first_name).toBe("newEditor");
            done();
        });

        it("should throw validationError because of invalid type", async (done) => {
            const testPublication = await db.Publication.findOne();
            let publication;
            try {
                publication = await db.Publication.updatePublicationById(testPublication._id, {
                    type: "nonType"
                });
            } catch (e) {
                errorCaught = true;
                expect(e.name).toBe("ValidationError");
            }

            expect(errorCaught).toEqual(true);
            expect(publication).toBeUndefined();
            done();
        });

        it("should throw invalid ID", async (done) => {
            let publication;
            try {
                publication = await db.Publication.updatePublicationById("hello", {
                    editor_first_name: "newEditor"
                });
            } catch (e) {
                errorCaught = true;
                expect(e.name).toEqual("CastError");
            }

            expect(errorCaught).toEqual(true);
            expect(publication).toBeUndefined();

            done();
        });
    });

});