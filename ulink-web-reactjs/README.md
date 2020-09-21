uLINK-WEB-ReactJS
==================

## uLINK.no WEB using ReactJS

### Prerequisites

In order to build and run this app you need to have a couple of things installed:  

- [Node.js](https://nodejs.org/), [npm](https://www.npmjs.com/), and [Yarn](https://yarnpkg.com) installed, _see [package.json](package.json) for the required versions._
- Get familiar with [ReactJS](https://www.reactjs.org)._            
- An IDE for the development, like [Atom](https://atom.io) or IntelliJ/Webstorm      
- The Docker Toolbox or native Docker, whatever you prefer. See [Docker](https://docs.docker.com) and [Docker-Compose](https://docs.docker.com/compose/)       


### Building the App  


#### Clone this repo and install deps    

```bash
  # clone this repo  
$ git clone https://github.com/zeusbaba/cloud-native-apps  
$ cd ulink-web-reactjs  

  # install dependencies
$ yarn

  # run the App  
$ yarn start
```   


### Containerization with Docker  

Building, publishing and running via _Docker_ and _Docker-Compose_:       
```bash
### using Docker hub
# set env vars for ease-of-use
# NOTE! please just replace 'zeusbaba' with your username  
$ export dockerhubUser=zeusbaba \
  export appName=ulink-web-reactjs \
  export appSecrets=app-secrets \
  export appVersion=2020.1.1
$ export dockerImage=${dockerhubUser}/${appName}:${appVersion}

### using Github packages  
# when using github packages, remember to login to Github using auth_token  
$ cat ~/GH_TOKEN.txt | docker login docker.pkg.github.com -u ${githubUser} --password-stdin

$ export githubUser=zeusbaba \
  export githubRepo=cloud-native-url-shortener \
  export appName=ulink-web-reactjs \
  export appSecrets=app-secrets \
  export appVersion=2020.9.21
$ export dockerImage=docker.pkg.github.com/${githubUser}/${githubRepo}/${appName}:${appVersion}


## using Docker!!!       
# build a docker image  
$ docker build \
  -t ${dockerImage} \
  --rm --no-cache .    
$ docker images  	
# (optional) publish the image to docker hub  
$ docker push ${dockerImage}  

# (optional) run the docker image locally    
$ docker run \
	-p 4048:4048 \
	--env-file ./${appSecrets}/docker_vars.env \
	-e "NODE_ENV=production" \
	${dockerImage}  


## using Docker Compose!!! 
$ docker-compose up --build 

  # NOTE: in linux-env you might have permission problems with 'docker-data-*' folders      
  # to fix; stop docker-compose, set permissions as below, then run docker-compose again.    
$ sudo chown 1001:1001 -R docker-data-*  

  # shut it down 
$ docker-compose down   
```
