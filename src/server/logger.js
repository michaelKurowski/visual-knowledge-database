function logRoute(route, parameters) {
    console.log(`${new Date()} [REQUEST /${route}] Parameters: ${JSON.stringify(parameters)}`)
}

module.exports = {
    logRoute
}