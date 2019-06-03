// могу писать вручную запрос, а могу сгенерировать командой  npm run apollo:gen:a
import gql from 'graphql-tag';


// Query
export const tweetsQuery = gql`
    query tweets {
        tweets {
            id
            text
            likes
        }
    }
`;

// Mutation
export const likeTweetMutation = gql`
    mutation likeTweet($id: ID!) {
        likeTweet(id: $id) {
            id
            text
            likes
        }
    }
`;
