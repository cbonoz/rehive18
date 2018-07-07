const library = (function () {
    const axios = require('axios');

    const BASE_URL = "http://localhost:3001"

    const getNodes = () => {
        return axios.get(`${BASE_URL}/nodes`);
    }

    return {
        getNodes: getNodes
    }

})();
module.exports = library;

