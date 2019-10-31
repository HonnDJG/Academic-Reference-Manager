module.exports = (context) => {
    const express = context("express");
    const router = express.Router();
    const publicationService = require("../services/publicationsService");
    // publication information
    router.get("/", (req, res) => {
        // TODO: Get information about all Publications
        publicationService.getAllPublications(
            function(publications){
                return res.status(200).json(publications);
            },
            function(err) {
                return res.status(400).json(err);
            }
        );
        res.send();
    });

    router.post("/", (req, res) => {
        // TODO: Add a publication
        res.send("Add a publication");
    });

    router.get("/:publication_id", (req, res) => {
        // TODO: Get information about a specific publication (including borrowing history)
        res.send("Get information about a specific publication (including borrowing history)");
    });



    // reviews related information
    router.get("/reviews", (req, res) => {
        // TODO: Get reviews for all Publications
        res.send("Get reviews for all Publications")
    });

    router.get("/:publication_id/reviews", (req, res) => {
        // TODO: Get all reviews for a given publication
        res.send("Get all reviews for a given publication");
    });

    router.get("/:publication_id/reviews/:user_id", (req, res) => {
        // TODO: Get a user’s review for a publication
        res.send("Get a user’s review for a publication");
    });

    router.put("/:publication_id/reviews/:user_id", (req, res) => {
        // TODO: Update a user’s review
        res.send("Update a user’s review");
    });

    router.delete("/:publication_id/reviews/:user_id", (req, res) => {
        // TODO: Remove a user’s review
        res.send("Remove a user’s review");
    });


    return router;

}