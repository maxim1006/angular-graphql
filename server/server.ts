import * as admin from 'firebase-admin';
import gql from 'graphql-tag';
import {ApolloError, ApolloServer, ValidationError} from 'apollo-server';

const serviceAccount = require('../account.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});


interface User {
    id: string;
    name: string;
    screenName: string;
    statusesCount: number;
}

interface Tweet {
    id: string;
    likes: number;
    text: string;
    userId: string;
}


// type definitions - описываю форму даты доступной на сервере
// ! - значит вернуть только этот тип
// Query - главная точка входа в наш Api
const typeDefs = gql`
    # A Twitter User
    type User {
        id: ID!
        screenName: String!
        statusesCount: Int!
        tweets: [Tweet]!
    }

    # Family
    type Family {
        members: [Member]
    }

    type Member {
        name: String!
        age: Int
    }

    # A Tweet Object
    type Tweet {
        id: ID!
        text: String!
        userId: String!
        user: User!
        likes: Int!
    }

    type Tweets {
        id: ID!
        text: String!
        userId: String!
        user: User!
        likes: Int!
    }

    type Users {
        id: ID!
        name: String!
        all: [Users]!
        createdBy: String!
    }

    type Query {
        family: Family
        tweets: [Tweet]
        users: [Users]
        user(id: String!): User
        member(id: String): Member

        "A simple type for getting started!"
        hello: String
    }

    type Mutation {
        likeTweet(id: ID!): Tweet
    }
`;

// резолверы - описывают способы получения типов в schema. Тут описываю как возвращать дату на клиент
const resolvers = {
    Query: {
        hello: () => 'world',
        async family() {
            const membersDoc = await admin
                .firestore()
                .doc('family/members')
                .get();

            const members = membersDoc.data().all.map(item => item);

            return {
                members
            };
        },
        async tweets() {
            const tweets = await admin
                .firestore()
                .collection('tweets')
                .get();
            return tweets.docs.map(tweet => tweet.data()) as Tweet[];
        },
        async users() {
            const users = await admin
                .firestore()
                .collection('users')
                .get();
            return users.docs.map(user => user.data()) as User[];
        },
        async user(_: null, args: { id: string }) {
            try {
                const userDoc = await admin
                    .firestore()
                    .doc(`users/${args.id}`)
                    .get();
                const user = userDoc.data() as User | undefined;
                return user || new ValidationError('User ID not found');
            } catch (error) {
                throw new ApolloError(error);
            }
        },
        async member(_: null, args: { id: string }) {
            try {
                const memberDoc = await admin
                    .firestore()
                    .doc(`family/members/${args.id}`)
                    .get();

                const member = memberDoc.data();

                return member || new ValidationError('User ID not found');
            } catch (error) {
                throw new ApolloError(error);
            }
        }
    },

    Mutation: {
        likeTweet: async (_, args: { id: string }) => {
            try {
                const tweetRef = admin.firestore().doc(`tweets/${args.id}`);
                let tweetDoc = await tweetRef.get();
                const tweet = tweetDoc.data();

                await tweetRef.update({likes: tweet.likes + 1});

                tweetDoc = await tweetRef.get();

                // тут делаю ошибку чтобы проверить оптимистик запросы, они в реалтайме будут возвращать
                // предыдущее значение, затем обратно все восстановят
                if (+new Date() / 2 % 2 < 0.5) {
                    return tweetDoc.data();
                } else {
                    throw new ApolloError('Something bad happened');
                }


            } catch (error) {
                throw new ApolloError(error);
            }
        }
    },

    // тут описываю поля которых нет в бд, чтобы их заполнить
    Users: {
        createdBy: () => 'Max',
        async all() {
            try {
                const users = await admin
                    .firestore()
                    .collection('users')
                    .get();

                return users.docs.map(user => user.data());
            } catch (error) {
                throw new ApolloError(error);
            }
        }
    },
    // User: {
    //     async tweets(user) {
    //         try {
    //             const userTweets = await admin
    //                 .firestore()
    //                 .collection('tweets')
    //                 .where('userId', '==', user.id)
    //                 .get();
    //
    //             return userTweets.docs.map(tweet => tweet.data());
    //         } catch (error) {
    //             throw new ApolloError(error);
    //         }
    //     }
    // },
    // Tweets: {
    //     async user(tweet) {
    //         try {
    //             const tweetAuthor = await admin
    //                 .firestore()
    //                 .doc(`users/${tweet.userId}`)
    //                 .get();
    //             return tweetAuthor.data() as User;
    //         } catch (error) {
    //             throw new ApolloError(error);
    //         }
    //     }
    // }
};


const server = new ApolloServer({
    typeDefs,
    resolvers,
    // disable preflight request
    cors: {
        maxAge: 600
    }
});

server.listen().then(({url}) => {
    console.log(`Server start at ${url}`);
});


// Так получаю в интерфейсе все tweets
// {
//     tweets {
//     id,
//         likes,
//        text
// }
// }

// так юзера
// {
//     user(id: "user1") {
//         screenName
//     }
// }


// Так Family

// {
//     family
//     {
//         members
//         {
//             name
//         }
//     }
// }

