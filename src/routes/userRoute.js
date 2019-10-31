module.exports = (context) => {
    const express = context("express");
    const router = express.Router();
    const userService = context('userService')(context);

    // users information
    router.get("/", (req, res) => {
        userService.getAllUsers(
            req.query,
            (result) => res.send(result),
            (status, error) => res.status(status).send(error)
        )
    });

    router.post("/", (req, res) => {
        // TODO: Add a user
        res.send("Add a user");
    });

    router.get("/:user_id", (req, res) => {
        const { user_id } = req.params;
        userService.getUserById(
            user_id,
            (result) => res.send(result),
            (status, error) => res.status(status).send(error)
        )
    });

    router.delete("/:user_id", (req, res) => {
        // TODO: Remove a user
        res.send("Remove a user");
    });

    router.put("/:user_id", (req, res) => {
        // TODO: Update a user
        res.send("Update a user");
    });





    // publications related information
    router.get("/:user_id/publications", (req, res) => {
        // TODO: Get information about the Publications a given user has on loan
        res.send("Get information about the Publications a given user has on loan");
    });

    router.post("/:user_id/publications/:publication_id", (req, res) => {
        // TODO: Register a publication on loan
        res.send("Register a publication on loan");
    });

    router.delete("/:user_id/publications/:publication:id", (req, res) => {
        // TODO: Return a publication
        res.send("Return a publication");
    });

    router.put("/:user_id/publications/:publication:id", (req, res) => {
        // TODO: Update borrowing information
        res.send("Update borrowing information");
    });




    // Reviews related information
    router.get("/:user_id/reviews", (req, res) => {
        // TODO: Get reviews by a given user
        res.send("Get reviews by a given user");
    });

    router.get("/:user_id/reviews/:publication_id", (req, res) => {
        // TODO: Get user reviews for a given publication
        res.send("Get user reviews for a given publication");
    });

    router.post("/:user_id/reviews/:publication_id", (req, res) => {
        // TODO: Add a user review for a publication
        res.send("Add a user review for a publication");
    });

    router.put("/:user_id/reviews/:publication_id", (req, res) => {
        // TODO: Update publication review
        res.send("Update publication review");
    })

    router.get("/:user_id/recommendation", (req, res) => {
        // TODO: Get a recommendation for a given user
        res.send("Get a recommendation for a given user");
    });


    return router;
}