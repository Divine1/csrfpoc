## CSRF token poc

### Same server 192.0.1.1
#### PageRedirect
`Success`: frontend(192.0.1.1)  `<---csrftoken---` backend(192.0.1.1)

`Success:` frontend(192.0.1.1)  `---csrftoken--->` backend(192.0.1.1)

#### RestApi
`Success:` frontend(192.0.1.1)  `<---csrftoken---` backend(192.0.1.1)

`Success:` frontend(192.0.1.1)  `---csrftoken--->` backend(192.0.1.1)

### Different server 192.0.1.1,192.0.1.2
#### PageRedirect
Notpossible

#### RestApi
`Success:` frontend(192.0.1.2)  `<---csrftoken---` backend(192.0.1.1)

`Failure:` frontend(192.0.1.2)  `---csrftoken--->` backend(192.0.1.1)
    CSRF Token mismatch



#### Observation
the observations written here are verfied with the project in this repo

 - Under same domain, csrf token validation works fine
 - under cross domain, csrf token match fails even though the csrf token sent to the server is the same as the server sent
 - The point of csrf token is for the server to know if the csrf token which the server sent is sent back by the client during post request
 - Incase of lusca, a token can be re-used multiple times. i didn't check if the library offers any functionality to make the token available for single usage.
 - My understanding is, for the csrf to work. the server and client must be under the same host. As the name suggests, (cross site request forgery)  csrf token is to prevent cross site intervention. i checked the implementation that would validate csrf token from incoming http request, its in `/node_modules/lusca/lib/csrf.js` `csrf.validate(req, _token)` , it looks like the ouogic wants something else, i need to check what it is
 - But if you ask me why it isn't working for cross domain, 
    - it's not working because request is coming from cross-domain 
    - i can't say anything else because this same restapi code works fine under same domain
    - i need to do more research on this. but logically speaking i think csrf token works as it should work (i.e) it shouldn't be working with cross domain as its proven here. 

#### The solution i propose (for now...)
- As of now, to make any public rest api's from IMserver to be accessible only from trusted public domains(3rd party),
    - You can ask the 3rd party to use csrf protection in their codebase and send the data to their server
    - IM should give an accessToken to the 3rd party for identity verification. Using this accessToken the 3rd party can access the restApi's in the IM server from 3rd party's servercode, thereby IMserver will restrict access to only trusted 3rdparty's. This accessToken can be revoked by IM server if the 3rdparty goesaway.




