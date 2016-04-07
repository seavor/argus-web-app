# Project - Argus Web Client

## Application Environment Setup

### Option 1) Apache VirtualHost

Include the following snippet in your VirtualHost configuration file:
```
<VirtualHost *:80>
    DocumentRoot "/path/to/project/argus-web-client"
    ServerName toptal.dev
    <Directory "/path/to/project/argus-web-client">
        Options +FollowSymLinks
        Header set Access-Control-Allow-Origin "*"
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

Include the following line in your apache `hosts` file: `127.0.0.1 argus.dev`

### Option 2) Use MAMP Application

Download the MAMP application, point the root directory to the project folder, and launch the MAMP server. Application will be available via `localhost:8888`.
