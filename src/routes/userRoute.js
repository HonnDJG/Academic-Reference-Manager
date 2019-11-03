module.exports = (context) => {
    const express = context("express");
    const router = express.Router();
    const userService = context('userService')(context);
    const publicationService = context('publicationService')(context);
    const reviewService = context('reviewService')(context);


    // users information
    router.get("/", async (req, res) => {
        const { query } = req;
        const { loanDate, loanDuration } = query;
        try {
            let users;
            if (loanDate && loanDuration) {
                users = await userService.getUsersByDateAndDuration(query);
            } else if (loanDate) {
                users = await userService.getUsersOnLoanByDate(query);
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
            const user = await userService.createUser(req.body);
            res.send(user);
        } catch (e) {
            const message = e.output.payload;
            res.status(message.statusCode).send(message);
        }
    });

    router.get("/:u_id", async (req, res) => {
        const { u_id } = req.params;
        try {
            const user = await userService.getUserById(u_id);
            res.send(user);
        } catch (e) {
            const message = e.output.payload;
            res.status(message.statusCode).send(message);
        }
    });

    router.delete("/:u_id", async (req, res) => {
        const { u_id } = req.params;
        try {
            const user = await userService.deleteUser(u_id);
            res.send(user);
        } catch (e) {
            const message = e.output.payload;
            res.status(message.statusCode).send(message);
        }
    });

    router.put("/:u_id", async (req, res) => {
        const { u_id } = req.params;
        try {
            const user = await userService.updateUser(u_id, req.body);
            res.send(user);
        } catch (e) {
            console.log(e);
            const message = e.output.payload;
            res.status(message.statusCode).send(message);
        }
    });





    // publications related information
    router.get("/:u_id/publications", async (req, res) => {
        const { u_id } = req.params;
        try {
            const publications = await publicationService.getPublicationsOnLoanByUserId(u_id);
            res.send(publications);
        } catch (e) {
            const message = e.output.payload;
            res.status(message.statusCode).send(message);
        }
    });

    router.post("/:u_id/publications/:p_id", async (req, res) => {
        try {
            const loan = await publicationService.loanPublication(req.params.u_id, req.params.p_id, req.body);
            res.send(loan)
        } catch (e) {
            const message = e.output.payload;
            res.status(message.statusCode).send(message);
        }
    });

    router.delete("/:u_id/publications/:p_id", async (req, res) => {
        try {
            const loan = await publicationService.returnPublication(req.params.u_id, req.params.p_id);
            res.send(loan)
        } catch (e) {
            const message = e.output.payload;
            res.status(message.statusCode).send(message);
        }
    });

    router.put("/:u_id/publications/:p_id", async (req, res) => {
        try {
            const loan = await publicationService.updateLoan(req.params.u_id, req.params.p_id, req.body);
            res.send(loan)
        } catch (e) {
            const message = e.output.payload;
            res.status(message.statusCode).send(message);
        }
    });




    // Reviews related information
    router.get("/:u_id/reviews", async (req, res) => {
        try {
            const reviews = await reviewService.getReviewsByUserId(req.params.u_id);
            res.send(reviews);
        } catch (e) {
            const message = e.output.payload;
            res.status(message.statusCode).send(message);
        }
    });

    router.get("/:u_id/reviews/:p_id", async (req, res) => {
        const { u_id, p_id } = req.params;
        try {
            const reviews = await reviewService.getReviewsByPublicationAndUserId(p_id, u_id);
            res.send(reviews);
        } catch (e) {
            const message = e.output.payload;
            res.status(message.statusCode).send(message);
        }
    });

    router.post("/:u_id/reviews/:p_id", async (req, res) => {
        const { u_id, p_id } = req.params;
        try {
            const result = await reviewService.createUserReview(p_id, u_id, req.body);
            res.send(result);
        } catch (e) {
            const message = e.output.payload;
            res.status(message.statusCode).send(message);
        }
    });

    router.delete("/:u_id/reviews/:p_id", async (req, res) => {
        const { u_id, p_id } = req.params;
        try {
            const result = await reviewService.removeUserReview(p_id, u_id);
            res.send(result);
        } catch (e) {
            const message = e.output.payload;
            res.status(message.statusCode).send(message);
        }
    });

    router.put("/:u_id/reviews/:p_id", async (req, res) => {
        const { u_id, p_id } = req.params;
        try {
            const result = await reviewService.updateUserReview(p_id, u_id, req.body);
            res.send(result);
        } catch (e) {
            const message = e.output.payload;
            res.status(message.statusCode).send(message);
        }
    })

    router.get("/:u_id/recommendation", (req, res) => {
        // TODO: Get a recommendation for a given user
        res.send("Get a recommendation for a given user");
    });


    return router;
}