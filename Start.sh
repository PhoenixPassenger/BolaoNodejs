cd dockers
sudo -p $1 docker-compose up app
cd ..
sudo -p $1 npm install
sudo -p $1 npm start