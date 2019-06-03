import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Apollo} from 'apollo-angular';
import {map} from 'rxjs/operators';
import {likeTweetMutation, tweetsQuery} from './graphql/tweets.graphql';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'angular-graphql';

    tweets$: Observable<any>;

    constructor(private apollo: Apollo) {}

    ngOnInit() {
        this.tweets$ = this.apollo.watchQuery({
            query: tweetsQuery,
        }).valueChanges.pipe(
            map((tweets) => tweets.data)
        );
    }

    likeTweet(id: string, likes: number, text: string) {
        this.apollo.mutate({
            mutation: likeTweetMutation,
            variables: {id},
            optimisticResponse: {
                __typename: 'Mutation',
                likeTweet: {
                    __typename: 'Tweet',
                    id,
                    likes: likes + 1
                }
            }
        }).subscribe();
    }
}
