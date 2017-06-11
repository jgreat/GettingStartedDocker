GettingStartedDocker
====================

### Install Docker
For detailed instruction see: [https://docs.docker.com/engine/installation/](https://docs.docker.com/engine/installation/)

**TL;DR**

* Windows: `choco install docker-for-windows`
* OSX: [https://download.docker.com/mac/stable/Docker.dmg](https://download.docker.com/mac/stable/Docker.dmg)
* Linux: `curl -sSL https://get.docker.com/ | sudo sh`

If you are running OSX or Windows: Turn on your shared drives
Settings -> Shared Drives


## Container Basics

### First Container
```
docker run -i -t busybox sh

Unable to find image 'busybox:latest' locally
latest: Pulling from library/busybox
1cae461a1479: Pull complete
Digest: sha256:c79345819a6882c31b41bc771d9a94fc52872fa651b36771fbe0c8461d7ee558
Status: Downloaded newer image for busybox:latest
/ #
```
* `run` downloads image if doesn't exist, creates and starts the container
* `-i` interactive (keep stdin open)
* `-t` alocate a tty
* `busybox` the name of the image
* `sh` command to run

### See running containers
In a new shell:

```
docker ps

CONTAINER ID    IMAGE        COMMAND        CREATED         STATUS           PORTS            NAMES
153a7c63af4a    busybox      "sh"           2 minutes ago   Up 2 minutes                      happy_meninsky
```

* `153a7c63af4a` The short id for the container
* `busybox` image name
* `sh` the command that the container was started with
* `happy_meninsky` randomly generated names

### See installed Images
List images
```
docker images

REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
busybox             latest              c75bebcdd211        3 weeks ago         1.11 MB
```

### The names of things
Most objects in Docker are identified by a sha256 hash.  
You can refere to Images, Containers, Volumes, etc... by 
* Full hash `c75bebcdd211f41b3a460c7bf82970ed6c75acaab9cd4c9a4e125b03ca113798`
* Short ID (first 12 characters) `c75bebcdd211`
* Friendly Name 
    * Containers: 
        * Random: emotion_scientist
        * Defined: `--name friendly-name`
    * Images on Docker Hub:
        * user/repository:tag `jgreat/cool-image:1.0.2`
            * "Offical" Images don't require a `user`
            * Default tag is `latest`

### Container Processes
Docker monitors the process of the `command`. If that process dies or is put in the background the container will stop.

Switch back to the origional shell with the running busybox container. Exit the shell with `exit`
```
/ # exit
```

You should be returned back to your local shell.

### See stopped containers
Docker `ps` will by default just list running containers. Use the `-a` option to see all containers.

```
docker ps -a

CONTAINER ID    IMAGE        COMMAND        CREATED         STATUS                   PORTS            NAMES
153a7c63af4a    busybox      "sh"           2 minutes ago   Exited (0) 2 minutes ago                  happy_meninsky
```

### Start a stopped container
```
docker start happy_meninsky
happy_meninsky
```

Existing containers that are started are put in the background. This is the same as starting a container with `-d`.

You can see the container running in the background with `docker ps`.

### View console output from background containes (Logs)
Best Practice: Leave your application running in the forground and log to console. 

To view the logs:
```
docker logs -f happy_meninsky

/ # / #
```
* `-f` "follow" the log.

### Stop a running container
Issue a stop command to the running container 
```
docker stop happy_meninsky
happy_meninsky
```

### Delete a Container
Use the `rm` command to delete a stopped container. You can delete a running container with the `-f` option.
```
docker rm happy_meninsky
happy_meninsky
```

### Delete an Image
Delete the busybox image
```
docker rmi busybox:latest

Untagged: busybox:latest
Untagged: busybox@sha256:c79345819a6882c31b41bc771d9a94fc52872fa651b36771fbe0c8461d7ee558
Deleted: sha256:c75bebcdd211f41b3a460c7bf82970ed6c75acaab9cd4c9a4e125b03ca113798
Deleted: sha256:4ac76077f2c741c856a2419dfdb0804b18e48d2e1a9ce9c6a3f0605a2078caba
```

## Networking
Lets grab an nginx web server and connect with our browser

### Pull the image
You can pull an image without running it.
```
docker pull nginx:latest

latest: Pulling from library/nginx
ff3d52d8f55f: Pull complete
226f4ec56ba3: Pull complete
53d7dd52b97d: Pull complete
Digest: sha256:41ad9967ea448d7c2b203c699b429abe1ed5af331cd92533900c6d77490e0268
Status: Downloaded newer image for nginx:latest
```

### Inspect the Image and Find the Exposed ports
"Exposed" port are hints to you and other docker containers about what ports the containerized process runs on. When containers are "linked" exposed port information and container IP address are passed to the linked container via Environment Variables.

Inspecting an image allows you to see information about the image including the exposed ports.

```
docker inspect nginx:latest
```

```json
[
    {
        "Id": "sha256:958a7ae9e56979be256796dabd5845c704f784cd422734184999cf91f24c2547",
        "RepoTags": [
            "nginx:latest"
        ],
        "RepoDigests": [
            "nginx@sha256:41ad9967ea448d7c2b203c699b429abe1ed5af331cd92533900c6d77490e0268"
        ],
        "Parent": "",
        "Comment": "",
        "Created": "2017-05-30T17:10:45.958244153Z",
        "Container": "d7194c56a9009e7e69c9b0414467547357c50f0c74b94d73236d5ddb67f4975a",
        "ContainerConfig": {
            "Hostname": "77fbea4a3f5b",
            "Domainname": "",
            "User": "",
            "AttachStdin": false,
            "AttachStdout": false,
            "AttachStderr": false,
            "ExposedPorts": {
                "80/tcp": {}
            },
            "Tty": false,
            "OpenStdin": false,
            "StdinOnce": false,
            "Env": [
                "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
                "NGINX_VERSION=1.13.1-1~stretch",
                "NJS_VERSION=1.13.1.0.1.10-1~stretch"
            ],
            "Cmd": [
                "/bin/sh",
                "-c",
                "#(nop) ",
                "CMD [\"nginx\" \"-g\" \"daemon off;\"]"
            ],
            "ArgsEscaped": true,
            "Image": "sha256:c5ddc4e4bd79d5b5c4f2e76f2359cb00accb99bb6a545957dfd3a9708ea24b4d",
            "Volumes": null,
            "WorkingDir": "",
            "Entrypoint": null,
            "OnBuild": [],
            "Labels": {},
            "StopSignal": "SIGTERM"
        },
        "DockerVersion": "17.03.1-ce",
        "Author": "NGINX Docker Maintainers \"docker-maint@nginx.com\"",
        "Config": {
            "Hostname": "77fbea4a3f5b",
            "Domainname": "",
            "User": "",
            "AttachStdin": false,
            "AttachStdout": false,
            "AttachStderr": false,
            "ExposedPorts": {
                "80/tcp": {}
            },
            "Tty": false,
            "OpenStdin": false,
            "StdinOnce": false,
            "Env": [
                "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
                "NGINX_VERSION=1.13.1-1~stretch",
                "NJS_VERSION=1.13.1.0.1.10-1~stretch"
            ],
            "Cmd": [
                "nginx",
                "-g",
                "daemon off;"
            ],
            "ArgsEscaped": true,
            "Image": "sha256:c5ddc4e4bd79d5b5c4f2e76f2359cb00accb99bb6a545957dfd3a9708ea24b4d",
            "Volumes": null,
            "WorkingDir": "",
            "Entrypoint": null,
            "OnBuild": [],
            "Labels": {},
            "StopSignal": "SIGTERM"
        },
        "Architecture": "amd64",
        "Os": "linux",
        "Size": 109388645,
        "VirtualSize": 109388645,
        "GraphDriver": {
            "Name": "overlay2",
            "Data": {
                "LowerDir": "/var/lib/docker/overlay2/8d638753473f42e01d4bb65f1e3de271ae8777502c316405d49376282c154842/diff:/var/lib/docker/overlay2/bcbf43862ec169c8e4d85be2c7b971d7110a0928fbd6128d71cc61da1dc5bf1f/diff",
                "MergedDir": "/var/lib/docker/overlay2/55fddff7c7dc42b6f57efd03263bc7148e6110eef779e4250ea70fffe65d2ca8/merged",
                "UpperDir": "/var/lib/docker/overlay2/55fddff7c7dc42b6f57efd03263bc7148e6110eef779e4250ea70fffe65d2ca8/diff",
                "WorkDir": "/var/lib/docker/overlay2/55fddff7c7dc42b6f57efd03263bc7148e6110eef779e4250ea70fffe65d2ca8/work"
            }
        },
        "RootFS": {
            "Type": "layers",
            "Layers": [
                "sha256:8781ec54ba04ce83ebcdb5d0bf0b2bb643e1234a1c6c8bec65e8d4b20e58a90d",
                "sha256:7487bf0353a783b96a4c3bd1176847416d449940caa7592a0d31844ad16b3bce",
                "sha256:a552ca691e492edcae1873b2a3c43260f776cc2f4997c7de74cf367c0407a991"
            ]
        }
    }
]
```

We can see that nginx exposes port `80/tcp` by default.  Other ports may be exposed on the commad line at `run` options.

### Publish a port
Containers have their own private network. On that network containers can connect to any ports on other containers. To connect to a container from your web browser or other local process you will need to "Publish" that port.

```
docker run -d -p 127.0.0.1:80:80 --name web nginx
1a3675a000a86d4a33ea6511b110095aafeeea13e69841234bb67aba2156c168
```
* `-d` Background (daemon) the container
* `-p 127.0.0.1:80:80` [Host IP]:[Host Port]:[Container Port]
    * publish container port 80 on the local loopback 127.0.0.1 port 80
    * `-p 80:80` would publish container port 80 to all IP addresses (to the world) on your host
    * `-p 127.0.0.1:8080:80` would map the container port 80 to your host port 8080

Connect with your browser to [http://127.0.0.1](http://127.0.0.1). You should see the default nginx page.

**Clean Up**  
Remove the running container using the name we provided
```
docker rm -f web
```

## Volumes
Sometimes you need to modify a container from what it provides by default. One way to do this is to share a file or directory between your host and the container.

Lets add our custom index.html file with a shared volume.

Docker requires a Fully Qualified Path when specifying your volume. Your `-v` option is going to vary from mine.

```
docker run -d -p 127.0.0.1:80:80 -v c:/Users/jgreat/git/GettingStartedDocker/nginx/html:/usr/share/nginx/html --name web nginx
```
* `-v c:/Users/jgreat/git/GettingStartedDocker/nginx/html:/usr/share/nginx/html`
    * `/localhost/file:/container/destination`

Connect with your browser to [http://127.0.0.1](http://127.0.0.1). You should see the new page.

**Troubleshooting**  
* Did you turn on Shared Volumes in the Docker-For-... Settings?
* Did you use the correct path?

**Clean Up**  
Remove the running container using the name we provided
```
docker rm -f web
```

## Build

### Build an Image
Lets make our own image based off the nginx container and include our index.html 
```
cd nginx

docker build -t jgreat/getting-started:latest .
```
* `-t jgreat/getting-started:latest` the image tag including user and repo name 

### Run the Image
```
docker run -it --rm -p 127.0.0.1:80:80 jgreat/getting-started:latest
```
* `--rm` will delete the continer after you exit.

Connect with your browser to [http://127.0.0.1](http://127.0.0.1). You should see the new page.

### Tag the Image
We can apply tags to your new docker contaner. Many tags can point to the same image.

```
docker tag jgreat/getting-started:latest jgreat/getting-started:0.0.1-nginx
```

### Push the Image
Push the image up to docker hub for deployment or sharing.

Login to docker hub
```
docker login
```

If you don't specify a tag, all the tags will be pushed up.
```
docker push jgreat/getting-started
```

## Local Development with Docker
A little bit out of date, but this blog goes over the basics
https://blog.docker.com/2016/07/live-debugging-docker/

### Docker Compose
Docker Compose is a way to specify and configure a group of services. Each service may run one or more containers. 

Lets check out `nodejs/docker-compose.yaml`

### Develop Live
Walk thorough of setting up the containers, database, volumes.

* Sharing the code directory with the web stack
* Environment Variables
* .dockerignore
* Dockerfile
* .vscode/launch.json
* nodemon

**Start up your application stack**  
```
docker-compose up
```

**Connect the debuger**  
VSCode Debuger

**Modify Code**  
Watch nodemon pick up changes and restart.

### Destroy your application stack
Stop containers, remove volumes and local images.

```
docker-compose down -v --rmi local 
```
Omit the `-v` to keep your database volume.

### More Resources and Reading
[https://hub.docker.com](https://hub.docker.com)  
[https://docs.docker.com/engine/userguide/eng-image/dockerfile_best-practices/](https://docs.docker.com/engine/userguide/eng-image/dockerfile_best-practices/)  
[https://12factor.net/](https://12factor.net/)  
