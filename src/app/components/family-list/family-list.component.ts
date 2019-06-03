import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Apollo} from 'apollo-angular';
import {familyQuery} from '../../graphql/family.graphql';
import {pluck} from 'rxjs/operators';

@Component({
    selector: 'family-list',
    template: `
        <ng-container *ngIf="(family$ | async) as family; else loader">
            <ul>
                <li *ngFor="let member of family?.members">
                    {{member?.name}}
                </li>
            </ul>
        </ng-container>
        
        <ng-template #loader>
            Loading family...
        </ng-template>
    `
})

export class FamilyListComponent implements OnInit {
    family$: Observable<any>;

    constructor(private apollo: Apollo) {}

    ngOnInit() {
        let obs = this.family$ = this.apollo.watchQuery({
            query: familyQuery
        })
            .valueChanges.pipe(pluck('data', 'family'));
    }
}
