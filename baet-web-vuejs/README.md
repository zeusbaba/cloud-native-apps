BAET-Frontend-JS
==================

## BAET.no Web Frontend using node.js and Vue.js  

### Prerequisites

In order to build and run this app you need to have a couple of things installed:  

- [Node.js](https://nodejs.org/), [npm](https://www.npmjs.com/), and [Yarn](https://yarnpkg.com) installed, _see [package.json](package.json) for the required versions._
- Get familiar with [VueJS](https://vuejs.org/)._            
- An IDE for the development, like [Atom](https://atom.io) or IntelliJ/Webstorm      
- The Docker Toolbox or native Docker, whatever you prefer. See [Docker](https://docs.docker.com) and [Docker-Compose](https://docs.docker.com/compose/)       


### Building the App  

#### Clone this repo and install deps    

```bash
  # clone this repo  
$ git clone https://github.com/zeusbaba/cloud-native-apps  
$ cd baet-web-vuejs  

  # install dependencies
$ yarn

```   

#### Prepare env-vars  
      

To be able to RUN this app, you _must_ prepare env-vars.    
No worries, this [example-file](_env-example) got you covered!            
```bash
# copy the example template  
$ cp _env-example .env.production  

# open the file and set the values accordingly. it's self-explanatory  
$ vim .env.production    
```


#### Run the App in localhost  

```bash
  # automatically import env-vars you've prepared in prev step    
$ source import-env-vars.sh

  # run the App  
$ yarn start
```

Now you can access via [http://localhost:4044](http://localhost:4044)    


### Containerization with Docker  
_TODO: ..._

### Deploying and Running in Kubernetes (k8s)    
_TODO: ..._
