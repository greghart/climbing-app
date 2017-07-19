# Climbing Application

Fancy climbing application. Basically setting up a personal project to pour
lessons learned into a web application that is interesting to me as well.

Meta note -- I should describe why I chose markdown to write the document
of why I wrote everything how I wrote it.

Basically universal support, easy to ready in a text editor, and I'm used to
it! Ideal consumption is Github flavored markdown.

# Table of Contents

<!-- TOC -->

- [Climbing Application](#climbing-application)
- [Table of Contents](#table-of-contents)
- [Tech Design](#tech-design)
  - [Project structure](#project-structure)
    - [Project management](#project-management)
    - [IDE](#ide)
    - [Folder structure](#folder-structure)
      - [src](#src)
        - [JS Source](#js-source)
        - [Util](#util)
  - [Language](#language)
    - [Types](#types)
      - [Typescript vs Flow](#typescript-vs-flow)
      - [Pitfalls](#pitfalls)
    - [Solution](#solution)
  - [Asset Pipeline](#asset-pipeline)
  - [Build tools](#build-tools)
    - [Definition](#definition)
    - [Goals](#goals)
    - [Options](#options)
    - [Solution](#solution-1)
  - [Configuration](#configuration)
  - [Server](#server)
    - [Express.js](#expressjs)
    - [Hapi.js](#hapijs)
    - [Swagger / OpenAPI](#swagger--openapi)
    - [Solution](#solution-2)
  - [Database layer](#database-layer)
  - [Model Layer](#model-layer)
    - [Sequelize](#sequelize)
    - [TypeORM](#typeorm)
  - [Authentication](#authentication)
    - [Use Cases](#use-cases)
      - [Session authentication](#session-authentication)
        - [POSTing credentials](#posting-credentials)
        - [SAML](#saml)
        - [OAuth](#oauth)
        - [Remember Me?](#remember-me)
    - [Solutions](#solutions)
      - [Passport.js](#passportjs)
  - [Universal Application Stack](#universal-application-stack)
    - [Requirements](#requirements)
      - [Universal Rendering](#universal-rendering)

<!-- /TOC -->

# Tech Design

Since half the reason of setting this project up is to document best practices,
I will be heavily documenting the technical design while implementing.

## Project structure

### Project management

Lean and re-usable NPM modules should be used as much as possible in lieu of
monolithic app design.

Generally a web application can be thought of as a front-end and a back-end.
The back-end interacts with some underlying data model, and creates adaptable
endpoints that power the various components and pages of the front-end.

While the advantages of splitting out the data model into its' own project
are not the norm (underlying data changes will break regardless of typed
contact), it can still be a very helpful practice to avoid doing too much
in one place. This also allows front-ends to be iterated very quicky with
proper mocking.

### IDE

Visual Studio Code is currently the best IDE available for TypeScript and
general web development in one place. Backed by Microsoft, we can be sure
of maintenance and improvements. Also ideal for cross platform consistency.

### Folder structure

#### src

Source (`/src`) should hold anything that warrants _compilation_. For most
applications, this will likely only be javascript and style sheets.

```
/src
/src/[coffee|typescript|ts|flow]
/src/[scss|less]
```

If stylesheets are isolated to another repository, one may forgo sub
directories for each compiled type.

##### JS Source

Top level aspects of our application, development entry points, etc.

Example
```
/
/api        // Application API
/redux      // Universal Redux
/schemas    // Universal validation layer
/authentication // Authentication layer
/authorization  // Authorization layer
/util       // Universally shared logic
/conf.ts    // Applicaton configuration
/client.ts  // Entry point for client application
/server.ts  // Entry point for server application
```

##### Util

The logic in the shared `util` can often be refactored out to a re-usable
module.

## Language

ES6 through Babel.js transpilation, and utilizing ES6+ features when I really
love them. "Transform Object Rest Spread" is a personal necessity.

### Types

Are tools like Flow or writing in TypeScript worth it? Time will tell!

Initial impressions are that the extra thought and care results in a longer
initial development time, but the extra confidence in your code is worth it!

#### Typescript vs Flow

* Typescript has more tooling and IDE support, more popular
* Flow has less tooling and IDE support, but still backed by FB
* Typescript requires more formal annotations of types
* Flow has more emphasis on flexible type inference, more "normal" JS
* Typescript adds features to the language that transpile
* Flow is more vanilla JS, without adding or changing anything.
* Typescript is hard to integrate into React and Redux
* Flow is specifically built for React

#### Pitfalls

Semantic versioning on @types no longer applies -- it is basically impossible
to not change the API when changing @types, so even a "bugfix" can become
backwards incompatible.

### Solution

Typescript has the backing of Microsoft, a pragmatic approach to types, and
the tooling to make the positives outweight the negatives, which may include
harder hiring and struggling through third party types.

## Asset Pipeline

TODO
* Webpack
* Revisioning
* Optimizations
* Hosting

## Build tools

### Definition

Really by build tool, I really mean anything that a developer may run during
the development lifecycle of your project. Most often, this is building your
code, but can also consist of scaffolding, deploying, migrating data, etc.

This is specifically distinct from the asset pipeline -- while the build
tools will likely tap into asset pipeline tooling, the build tool itself
will be the sole place of interaction by the developer.

### Goals

* Single point of entry for all things developer -- build, compile, deploy,
  scaffold, etc. Avoid having to think "was that NPM script, or a shell
  script, or Gulp, or a Makefile..."
* Simple and modular -- ideal build system doesn't all have to be in one file.
  It can be heavily commented to avoid scale issues, moving away from a single
  giant script that's scroll heavy and hard to grok from a glance.
* Reflective -- I should be able to easily document my tasks as I implement
  them, and in the future run an easy to remember command to remember how to
  run everything.
* Robust -- If I want to do something outside the opinion of the build tool,
  that should just _work_.

### Options

* NPM -- package.json "scripts" directive
  * \+ No onboarding
  * \+ Easy to grok tools (pipes, &&s, ||s, npm-run-all, on-change)
  * \+ Pre/post built-in for clarity
  * Check out package-scripts!
  * \- Unknown side effects (like it runs local module commands, but may not
      be apparent).
  * \- For anything complex, commands become hard to grok and end up being
      delegated to another build tool anyways.
  * \- No comments

* Gulp -- streams based interfaces with lots of plugins.
  * \+ Ostensibly faster due to everything defaulting to stream mode
  * \+ Just code so very robust.
  * \+ Familiar.
  * \- Doing something that doesn't have a plugin is hard (+ that rarely
    happens).
  * \- Requires extra grokking, extra tooling (gulp API can differ from built
    in CLI APIs).

Keep it in consideration. If there are no better alternatives, let's do it!

* Vorpal -- CLI framework for building your own solutions
  * \+ More of a foundation for nice CLI applications verse opinion on how to
    do your specific thing.
  * \+ Autocomplete and all that jazz
  * Programmitic APIs only -- some tools just aren't as nice to work with.
  * \- Overkill for a simple application
  * \- Not as popular, less built-in extension support

* NPS -- JSON or YAML configuration of your commands
  * \+ Simplicity of NPM but with easier to document and track commands
  * \+ In javascript NPS, can have code to share tooling config
  * \+ Can start with NPM, and migrate once things start getting out of hand
  * \- Still no performance optimizations

### Solution

Start with simple NPM with proper management and techniques.
If you end up with lots of scripts that are hard to maintain, migrate to
NPS to manage things in separate files. If there are very performance heavy
tasks that are more easily managed with streams, set those up in gulp file,
but run them only through NPS scripts.

## Configuration

TODO Decide on solid universal configuration paradigm

## Server

AKA: Backend, server, API

### Express.js

Very light framework that runs on middleware. Middleware is merely a chain of
layers that pass and manipulate an HTTP request down and eventually ends in a
response.

The most popular framework, that's very unopinionated. Useful no matter what
you put on top of it

### Hapi.js

Opinionated and monolithic. Overall _unnecessary_ and _restrictive_

### Swagger / OpenAPI

Swagger is less a specific technology, and more a framework for standardizing
RESTful APIs. Documenting your API with the spec and tools Swagger provides
gives you (nearly free): API exploration, contractual versioning, validation,
authorization, automatic client, etc.

The downside is the technology is relatively new, and quickly evolving -- it was
switched naming from Swagger -> OpenAPI, had a major version update, and has another
on the way. That means splintered community help and documentation.

### Solution

Use Express, nearly every tech has a plugin.

*Don't* use middleware for everything though. Minimize request flags and properties
that only work if earlier middleware happened to have run in a certain way.

Instead, use Swagger, or spec out your own API logic and ensure things are as
modular as possible

## Database layer

My expertise and preference is relational data, in MySQL or PostgreSQL.

Some experience with document based data stores like Mongo, but outside the scope
for now.

## Model Layer

The model layer exists to separate your application and the underlying database. This
can be as thin as encapsulating within SQL functions, to as broad as utilizing an ORM.
Because we're not particularly masochistic, we will use an ORM to handle the primary
use cases, describe the schema of our app, and handle logistics like migrations.

### Sequelize

Sequelize is the most popular Node.js ORM, and comes with all the advantages that
brings (active community, long term support, etc.). It follows the ActiveRecord pattern
(https://www.martinfowler.com/eaaCatalog/activeRecord.html).

While active, stable, and mostly functional, it was was also built by primarily
hobbyists who make very significant mistakes and design errors. When sequelize gets
leaky (which happens a lot), it's not apparent at all how to tap into the lower layers.
Additionally, it's built on an "old-school" object based query dialog, which
makes building complex queries just a little bit harder.

### TypeORM

TypeORM is a TypeScript-centric ORM. Following the Data Mapper pattern
(https://martinfowler.com/eaaCatalog/dataMapper.html), it allows you to
declare POJCs (Plain Ol Javascript Classes), and uses decorators and type
reflection to create a layer for adapting these classes to SQL and back.

The design was buit specifically as a foil to the Sequelize way, ensuring
falling back to lower level SQL is done easily and predictably. The query
builder is first class, and working with basic objects for most of your
application logic is a joy, as is having a class that can even be re-used
on the client.

## Authentication

Authentication is the process of verifying that a specific agent is performing
an action. The true scope of authentication lies outside this document, but we
can focus on the general use cases for web development.

### Use Cases

* Sessions -- an end-user that logs into the application, and whose
authentication status is persisted in a web browser's session.
* API -- per request authentication for programmatic use.

In either case, we are basically looking at the context of a request, and
deciding whether the request can be verified to a user. We will discuss the
general methodology and ecosystem specific technologies for each case.

#### Session authentication

Basic session management consists of storing a unique token in the user's
browser cookies. This token will be persisted by the application back-end
as a key to an authenticated session, which consists of details like user
id, ip, timestamps, and other metadata. This cookie token should be set with
the proper options: properly scoped, secured, transient (be erased on browser
close), and set to expire in an application-sane amount of time.

The primary distinction in setting up your app is in _how_ the authenticated
session is generated.

* POSTing credentials
* Standards like SAML
* Custom solutions, like a "Remember Me?" cookie

https://paragonie.com/blog/2015/04/secure-authentication-php-with-long-term-persistence
http://blog.ircmaxell.com/2014/11/its-all-about-time.html

##### POSTing credentials

The application renders a form to POST login credentials to an endpoint.
If the credentials are valid, then the session is authenticated and persisted.

Validating and storing credentials must be done in a safe manner. At the very least,
proper encryption and salting of the password (not SHA512), and ensuring that
credentials are never stored or displayed in plaintext (this includes logs,
URLs, etc.). A fully robust system should also include additional layers such
as 2FA, brute force protection on sensitive endpoints using Captcha or similar,
and a proper reset password workflow that expires properly.

##### SAML

SAML is a standard that works on a redirect mechanism. Generally, the application
redirects the user agent to an identity provider, or IP, generally a trusted
third party like Google, Facebook, or a specific vendor. This request details
the exact data needed for authenticated. The IP then handles the authentication,
and once handled, will redirect back to the application with an encrypted payload
of the user's data.

The assertion by SAML includes all the relevant user data, which then should be
tracked by the application.

The limitation here is that the assertion is done over a POST to your application.
If your application is not a web app, but a native app, how will this work?

##### OAuth

OAuth functions in a very similar methodlogy, but doesn't rely on POST, instead
just doing a redirect to a URL with the token inline. This means the application
must then do another round trip communication with the identity provider, with the
added flexibility of working out of the box for your native app.

##### Remember Me?

Remember Me? cookie tokens are similar to the session cookie, except they are
_not_ transient. That is, they persist outside of temporary memory. Because of
this, extra care is needed in storing and validating these tokens, as an
attacker ostensibly has more time in figuring out these tokens than a regular
session token.

### Solutions

#### Passport.js

Encapsulate separate authentication methods into re-usable strategies.
Hide details behind a standardized Express.js supported interface.
A very useful paradigm for making re-usable authentication mechanisms, as well
as utilizing existing ones

## Universal Application Stack

There will be no conventional front-end. Instead, we opt for a universal
application.
* React
* Redux
* React Router

### Requirements

#### Universal Rendering
