#!/usr/bin/env sh

#echo "...Build the project..."
#yarn config set strict-ssl false
#yarn && \
# yarn run build

appVersion="$(json=$(<package.json) node -pe "JSON.parse(process.env.json)['version']")"
echo "appVersion: ${appVersion}"

echo "...Dockerize the build..."
export dockerhubUser=zeusbaba \
  appName=ulink-api-js \
  appSecrets=app-secrets
export dockerImage=${dockerhubUser}/${appName}:${appVersion}
echo "dockerImage: ${dockerImage}"

#docker build -f Dockerfile -t "${dockerImage}" --rm --no-cache .
docker build -f Dockerfile -t "${dockerImage}" .

docker push "${dockerImage}"
