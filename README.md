# ft_transcendence

## HOW TO GET THE APPLICATION RUNNING ON LINUX:

### install docker-compose:

arch: `sudo pacman -S docker-compose`

debian/ubuntu/etc..: `sudo apt-get install docker-compose` (not tested yet) 

### launch app: 
- `git clone https://github.com/mle-moni/ft_transcendence.git`
- `cd ft_transcendence`
- `sudo docker-compose up --build`

build without launch: `sudo docker-compose build`

launch without rebuilding: `sudo docker-compose up`

## RUN COMMANDS IN THE CONTAINER

`sudo docker-compose run web bash`

usefull to `bundle install`, `yarn add`, `rails db:migrate`, `rails g ...`, and so on

## HOW TO DEV ON THE PROJECT:

the folder that you created with git clone is mounted into the rails container, so you can work on the project by just editing files on your machine

if you need to reload the rails server, just `CTRL + c` to stop and `sudo docker-compose up` to get it working again