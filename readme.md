
# OHM DELIVERY
ohm-delivery is a minimalistic project that you have to improve and build.

The final customer receive the following trackingId `1e62adfe` by email and a link to the tracking page.

Improve the website to let the customer search for the status of the resistance. When delivered, the customer can acknowledge the delivery (or the failure) of the ordered resistance.


## How to use:
In web and server directories, type:
```bash
npm run start
```

To run the tests, go to the server directory and type:
```
npm run test
```

## Explanations:

### Web:
* I didn't change the UI as it's really easy to beautify the page with a few shadows, etc
* I didn't display all the data (client info, description, etc) since it uses the same logics than the other data
* I spent a few time to understand Angular and how to structure the controllers / scopes in order to share data between controllers. I found a hack making data sharing possible (in order to display N comment fields and get the correct one).

### Server:
* I found some typo here and there but I guess it was on purpose :)
* I decided to store the statuses in DB in order to give the possibility to update them (adding a status, etc) without reloading the server.
* I could fit exactly the instructions hardcoding something like `if (status === 'REFUSED') { displayCommentField() }` but I prefered using dynamic config for the same reasons than above.
* The state / statuses logic is as follow:
** the `states` are an ordered list of states which may contain as many statuses as we want.
** we can only go to the next state.
** for any status of a state, we can go to any status of the next state, then it solve the case with several statuses
