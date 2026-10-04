# SEO and caching rules for salsbury.co.uk (included from the :443 vhost)
RewriteEngine on
# One canonical host: www -> bare domain
RewriteCond %{HTTP_HOST} ^www\.salsbury\.co\.uk$ [NC]
RewriteRule ^ https://salsbury.co.uk%{REQUEST_URI} [R=301,L,NE]
# Avoid duplicate home page at /index.html
RewriteCond %{THE_REQUEST} \s/index\.html[\s?]
RewriteRule ^/?index\.html$ / [R=301,L]

ErrorDocument 404 /404.html
AddType application/manifest+json .webmanifest

<IfModule mod_headers.c>
  <FilesMatch "\.(png|svg|ico|webmanifest)$">
    Header set Cache-Control "public, max-age=604800"
  </FilesMatch>
  <FilesMatch "\.js$">
    Header set Cache-Control "public, max-age=86400"
  </FilesMatch>
  <FilesMatch "\.(html|xml|txt)$">
    Header set Cache-Control "public, max-age=300"
  </FilesMatch>
  Header always set X-Content-Type-Options "nosniff"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>
