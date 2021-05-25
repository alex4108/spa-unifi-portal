#!/usr/bin/env bash

if [[ $1 != "skip" ]]; then
    OLD_PWD=$(pwd)
    cd ~/unifi-controller
    docker-compose kill
    docker-compose rm -f
    sleep 3
    docker-compose up -d
    sleep 5
    cd ${OLD_PWD}
    read -p "Press ENTER once the unifi portal is configured w/ Guest Portal & API Auth" dummy
fi

rm -rf build.tar.gz
tar cvfz build.tar.gz ./*
CONTAINER_ID=$(docker ps | grep unifi | awk '{print $1}')
docker cp ./build.tar.gz ${CONTAINER_ID}:/usr/lib/unifi/data/sites/default/build.tar.gz
docker exec -it ${CONTAINER_ID} bash -c 'cd /usr/lib/unifi/data/sites/default/app-unifi-hotspot-portal && rm -rf ./* && mv ../build.tar.gz ./ && tar xvfz build.tar.gz'

echo "Deployed!  Test?"