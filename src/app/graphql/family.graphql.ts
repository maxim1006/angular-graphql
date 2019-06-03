// Query
import gql from 'graphql-tag';

export const familyQuery = gql`
    {
        family {
            members {
                name
            }
        }
    }
`;
