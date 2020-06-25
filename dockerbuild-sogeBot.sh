VERSION=$(sed -nE 's/^\s*"version": "(.*?)",$/\1/p' package.json)
docker build -t asos/sogebot:$VERSION .
docker push asos/sogebot:$VERSION
cloudron install --image asos/sogebot:$VERSION
