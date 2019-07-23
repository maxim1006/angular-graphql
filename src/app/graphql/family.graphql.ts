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

export const familyQueryNumber = gql`
    query familyMembers($membersNumber: FamilyMembersArgs!) {
        familyMembers(membersNumber: $membersNumber) {
            members {
                name
            }
        }
    }
`;
