import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
    selector: 'gql-mutation',
    template: `
        <h3>gql mutation</h3>
        <form [formGroup]="formGroup" (ngSubmit)="onSubmit()" novalidate>
            <label>
                Name: <input type="text" formControlName="name">
            </label>

            <label>
                Age: <input type="text" formControlName="age">
            </label>
            <button type="submit" [disabled]="!formGroup.valid">Submit</button>
        </form>
        
        <ul>
            <li></li>
        </ul>
    `,
    styles: [
            `
            :host {
                display: block;
                margin-top: 40px;
            }
        `
    ]
})

export class GqlMutationComponent implements OnInit {
    formGroup: FormGroup;

    constructor(private fb: FormBuilder) {}

    ngOnInit() {
        this.formGroup = this.fb.group({
            name: [''],
            age: ['']
        });
    }

    onSubmit() {
        console.log(this.formGroup.value);
    }
}
