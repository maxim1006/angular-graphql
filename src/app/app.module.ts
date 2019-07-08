import {BrowserModule, BrowserTransferStateModule, makeStateKey, TransferState} from '@angular/platform-browser';
import {Inject, NgModule, PLATFORM_ID} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {FamilyListComponent} from './components/family-list/family-list.component';
import {Apollo, ApolloModule} from 'apollo-angular';
import {HttpLink, HttpLinkModule} from 'apollo-angular-link-http';
import {isPlatformServer} from '@angular/common';
import {InMemoryCache} from 'apollo-cache-inmemory';

const STATE_KEY = makeStateKey<any>('apollo.state');

@NgModule({
    declarations: [
        AppComponent,
        FamilyListComponent
    ],
    imports: [
        BrowserModule.withServerTransition({ appId: 'serverApp' }),
        BrowserTransferStateModule,
        AppRoutingModule,
        ApolloModule,
        HttpLinkModule,
        HttpClientModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
    cache: InMemoryCache;

    constructor(
        apollo: Apollo,
        httpLink: HttpLink,
        private readonly transferState: TransferState,
        @Inject(PLATFORM_ID) private platformId: object
    ) {
        if (!isPlatformServer(this.platformId)) {
            this.cache = new InMemoryCache();

            const isBrowser = this.transferState.hasKey<any>(STATE_KEY);
            const uri = 'http://localhost:4000/';

            apollo.create({
                link: httpLink.create({uri}),
                cache: this.cache,
                ...(isBrowser
                    ? {
                        // queries with `forceFetch` enabled will be delayed
                        ssrForceFetchDelay: 200,
                    }
                    : {
                        // avoid to run twice queries with `forceFetch` enabled
                        ssrMode: true,
                    })
            });

            if (isBrowser) {
                this.onBrowser();
            } else {
                this.onServer();
            }
        }
    }

    onServer() {
        this.transferState.onSerialize(STATE_KEY, () => {
            return this.cache.extract();
        });
    }

    onBrowser() {
        const state = this.transferState.get<any>(STATE_KEY, null);
        this.cache.restore(state);
    }
}
