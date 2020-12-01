#!/bin/bash
set -e

# Remove a potentially pre-existing server.pid for Rails.
rm -f /app/tmp/pids/server.pid

bundle install
yarn install

# rails db:reset

# rails db:drop
rails db:create
rails db:migrate
rails db:seed

# Then exec the container's main process (what's set as CMD in the Dockerfile).
exec "$@"