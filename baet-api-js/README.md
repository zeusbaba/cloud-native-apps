BAET-API-Server-JS
==================

## BAET.no API Server using node.js and FeathersJS

### Prerequisites

In order to build and run this app you need to have a couple of things installed:  

- [Node.js](https://nodejs.org/), [npm](https://www.npmjs.com/), and [Yarn](https://yarnpkg.com) installed, _see [package.json](package.json) for the required versions._
- Get familiar with [FeathersJS](http://docs.feathersjs.com)._            
- An IDE for the development, like [Atom](https://atom.io) or IntelliJ/Webstorm      
- The Docker Toolbox or native Docker, whatever you prefer. See [Docker](https://docs.docker.com) and [Docker-Compose](https://docs.docker.com/compose/)       


### Building the App  


#### Clone this repo and install deps    

```bash
  # clone this repo  
$ git clone https://github.com/zeusbaba/cloud-native-apps  
$ cd baet-api-js  

  # install dependencies
$ yarn

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
$ yarn start
```

Now you can access your API by using this [Postman collection](https://documenter.getpostman.com/view/2611563/RzfZPt3c)  


### Containerization with Docker  

Building, publishing and running via _Docker_ and _Docker-Compose_:       
```bash
# set env vars for ease-of-use
# NOTE! please just replace 'zeusbaba' with your user  
$ export dockerhubUser=zeusbaba \
  export appName=baet-api-js \
  export appSecrets=baet-api-secrets \
  export appVersion=4.0.2
$ export dockerImage=${dockerhubUser}/${appName}:${appVersion}

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

### Deploying and Running in Kubernetes (k8s)    

We already have created `docker_vars.env` file    
which contains all env-vars which is required for our app to run!      

To be able to inject this file into k8s cluster, we can either use `secrets` or `configmap`  
As you've seen `docker_vars.env` file contains sensitive data like `AUTH_SECRET`, therefore it's recommended to use `secrets` in k8s.  

#### k8s secrets  
Thus, we must create _k8s-secrets_  to inject our env-vars from this file.    

```bash

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

#### k8s Pods 
Now we can proceed with _k8s deployment_ using [k8s-pod.yaml](k8s-pod.yaml)        
```bash
$ export appName=baet-api-js
$ kubectl apply -f k8s-pod.yaml  
$ kubectl get pods  
$ kubectl describe pod ${appName}
$ kubectl logs ${appName} --follow

  # shell access to the pod
$ kubectl exec -it ${appName} /bin/bash

  # basic access via port-forward
$ kubectl port-forward ${appName} 4042:4042 

 # if you want to delete 
$ kubectl delete pod ${appName}
```

#### k8s Deployments and Services
More common and advanced version is using Deployments and Services.  
See [k8s-deployment.yaml](k8s-deployment.yaml) and [k8s-service.yaml](k8s-service.yaml)  


```bash
  # list existing 
$ kubectl get services,deployments,pods

  # k8s-deployment
$ kubectl apply -f k8s-deployment.yaml
$ kubectl get deployments,pods

  # k8s-service
$ kubectl apply -f k8s-service.yaml
$ kubectl get services
$ kubectl describe service ${appName}

  # if you want to delete
$ kubectl delete -f k8s-deployment.yaml
$ kubectl delete -f k8s-service.yaml
```

#### k8s Ingress
Assuming that you already have configured [Traefik](https://docs.traefik.io) as Ingress Controller of your k8s-cluster.  
here's how you can deploy  [k8s-ingress](k8s-ingress.yaml) for this App  

```bash
  # create ingress   
$ kubectl apply -f k8s-ingress.yaml 

  # validate
$ kubectl get ingresses
  NAME          HOSTS                       ADDRESS   PORTS   AGE
  baet-api-js   api2.baet.no,api3.baet.no             80      10m

  # if you want to delete 
$ kubectl delete ingress baet-api-js
```
