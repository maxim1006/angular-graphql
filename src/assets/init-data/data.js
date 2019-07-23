window.gqlDemo = {
    gql: {
        url: `http://localhost:4000/`,
        familyQuery: `
            {
                family {
                    members {
                        name
                    }
                }
            }
        `
    }
};
