#!/bin/bash

# Read the image list file
while IFS= read -r image; do
    # Pull the image using Docker
    docker pull "$image"
    
    # Load the image into Minikube
    minikube image load "$image"

    # echo the image name
    echo "Image $image loaded into Minikube"
done < image_list.txt