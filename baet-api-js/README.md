# BAET-API-Server-JS

> BAET.no API Server using FeathersJS

### Prerequisites

In order to build and run this app you need to have a couple of things installed:  

- [Node.js](https://nodejs.org/), [npm](https://www.npmjs.com/), and [Yarn](https://yarnpkg.com) installed, _see [package.json](package.json) for the required versions._      
- An IDE for the development, like [Atom](https://atom.io) or IntelliJ/Webstorm      
- The Docker Toolbox or native Docker, whatever you prefer. See [Docker](https://docs.docker.com) and [Docker-Compose](https://docs.docker.com/compose/)       


### Building the App  

Getting up and running is easy  
   
1. Install your dependencies

    ```
    cd path/to/baet-api-js; yarn install
    ```

2. Start your app

    ```
    yarn start
    ```
For more information about FeathersJS visit [docs.feathersjs.com](http://docs.feathersjs.com).  

**WARNING** This APP requires a MongoDB instance to connect to!!!      
You can either get yourself a free instance via [mLab](https://mlab.com)  
or just follow the instructions in _docker-compose_ related section below.      


### Containerization with Docker  
Before you begin, you _must_ prepare env-vars which are required to run the app and related services.  
No worries, I've added an [example-file](docker_vars_env-example)          
```bash
# copy the example template  
$ cp docker_vars_env-example docker_vars.env  

# open the file and set the values accordingly. it's self-explanatory      
```

Building, publishing and running via _Docker_ and _Docker-Compose_:       
```bash
## using Docker!!!  
# NOTE! you must use your own DockerHub username, so just replace 'zeusbaba/' with yours     
# build a docker image  
$ docker build -t zeusbaba/baet-api-js:4.0.0 .    
$ docker images  	
# (optional) publish the image to docker hub  
$ docker push zeusbaba/baet-api-js:4.0.0  

# (optional) run the docker image locally    
$ docker run \
	-p 4042:4042 \
	--env-file ./docker_vars.env \
	-e "NODE_ENV=production" \
	zeusbaba/baet-api-js:4.0.0  


## using Docker Compose!!! 
$ docker-compose up --build 

# NOTE: in linux-env you might have permission problems with 'docker-data-*' folders      
# to fix; stop docker-compose, set permissions as below, then run docker-compose again.    
$ sudo chown 1001:1001 -R docker-data-*  

# shut it down 
$ docker-compose down   
```

### Running in Kubernetes  
TODO: coming soon... :)     
