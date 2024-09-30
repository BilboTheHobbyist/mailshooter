# Mailshooter - A Node.js Mailgun Server

First written to act as a contact form server.

## Getting Started

To get up and running with the mailshooter server is really straightforward. First, make sure you have npm installed (you'll need that for working with node so I'll assume you already have node package manager installed).

You can then install mailshooter by just running the following command from the root:

```
npm install
```

Once done get pm2 (it's a process manager and it's handy for starting your app as a daemon and viewing logs etc.) installed:
```
npm install -g pm2
```
You can also use forever or nodemon etc.

Before mailshooter can be started you need to setup the config. It's in `.env` file located in the root directory.

Your `env` should contain:

```
MAILGUN_API_KEY=YOUR_PRIVATE_API_KEY
MAILGUN_DOMAIN=yourdomain.com
PORT=YOUR_APP_PORT
```

Once you have that setup you should be good to start Mailshooter.
```
npm start
```

I haven't tried it (yet), but you may use pm2:

```
pm2 start npm --name mailshooter -- start
```

You can see if it's started correctly by looking at the logs:

```
pm2 logs mailshooter
```

If it's started okay you should see something similar to this:
```
mailshooter-10 (out): Express server listening on port 3000
```

You should be all set up now. All you need to do is copy this application and start it wherever you want a local server.

Let me know if you've got any feedback about it! I'm no developer, so new features are out of my league, but I'll do my best.

## letsencrypt

To use with letsencrypt, run the following command from the directory where letsencrypt is installed:

    ./letsencrypt-auto certonly --webroot -w /var/www/mailshooter/ -d mailshooter.example.com

Once the certificate has been generated, uncomment the relevant lines in the nginx conf for the mailshooter server.

Don't forget to add a CNAME record for your domain.

To auto renew the letsencrypt certificate (they expire every three months), add the following command to your crontab:

    ./letsencrypt-auto certonly --renew --webroot -w /var/www/mailshooter/ -d mailshooter.example.com

If the certificate failed to generate, you may need to manually create the `.well-known` folder in the mailshooter root directory:

    mkdir .well-known

and then add the `acme-challenge` directory:

    cd .well-known
    mkdir acme-challenge
