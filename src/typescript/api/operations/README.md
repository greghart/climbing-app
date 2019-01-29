# Operations

Business-ish logic but kept in a very minimal, functional, re-usable form.
Not tied to any request framework, somewhere between service layer and model layer.

API Service
*Operation*
Model/ORM
Database

Whether something should become an operation, or just be code in the API Service layer,
is up to the developer. 

Generally, if something should be scalable and/or unit-testable, make an operation. 
However, if you're just thinly wrapping ORM, probably not needed.
