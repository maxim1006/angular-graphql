import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {isPlatformServer} from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class AppService {
    data;

    constructor(@Inject(PLATFORM_ID) private platformId: object) {
        if (!isPlatformServer(this.platformId)) {
            this.data = window['gqlDemo'];
        }
    }

}
