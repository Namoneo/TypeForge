#!/bin/sh
# Substitute env vars into index.html at container start, then hand off to nginx.
# SENTRY_DSN defaults to empty string if unset, which disables Sentry in the browser.
export SENTRY_DSN="${SENTRY_DSN:-}"

envsubst '${SENTRY_DSN}' < /usr/share/nginx/html/index.html \
  > /usr/share/nginx/html/index.html.tmp \
  && mv /usr/share/nginx/html/index.html.tmp /usr/share/nginx/html/index.html

exec nginx -g 'daemon off;'
