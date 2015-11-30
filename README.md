# incipit
This framework is created for init a new web standard project.
GULP and SCSS frontend based.
PHP and MySQL backend base.

> **incipit**
> *ìn·ci·pit*
> In the codes, initial word of the formula
> that is usually placed at the beginning of a work or part thereof

## Gulp
The Gulp file's architeture is composed by
```
::ROOT
├── gulp
│   ├── task
│   │   ├── base
│   │   │   ├── compileStyle.js
│   │   │   ├── concatScript.js
│   │   │   ├── optimizeImage.js
│   │   │   └── uglifyScript.js
│   │   ├── useful
│   │   │   ├── clean.js
│   │   │   └── watch.js
│   │   ├── default.js
│   │   ├── dev.js
│   │   └── dist.js
│   └── config.js
├── node_modules
│   ├── module 1
│   ├── ...
│   └── module n
├── package.json
└── gulpfile.js
```

## Virtual Host
This is an example code for configurate your web project VH
### Host OS
In Windows you can find the file in this path `C:\Windows\System32\drivers\etc\hosts`
```
127.0.0.1       www.webproject.dom
127.0.0.1           webproject.dom
```
### Vhost in Web Server
In Windows with XAMPP you can find the file in this path `C:\xampp\apache\conf\extra\httpd-vhosts.conf `
```
## WEBPROJECT
<VirtualHost www.webproject.dom:80>
    DocumentRoot "C:/xampp/htdocs/webprojectfolder/dist/public_html"
    ServerName www.webproject.dom
    ServerAlias www.webproject.dom
    <Directory "C:/xampp/htdocs/webprojectfolder/dist/public_html">
        Order allow,deny
        Allow from all
    </Directory>
</VirtualHost>
<VirtualHost webproject.dom:80>
    DocumentRoot "C:/xampp/htdocs/webprojectfolder/dist/public_html"
    ServerName webproject.dom
    ServerAlias webproject.dom
    <Directory "C:/xampp/htdocs/websitefolder/dist/public_html">
        Order allow,deny
        Allow from all
    </Directory>
</VirtualHost>
```

## SEO
### Schema.org
#### JSON+LD
For create the JSON+LD for better SEO, use this [simple tool](http://json-ld.org/playground/)
#### Open Graph
For create the Open Graph structure for better SEO and social sharing, use this [simple tool](http://www.metataggenerator.org/open-graph-meta-tags/)
