## Database Details

An empty database looks like this:

```
{
  "users": [],
  "entry": [],
  "profile": {
    "name": "typicode"
  }
}
```
 - `users` holds the all the registered users. User details include an auto generated id, name, email and photo that is taken at the time of register

 - `entry` holds the checkins and checkouts of all the users. An entry will hold id, user's id, name, email, time ( in UNIX epoch) format so that its easy to store with the JSON api server. Also, a photo is stored in the attendance entry
