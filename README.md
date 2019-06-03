Использую 
https://github.com/arjunyel/angular-apollo-example

ng add apollo-angular



// Опционально для авто генерации
npm i -D graphql @graphql-codegen/cli // это для генерации под аполло

npm i -D @graphql-codegen/typescript-apollo-angular // это для генерации под ангулар

Иничу настпройки для генерации интерфейсов в  apollo-gen
graphql-codegen init

Сгенерит команду для генерации types.ts в app/types

Создаю tweets.query.graphql и т.д. по примеру для автоматической генерации всего
Дальше для автоматической генерации, создания сервисов и т.д. запускаю
npm i apollo:gen:a

Пока решил так не делать и с import {Apollo} from 'apollo-angular'; все удобно
/////////////////////////////////



# AngularGraphql

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.0.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
