#!/bin/bash

# Set the duration for the while loops
duration=100
# Start time
end=$((SECONDS+duration))

# Start Docker Compose
echo "---Building and starting up docker---"
docker compose up --build -d

# Function to check whether the backend is up and running
check_backend_log_message() {
  docker logs docker_mongo_react_express-backend-1 2>&1 | grep "Server listening on port 8080"
}

# Wait for the backend to be up and running
while [[ -z "$(check_backend_log_message)" && $SECONDS -lt $end ]]; do
  sleep 2
done

# Function to check whether all containers are up and running
count_running_containers() {
  docker ps -q | wc -l
}

# Expected number of containers running
expected_containers=3
# Redefine the 'end' variable for the second while loop
duration2=30
end=$((SECONDS+duration2))

# Wait for all containers to be up and running
while [[ "$(count_running_containers)" -lt "$expected_containers" && $SECONDS -lt $end ]]; do
  sleep 2
done

echo "---Everything worked, have a nice day :)---"
# Stop Docker Compose
docker compose down

