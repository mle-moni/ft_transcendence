FROM ruby:2.7.2

# install tools that we may use to debug things
RUN apt-get update -qq && apt-get install -y vim

# install yarn
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt update && apt install -y yarn

RUN mkdir /app
WORKDIR /app
COPY . /app
RUN bundle install
RUN yarn install

ENTRYPOINT ["/bin/bash", "/app/entrypoint.sh"]
EXPOSE 3000

# Start the main process.
CMD ["rails", "server", "-b", "0.0.0.0"]