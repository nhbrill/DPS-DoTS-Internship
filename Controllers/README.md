Dpsk12.Ear.Controller : A Quick Note

These controllers drove me pretty insane. From the beginnnig, all of the different HTTP requests worked (GET, POST, PUT, DELETE) just fine, 
and they stil do work in the ValuesController. However, for some f***ing reason, additional Controllers just responded with a 405 Method not allowed
when a PUT or DELETE request was made. POST and GET worked just fine. I spent a whole f***ing day trying to get those to work, messing around in
the web.config file, trying to remove WebDav, using different templates from the start. Nothing worked. So I caved and added extra, likely
unnecessary controllers, using only their PUT and GET methods, and it works just fine. It is not pretty, and is confusing as hell to understand
what each controller actually does because I had to use HTTP methods that acctually worked.

So you, some developer in the future is scratching your head wondering why the hell some dumbass developer made it this way, there you go.
I sincerely hope that you can fix it better than I could.