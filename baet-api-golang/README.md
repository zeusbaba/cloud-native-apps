BAET-API-Server-Golang
======================

## BAET.no API Server using Golang

### Prerequisites

In order to build and run this app you need to have a couple of things installed:  

- The [Go SDK](https://golang.org)              
- An IDE for the development, like [Atom](https://atom.io) or IntelliJ/Goland      
- The Docker Toolbox or native Docker, whatever you prefer. See [Docker](https://docs.docker.com) and [Docker-Compose](https://docs.docker.com/compose/)       


### Building the App  


#### Clone this repo     

```bash
  # clone this repo  
$ git clone https://github.com/zeusbaba/cloud-native-apps  
$ cd baet-api-golang  


```   

#### Prepare env-vars  

**WARNING** This APP requires a MongoDB instance to connect to!!!      
You can either get yourself a free instance via [mLab](https://mlab.com)  
or just follow the instructions in _docker-compose_ related section below.      

To be able to RUN this app, you _must_ prepare env-vars.    
No worries, this [example-file](baet-api-secrets/docker_vars_env-example) got you covered!            
```bash
# copy the example template  
$ cp docker_vars_env-example docker_vars.env  

# open the file and set the values accordingly. it's self-explanatory  
$ vim docker_vars.env    
```

#### Run the App in localhost  

```bash
  # automatically import env-vars you've prepared in prev step    
$ source import-env-vars.sh

  # run the App  
$ go run baet-api.go

# build & run it
$ go build baet-api.go
$ ./baet-api

```

Now you can access your API by using this [Postman collection](https://documenter.getpostman.com/view/2611563/RzfZPt3c)  


### Containerization with Docker  

Building, publishing and running via _Docker_ and _Docker-Compose_:       
```bash
# set env vars for ease-of-use
# NOTE! please just replace 'zeusbaba' with your user  
$ export dockerhubUser=zeusbaba \
  export appName=baet-api-golang \
  export appSecrets=baet-api-secrets \
  export appVersion=1.0.1
$ export dockerImage=${dockerhubUser}/${appName}:${appVersion}
  
  # required for compatibility
$ GOOS=linux GOARCH=amd64 go build

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
	-p 4042:4042 \
	--env-file ./${appSecrets}/docker_vars.env \
	${dockerImage}  


## using Docker Compose!!! 
$ docker-compose up --build 

  # NOTE: in linux-env you might have permission problems with 'docker-data-*' folders      
  # to fix; stop docker-compose, set permissions as below, then run docker-compose again.    
$ sudo chown 1001:1001 -R docker-data-*  

  # shut it down 
$ docker-compose down   
```

### Deploying and Running in Kubernetes (k8s)    

We already have created `docker_vars.env` file    
which contains all env-vars which is required for our app to run!      

To be able to inject this file into k8s cluster, we can either use `secrets` or `configmap`  
As you've seen `docker_vars.env` file contains sensitive data like `AUTH_SECRET`, therefore it's recommended to use `secrets` in k8s.  

#### k8s secrets  
Thus, we must create _k8s-secrets_  to inject our env-vars from this file.    

```bash
$ export appSecrets=baet-api-secrets
  
  # create using secrets   
$ kubectl create secret \
    generic ${appSecrets} \
    --from-file=${appSecrets}/docker_vars.env
  
  # validate its creation
$ kubectl get secrets     
$ kubectl get secret ${appSecrets} -o yaml  
  # if you want to delete  
$ kubectl delete secret ${appSecrets}

```

#### minikube 
Please make sure that you already have installed [minikube](https://github.com/kubernetes/minikube)    
We'll use local k8s-cluster with `minikube`.

After you've installed minikube, run the basic commands for preparation:  
```bash
# start minikube  
$ minikube start  
# using dockerd inside minikube
$ eval $(minikube docker-env)  

# you must rebuild app's docker image so that minikube acquires it
$ docker build \
  -t ${dockerImage} \
  --rm --no-cache .
```

TODO: add k8s-pods, deployments, service, ingress
