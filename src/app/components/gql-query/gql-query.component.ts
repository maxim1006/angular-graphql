import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Apollo} from 'apollo-angular';
import {pluck} from 'rxjs/operators';
import gql from 'graphql-tag';
import {AppService} from '../../app.service';
import {familyQueryNumber} from '../../graphql/family.graphql';

@Component({
    selector: 'gql-query',
    template: `
        <h3>gql query</h3>
        <ng-container *ngIf="(family$ | async | select: 'family') as family; else loader">
            <ul>
                <li *ngFor="let member of family?.members">
                    {{member?.name}}
                </li>
            </ul>
        </ng-container>

        <ng-template #loader>
            Loading family...
        </ng-template>

        <div style="margin-top: 40px;">
            <div>
                How many members load? <input type="text" #membersNumber>
                <button (click)="loadFamily(membersNumber)">load family</button>
            </div>
            <ng-container *ngIf="(loadFamily$ | async) as family; else loader">
                <ul>
                    <li *ngFor="let member of family?.members;">
                        {{member?.name}}
                    </li>
                </ul>
            </ng-container>
        </div>
    `
})

export class GqlQueryComponent implements OnInit {
    family$: Observable<any>;
    loadFamily$: Observable<any>;

    constructor(
        private apollo: Apollo,
        private appService: AppService
    ) {
    }

    ngOnInit() {
        // The watchQuery method returns a QueryRef object which has the valueChanges property that is an Observable.
        this.family$ = this.apollo.watchQuery({
            // query: familyQuery, // если храню квери в приложении
            query: gql`${this.appService.data.gql.familyQuery}`, // если храню квери в инит дате
            // fetchPolicy: 'no-cache' // disable cache
        })
        .valueChanges;
        // pluck не нужен так как использую пайп из gql - | select: 'family'"
        // .pipe(pluck('data', 'family'));
    }

    loadFamily(input: HTMLInputElement) {
        // пример квери с параметром
        const familyMembers = this.apollo.watchQuery({
            query: gql`${familyQueryNumber}`,
            variables: {
                membersNumber: {
                    number: parseInt(input.value, 10) || 100
                }
            },
            // тут хорошо видно действие кеща
            fetchPolicy: 'no-cache', // disable cache
        })
        .valueChanges;

        this.loadFamily$ =
            familyMembers.pipe(pluck('data', 'familyMembers'));

        familyMembers
            .subscribe(({data, loading}) => {
                console.log(data, loading);
            });
    }
}
