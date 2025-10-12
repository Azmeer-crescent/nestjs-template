<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository. A minimum setup by Azmeer. Uses best practices, eg: DTO, entities, SSO and JWT auth, CASL for permissions, Swagger API docs etc...

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Option 1. Add a new module by creating files manually

```bash
# Creating 'demo' module. This will create 3 files.
$ nest g module demo
$ nest g service demo
$ nest g controller demo

# create bookcontroller.ts inside/demo (--flat stop creating a subfolder)
$ nest g controller demo/book --flat

```
```ts
// import the module to 'app.module.ts'
import { UserModule } from './user/user.module';
@Module({
  imports: [
    UserModule,
  ],
})
export class AppModule {}
```

## Option 2. Add a new module with all CRUD & support files
```bash
# Creating 'user' module. This will create 3 files with CRUD endpoints
$ nest g resource user
```
#### Creates a new folder ```user/``` inside ```src/```
 - Generate:
   - user.controller.ts — your REST controller
   - user.service.ts — your business logic
   - user.module.ts — the module that wires it all  - together
   - DTOs and entity files (if you choose to include them)
   - Register the route in your app (if you choose REST)


## Testing
```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

[deployment documentation](https://docs.nestjs.com/deployment) for more information.

For a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) 
- For questions and support: [Discord channel](https://discord.gg/G7Qnnhy).
- Official video [courses](https://courses.nestjs.com/).
- Deploy application to AWS with the help of [NestJS Mau](https://mau.nestjs.com)
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).

## Features

- JWT authentican
- Google SSO with Passport
- Permission system with CASL
- CSV importer service
- Look-ahead service (for auto-typing)
- Fully functional 'demo' module (book & authors)
## Todo

- Move CASL seeder to run-seed.ts from casl module autorun

## Stay in touch

- Principle Author - [M.A. Mohamed Azmeer](https://azmeer.info)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
