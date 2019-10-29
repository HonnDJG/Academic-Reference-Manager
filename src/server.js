module.exports = (context) => {
    const express = context("express");
    const app = express();
    const port = 5000;

    const publicationsRouteFactory = context("publicationsRoute");
    const publicationsRoute = publicationsRouteFactory(context);

    const usersRouteFactory = context("usersRoute");
    const usersRoute = usersRouteFactory(context);

    app.use('/Publications', publicationsRoute);

    app.use('/users', usersRoute);


    return {
        listen: () => {
            app.listen(port, () => {
                console.log(`API up and listening on port: ${port}`)
            });
        }
    }
}