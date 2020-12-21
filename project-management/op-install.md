---
id: op-install
title: OpenProject - Manual Installation
slug: /openproject-install
---

:::note

The following instructions is for the version **11.1.0** of OpenProject. The sources mentioned in this guide are available [here](https://github.com/btey/openproject).

:::

Please be aware that:

- This guide has been tested with (x64) Debian 10, Ubuntu 18.04 and Ubuntu 20.04 installation with administrative rights (i.e. you must be able to sudo).
- OpenProject will be installed with a PostgreSQL database.
- OpenProject will be served in a production environment with the Apache server (should work similarly with other servers, like nginx and others)

The `user` is the operating system user the command is executed with. In this case it will be `root` for most of the time or `openproject`.

## 1. Create a dedicated OpenProject user

```bash
sudo groupadd openproject
sudo useradd --create-home --gid openproject openproject
sudo passwd openproject #(enter desired password)
```

## 2. Install the required system dependencies

```bash
[root@host] apt update -y
[root@host] apt install -y zlib1g-dev build-essential           \
                libssl-dev libreadline-dev                      \
                libyaml-dev libgdbm-dev                         \
                libncurses5-dev automake                        \
                libtool bison libffi-dev git curl               \
                poppler-utils unrtf tesseract-ocr catdoc        \
                libxml2 libxml2-dev libxslt1-dev # nokogiri     \
                imagemagick
```

## 3. Install the caching server (memcached)

```bash
[root@host] apt install -y memcached
```

## 4. Install and setup PostgreSQL database server

OpenProject requires PostgreSQL v9.5+.

```bash
[root@host] apt install postgresql postgresql-contrib libpq-dev
```

Switch to the PostgreSQL system user.

```bash
[root@host] su - postgres
```

As PostgreSQL user, create the database user for OpenProject. This will prompt you for a password. We are going to assume in the following guide that this password is ‘openproject’, but choose a strong password.

```bash
[postgres@host] createuser -W openproject
```

Next, create the database owned by the new user:

```bash
[postgres@host] createdb -O openproject openproject
```

Lastly, revert to the previous system user:

```bash
[postgres@host] exit
# You will be root again now.
```

## 5. Installation of Ruby

The are several possibilities to install Ruby. In this guide we'll use [rbenv](http://rbenv.org/). Please be aware that the actual installation of a specific Ruby version takes some time to finish.

```bash
[root@host] su openproject --login
[openproject@host] git clone https://github.com/sstephenson/rbenv.git ~/.rbenv
[openproject@host] echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.profile
[openproject@host] echo 'eval "$(rbenv init -)"' >> ~/.profile
[openproject@host] source ~/.profile
[openproject@host] git clone https://github.com/sstephenson/ruby-build.git ~/.rbenv/plugins/ruby-build

[openproject@host] rbenv install 2.7.1
[openproject@host] rbenv rehash
[openproject@host] rbenv global 2.7.1
```

To check our Ruby installation we run `ruby --version`. It should output something very similar to:

```bash
ruby 2.7.1pXYZ (....) [x86_64-linux]
```

## 6. Installation of Node

The are several possibilities to install Node on your machine: from your distribution repository or manual installation.

### 6.1 Install from your dist repo (recommended)

```bash
sudo apt install nodejs npm
```

### 6.2 Manual installation

We will use [nodenv](https://github.com/OiNutter/nodenv#installation). Please run `su openproject --login` if you are the `root` user. If you are already the `openproject` user you can skip this command. Please be aware that the actual installation of a specific node version takes some time to finish.

```bash
[openproject@host] git clone https://github.com/OiNutter/nodenv.git ~/.nodenv
[openproject@host] echo 'export PATH="$HOME/.nodenv/bin:$PATH"' >> ~/.profile
[openproject@host] echo 'eval "$(nodenv init -)"' >> ~/.profile
[openproject@host] source ~/.profile
[openproject@host] git clone git://github.com/OiNutter/node-build.git ~/.nodenv/plugins/node-build

[openproject@host] nodenv install 8.12.0
[openproject@host] nodenv rehash
[openproject@host] nodenv global 8.12.0
```

### 6.3 Check `node` version

To check our Node installation we run `node --version`. It should output something very similar to:

```bash
v8.12.0
```

## 7. Installation of OpenProject

```bash
[openproject@host] cd ~
[openproject@host] git clone https://github.com/btey/openproject.git --branch master --depth 1
[openproject@host] cd openproject
# Ensure rubygems is up-to-date for bundler 2
[openproject@host] gem update --system
[openproject@host] gem install bundler
# Replace mysql with postgresql if you had to install MySQL
[openproject@host] bundle install --deployment --without mysql2 sqlite development test therubyracer docker
[openproject@host] npm install
```

## 8. Configure OpenProject

Create and configure the database configuration file in `config/database.yml` (relative to the openproject directory).

```bash
[openproject@host] cp config/database.yml.example config/database.yml
```

Now we edit the `config/database.yml` file and insert our database credentials for PostgreSQL. It should look like this (please keep in mind that you have to use the values you used above: user, database and password):

```yaml
production:
  adapter: postgresql
  encoding: unicode
  database: openproject
  pool: 5
  username: openproject
  password: openproject
```

Next we configure email notifications (this example uses a gmail account) by creating the `configuration.yml` in config directory.

```bash
[openproject@host] cp config/configuration.yml.example config/configuration.yml
```

Now we edit the `configuration.yml` file to suit our needs.

```yaml
production:                          #main level
  email_delivery_method: :smtp       #settings for the production environment
  smtp_address: smtp.gmail.com
  smtp_port: 587
  smtp_domain: smtp.gmail.com
  smtp_user_name: ***@gmail.com
  smtp_password: ****
  smtp_enable_starttls_auto: true
  smtp_authentication: plain
```

Add (or uncomment) this line into `configuration.yml` file at the end of the file for a better performance of OpenProject:

```yaml
rails_cache_store: :memcache
```

**NOTE:** You should validate your `yml` files, for example with http://www.yamllint.com/. Both, the `database.yml` and `configuration.yml` file are sensitive to whitespace. It is pretty easy to write invalid `yml` files without seeing the error. Validating those files prevents you from such errors.

## 9. Finish the installation of OpenProject

### 9.1 Secret token

You need to generate a secret key base for the production environment with `./bin/rake secret` and make that available through the environment variable `SECRET_KEY_BASE`. In this installation guide, we will use the local `.profile` of the OpenProject user. You may alternatively set the environment variable in `/etc/environment` or pass it to the server upon start manually in `/etc/apache2/envvars`.

```bash
[openproject@host] echo "export SECRET_KEY_BASE=$(./bin/rake secret)" >> ~/.profile
[openproject@host] source ~/.profile
```

### 9.2 Database creation and Assets precompilation

```bash
[openproject@host] cd ~/openproject
[openproject@host] RAILS_ENV="production" ./bin/rake db:create
[openproject@host] RAILS_ENV="production" ./bin/rake db:migrate
[openproject@host] RAILS_ENV="production" ./bin/rake db:seed
[openproject@host] RAILS_ENV="production" ./bin/rake assets:precompile
```

**NOTE:** When not specified differently, the default data loaded via db:seed will have an english localization. You can choose to seed in a different language by specifying the language via the `LOCALE` environment variable on the call to `db:seed`. E.g.

```bash
[openproject@all] RAILS_ENV="production" LOCALE=fr ./bin/rake db:seed
```

will seed the database in the french language.

## 10. Serve OpenProject with Apache and Passenger

Exit the current bash session with the openproject user, so that we are again in a root shell.

```bash
[openproject@ubuntu] exit
```

Prepare Apache and Passenger:

```bash
[root@host] apt install -y apache2 libcurl4-gnutls-dev      \
                           apache2-dev libapr1-dev \
                           libaprutil1-dev
[root@ubuntu] chmod o+x "/home/openproject"
```

The Passenger gem is installed and integrated into Apache:

```bash
[root@ubuntu] su openproject --login
[openproject@ubuntu] cd ~/openproject
[openproject@ubuntu] gem install passenger
[openproject@ubuntu] passenger-install-apache2-module
```

If you are running on a Virtual Private Server, you need to make sure you have atleast 1GB of RAM before running the `passenger-install-apache2-module`.

Follow the instructions passenger provides. The passenger installer will ask you the question in “Which languages are you interested in?”. We are interested only in ruby.

The passenger installer tells us to edit the Apache config files. To do this, continue as the root user:

```bash
[openproject@host] exit
```

Create the file `/etc/apache2/mods-available/passenger.load` and add the following line. But before copy & paste the following lines, check if the content (especially the version numbers!) is the same as the `passenger-install-apache2-module` installer said. When you’re in doubt, do what passenger tells you.

```apacheconf
LoadModule passenger_module /home/openproject/.rbenv/versions/2.7.1/lib/ruby/gems/2.7.0/gems/passenger-6.0.7/buildout/apache2/mod_passenger.so
```

Create the file `/etc/apache2/mods-available/passenger.conf` with the following contents (again, take care of the version numbers!):

```apacheconf
<IfModule mod_passenger.c>
  PassengerRoot /home/openproject/.rbenv/versions/2.7.1/lib/ruby/gems/2.7.0/gems/passenger-6.0.7
  PassengerDefaultRuby /home/openproject/.rbenv/versions/2.7.1/bin/ruby
</IfModule>
```

Enable the new configuration:

```bash
[root@openproject] a2enmod passenger
```

As the root user, create the file `/etc/apache2/sites-available/openproject.conf` with the following contents:

```apacheconf
SetEnv EXECJS_RUNTIME Disabled

<VirtualHost *:80>
   ServerName yourdomain.com
   # !!! Be sure to point DocumentRoot to 'public'!
   DocumentRoot /home/openproject/openproject/public
   <Directory /home/openproject/openproject/public>
      # This relaxes Apache security settings.
      AllowOverride all
      # MultiViews must be turned off.
      Options -MultiViews
      # Uncomment this if you're on Apache >= 2.4:
      Require all granted
   </Directory>

   # Request browser to cache assets
   <Location /assets/>
     ExpiresActive On ExpiresDefault "access plus 1 year"
   </Location>

</VirtualHost>
```

Enable the new openproject site (and disable the default site, if necessary):

```bash
[root@host] a2dissite 000-default
[root@host] a2ensite openproject
```

Restart Apache:

```bash
[root@host] service apache2 restart
```

Your OpenProject installation should be accessible on port 80 (http). A default admin-account is created for you having the following credentials:

Username: `admin` Password: `admin`

Please, change the password on the first login. Also, we highly recommend to configure the SSL module in Apache for https communication.

## 11. Activate background jobs

OpenProject sends (some) mails asynchronously by using background jobs. All such jobs are collected in a queue, so that a separate process can work on them. This means that we have to start the background worker. To automate this we can create some scripts.

### 11.1 Inbound email

Create a shell script for **inbound** emails (e.g., `/home/openproject/scripts/inbound_emails.sh`):

```bash
#!/bin/bash
source /home/openproject/.profile
cd /home/openproject/openproject;
RAILS_ENV="production" ./bin/rake redmine:email:receive_imap host='' username='' password='' port='993' ssl=true ssl_verification=false folder='INBOX' move_on_success='INBOX/op-read' move_on_failure='INBOX/op-error' project=[project-name] allow_override=project unknown_user=accept no_permission_check=1
```

### 11.2 Outbound emails

Create another shell script for outbound emails (e.g., `/home/openproject/scripts/outbound_emails.sh`):

```shell
#!/bin/bash
source /home/openproject/.profile
cd /home/openproject/openproject;
RAILS_ENV="production" ./bin/rake jobs:workoff
```

### 11.3 Add scripts to crontab

Put scripts for the background worker into a cronjob:

```bash
[root@all] su - openproject -c "bash -l"
[openproject@all] crontab -e
```

Add the following entries:

```bash
*/1 * * * * /home/openproject/scripts/inbound_emails.sh >/dev/null 2>&1
*/1 * * * * /home/openproject/scripts/outbound_emails.sh >/dev/null 2>&1
```

This will start the worker job every minute.

## 12. Troubleshooting

You can find the error logs for apache here:

```bash
/var/log/apache2/error.log
```

The OpenProject logfile can be found here:

```bash
/home/openproject/openproject/log/production.log
```

If an error occurs, it should be logged there.

If you need to restart the server (for example after a configuration change), do:

```bash
[openproject@all] touch ~/openproject/tmp/restart.txt
```