#!/bin/bash

#Ask for Version Number
echo Please Enter sogeBot build verion:

read version

rm -R /mnt/d/TheAngryGamerDrive/Development/sogeBot-release/*.sogeBot.tar.gz

tar -czf /mnt/d/TheAngryGamerDrive/Development/sogeBot-release/$version.sogeBot.tar.gz -C /mnt/d/TheAngryGamerDrive/Development sogeBot

ssh chad@reesey275 "rm -f /home/chad/current-build/*.tar.gz"

scp /mnt/d/TheAngryGamerDrive/Development/sogeBot-release/$version.sogeBot.tar.gz chad@reesey275.asosgaming.net:/home/chad/current-build/


ssh chad@reesey275 "mv /home/chad/sogeBot /home/chad/$(date +"%Y_%m_%d_%I_%M_%p")_sogeBot && tar -xvf /home/chad/current-build/* && cp ~/.env ~/sogeBot/ && bash ./start.sh" 
