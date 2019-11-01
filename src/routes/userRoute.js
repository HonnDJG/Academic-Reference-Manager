module.exports = (context) => {
    const express = context("express");
    const router = express.Router();
    const userService = context('userService')(context);

    // users information
    router.get("/", async (req, res) => {
        const { query } = req;
        const { loanDate, loanDuration } = query;
        try {
            let users;
            if (loanDate && loanDuration) {
                users = await userService.getUsersByDateAndDuration(query);
            } else if (loanDate) {
                users = await userService.getUsersByDate(query);
            } else if (loanDuration) {
                users = await userService.getUsersByDuration(query);
            } else {
                users = await userService.getAllUsers(query);
            }
            res.send(users);
        } catch (e) {
            const message = e.output.payload;
            res.status(message.statusCode).send(message);
        }
    });

    router.post("/", async (req, res) => {
        try {
            user = await userService.createUser(req.body);
            res.send(user);
        } catch (e) {
            const message = e.output.payload;
            res.status(message.statusCode).send(message);
        }
    });

    router.get("/:user_id", async (req, res) => {
        const { user_id } = req.params;
        try {
            user = await userService.getUserById(user_id);
            res.send(user);
        } catch (e) {
            const message = e.output.payload;
            res.status(message.statusCode).send(message);
        }
    });

    router.delete("/:user_id", async (req, res) => {
        const { user_id } = req.params;
        try {
            user = await userService.deleteUser(user_id);
            res.send(user);
        } catch (e) {
            const message = e.output.payload;
            res.status(message.statusCode).send(message);
        }
    });

    router.put("/:user_id", async (req, res) => {
        const { user_id } = req.params;
        try {
            user = await userService.updateUser(user_id,req.body);
            res.send(user);
        } catch (e) {
            const message = e.output.payload;
            res.status(message.statusCode).send(message);
        }
    });





    // publications related information
    router.get("/:user_id/publications", async (req, res) => {
        const { user_id } = req.params;
        try {
            publications = await userService.getPublicationByUserId(user_id);
            res.send(publications);
        } catch (e) {
            const message = e.output.payload;
            res.status(message.statusCode).send(message);
        }
    });

    router.post("/:user_id/publications/:publication_id", async (req, res) => {
        try {
            loan = await userService.loanPublication(req.params.user_id, req.params.publication_id, req.body);
            res.send(loan)
        } catch (e) {
            const message = e.output.payload;
            res.status(message.statusCode).send(message);
        }
    });

    router.delete("/:user_id/publications/:publication:id", (req, res) => {
        // TODO: Return a publication
        res.send("Return a publication");
    });

    router.put("/:user_id/publications/:publication_id", async (req, res) => {
        try {
            loan = await userService.updateLoan(req.params.user_id, req.params.publication_id, req.body);
            res.send(loan)
        } catch (e) {
            const message = e.output.payload;
            res.status(message.statusCode).send(message);
        }
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