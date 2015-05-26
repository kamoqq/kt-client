#!/usr/bin/env bash

sudo apt-get update
sudo apt-get install g++
sudo apt-get install zlib1g-dev

wget http://fallabs.com/kyotocabinet/pkg/kyotocabinet-1.2.76.tar.gz
tar zxvf kyotocabinet-1.2.76.tar.gz
cd kyotocabinet-1.2.76
./configure
make
sudo make install

cd -

wget http://fallabs.com/kyototycoon/pkg/kyototycoon-0.9.56.tar.gz
tar zxvf kyototycoon-0.9.56.tar.gz
cd kyototycoon-0.9.56
./configure
make
sudo make install
