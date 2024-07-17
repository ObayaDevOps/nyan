const fs = require('fs');
const axios = require('axios').default;

//https://dev.to/brewhousedigital/nextjs-getstaticprops-with-components-f25
//https://7foz0wph.api.sanity.io/v2024-07-17/data/query/production/?query=*
// https://7foz0wph.api.sanity.io/v2024-07-17/data/query/production/?query=*[_type%20==%20%22tenantList%22]


module.exports.preBuildDevelopment = async() => {
    const API = `https://7foz0wph.api.sanity.io/v2024-07-17/data/query/production/?query=*[_type%20==%20%22tenantList%22]|%20order(_createdAt%20asc)`;

    const response = await axios.get(API);

    console.log("PREBUILD")
    console.log(response.data.result)

    const data = response.data.result;

    fs.writeFileSync("./src/data/preBuild/tenantListData.json", JSON.stringify(data))

}

module.exports.preBuildProduction = async() => {
    console.log("Loading the production content!")
}