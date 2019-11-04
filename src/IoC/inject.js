/**
 * Dependency injector
 */

module.exports = (dependencies) => {
    dependencies = dependencies || {};
    let injector = dependencyName => {
        if (!dependencies[dependencyName]) {
            throw new Error("Required dependency <" + dependencyName + "> is not provided.");
        }
        return dependencies[dependencyName];
    };
    return injector;
};