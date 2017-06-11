# We start with the nginx image
FROM nginx:latest

# Add the html directory and overwrite the nginx default page
ADD ./html /usr/share/nginx/html

# Since I'm using windows the perms will be all goofed up
RUN chmod 0755 /usr/share/nginx/html && \
    chmod 0444 /usr/share/nginx/html/*

# We inherit EXPOSE, ENTRYPOINT and CMD from nginx:latest