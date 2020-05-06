#!/bin/bash

#Ask for Version Number
echo Please Enter sogeBot build verion:

read version

rm -R *.sogeBot.tar.gz

tar -czf $version.sogeBot.tar.gz -C /Development sogeBot

ssh chad@reesey275 "rm -f ~/current-build/*.tar.gz"

scp /Development/sogeBot-release/$version.sogeBot.tar.gz chad@reesey275.asosgaming.net:~/current-build/


ssh chad@reesey275 "mv ~/sogeBot ~/$(date +"%Y_%m_%d_%I_%M_%p")_sogeBot && tar -xvf ~/current-build/* && cp ~/.env ~/sogeBot/ && bash ./start.sh" 
