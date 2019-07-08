window.gqlDemo = {
    gql: {
        billingAccountQuery: `
            query billingAccounts { 
                billingAccounts { 
                    name status type balance id 
                } 
            }
        `,
        dashboard2: `
            query dashboard2($routeId: String!) { 
            
                billingAccountSummary(routeId: $routeId) { 
                    name status type balance 
                } 
                
                bills(routeId: $routeId) { 
                    name issueDate amount status dueDate 
                } 
                
                payments(routeId: $routeId) { 
                    type createdDate amount status paymentDate 
                } 
                
                topBPIs(routeId: $routeId) { 
                    name status mrc discount total 
                } 
            }
        `
    }
};
