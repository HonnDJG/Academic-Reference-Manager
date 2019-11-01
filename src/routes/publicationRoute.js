module.exports = (context) => {
    const express = context("express");
    const router = express.Router();
    const publicationService = context('publicationService')(context);
    const permit = context('permission');

    /// GET
    router.get("/", (req, res) => {
        // TODO: Get information about all Publications
        publicationService.getAllPublications(
            (result) => res.send(result),
            (status, error) => res.status(status).send(error)
        );
    });

    router.get("/reviews", (req, res) => {
        // TODO: Get reviews for all Publications
        publicationService.getAllReviews(
            (result) => res.send(result),
            (status, error) => res.status(status).send(error)
        );
    });

    router.get("/:publication_id/reviews", (req, res) => {
        // TODO: Get all reviews for a given publication
        publicationService.getReviewsByPublicationId(
            req.params.publication_id,
            (result) => res.send(result),
            (status, error) => res.status(status).send(error)
        );
    });

    router.get("/:publication_id", (req, res) => {
        // TODO: Get information about a specific publication (including borrowing history)
        publicationService.getPublicationById(
            req.params.publication_id,
            (result) => res.send(result),
            (status, error) => res.status(status).send(error)
        );
    });

    router.get("/:publication_id/reviews/:user_id", (req, res) => {
        // TODO: Get a user’s review for a publication
        publicationService.getReviewByPublicationAndUserId(
            req.params.publication_id,
            req.params.user_id,
            (result) => res.send(result),
            (status, error) => res.status(status).send(error)
        );
    });

    /// POST

    router.post("/", (req, res) => {
        // TODO: Add a publication
        publicationService.createPublication(
            req.body,
            (result) => res.send(result),
            (status, error) => res.status(status).send(error)
        );
    });

    /// DELETE

    router.delete("/:publication_id", (req, res) => {
        publicationService.removePublicationById(
            req.params.publication_id,
            (result) => res.send(result),
            (status, error) => res.status(status).send(error)
        );
    });

    /// UPDATE

    router.put("/:publication_id", (req, res) => {
        publicationService.updatePublicationById(
            req.params.publication_id,
            req.body,
            (result) => res.send(result),
            (status, error) => res.status(status).send(error)
        );
    });





    router.put("/:publication_id/reviews/:user_id", (req, res) => {
        // TODO: Get a user’s review for a publication
        const review = req.body;
        publicationService.updateUserReview(
            req.params.publication_id,
            req.params.user_id,
            review,
            (result) => res.send(result),
            (status, error) => res.status(status).send(error)
        );
    });

    router.delete("/:publication_id/reviews/:user_id", (req, res) => {
        // TODO: Get a user’s review for a publication
        publicationService.removeUserReview(
            req.params.publication_id,
            req.params.user_id,
            (result) => res.send(result),
            (status, error) => res.status(status).send(error)
        );
    });


    return router;

}