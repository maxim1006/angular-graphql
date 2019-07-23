import {BrowserModule, BrowserTransferStateModule, makeStateKey, TransferState} from '@angular/platform-browser';
import {Inject, NgModule, PLATFORM_ID} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {GqlQueryComponent} from './components/gql-query/gql-query.component';
import {Apollo, ApolloModule} from 'apollo-angular';
import {HttpLink, HttpLinkModule} from 'apollo-angular-link-http';
import {isPlatformServer} from '@angular/common';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {GqlMutationComponent} from './components/gql-mutation/gql-mutation.component';
import {ReactiveFormsModule} from '@angular/forms';

const STATE_KEY = makeStateKey<any>('apollo.state');

@NgModule({
    declarations: [
        AppComponent,
        GqlQueryComponent,
        GqlMutationComponent
    ],
    imports: [
        BrowserModule.withServerTransition({appId: 'serverApp'}),
        BrowserTransferStateModule,
        AppRoutingModule,
        ApolloModule,
        HttpLinkModule,
        HttpClientModule,
        ReactiveFormsModule
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
            const uri = window['gqlDemo'].gql.url;
            const link = httpLink.create({uri});

            // для установки хедеров в запросы
            // https://www.apollographql.com/docs/angular/migration/
            // const middleware = setContext((value) => {
            //     console.log('middleware setContext ', value);
            // });

            // const link = middleware.concat(http);

            apollo.create({
                link,
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


            // так получаю кеш всего что сейчас есть в gql
            const state = this.cache.extract();
            setTimeout(() => {
                console.log('all cache ', state);
            }, 3000);
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
