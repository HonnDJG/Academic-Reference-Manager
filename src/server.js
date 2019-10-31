module.exports = (context) => {
    const express = context("express");
    const app = express();
    const port = process.env.PORT || 5000;

    const publicationRoute = context("publicationRoute")(context);
    const userRoute = context("userRoute")(context);

    app.use('/Publications', publicationRoute);
    app.use('/users', userRoute);

    return {
        listen: () => {
            app.listen(port, () => {
                console.log(`API up and listening on port: ${port}`)
            });
        }
    }
}