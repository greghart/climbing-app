# Climbing Application

Fancy climbing application. Basically setting up a personal project to pour
lessons learned into a web application that is interesting to me as well.

Meta note -- I should describe why I chose markdown to write the document
of why I wrote everything how I wrote it.

Basically universal support, easy to ready in a text editor, and I'm used to
it! Ideal consumption is Github flavored markdown.

# Table of Contents

TODO Build this dynamically

# Tech Design

Since half the reason of setting this project up is to document best practices,
I will be heavily documenting the technical design while implementing.

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

## Build tools

### Definition:

Really by build tool, I really mean anything that a developer may run during
the development lifecycle of your project. Most often, this is building your
code, but can also consist of scaffolding, deploying, migrating data, etc.

### Goals:

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

### Options:

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

