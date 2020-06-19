NOW=$(date +%s)
docker build -t asos/sogebot:$NOW .
#docker push asos/sogebot:$NOW
#cloudron install --image asos/sogebot:$NOW