const library = (function () {
    const axios = require('axios');

    const BASE_URL = "http://localhost:3001"

    const getLastUpdated = () => {
        return axios.get(`${BASE_URL}/lastupdated`);
    }
    const getNodes = () => {
        return axios.get(`${BASE_URL}/nodes`);
    }

    return {
        getNodes: getNodes,
        getLastUpdated: getLastUpdated
    }

})();
module.exports = library;

