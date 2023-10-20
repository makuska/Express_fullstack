#!/bin/bash
# Exit as soon as if any of the while loops return a non-zero exit status
set -e

# Set the duration for the while loops
duration=100
# Start time
end=$((SECONDS+duration))

# Start Docker Compose
echo "---Building and starting up docker---"
CI=true docker compose up --build -d

# Function to check whether the backend is up and running
check_backend_log_message() {
  docker logs docker_mongo_react_express-backend-1 2>&1 | grep "Server listening on port 8080"
}

# Wait for the backend to be up and running
while [[ -z "$(check_backend_log_message)" && $SECONDS -lt $end ]]; do
  sleep 2
done

status=$?
if [ $status -eq 0 ]; then
    echo "Backend container up and running"
else
    echo "Unable to start the backend container"
    exit $status
fi

# Function to check whether all containers are up and running
count_running_containers() {
  docker ps -q | wc -l
}

# Expected number of containers running
expected_containers=4
# Redefine the 'end' variable for the second while loop
duration2=30
end=$((SECONDS+duration2))

# Wait for all containers to be up and running
while [[ "$(count_running_containers)" -lt "$expected_containers" && $SECONDS -lt $end ]]; do
  sleep 2
done

status=$?
if [ $status -eq 0 ]; then
    echo "All containers up and running"
else
    echo "Docker compose had one or more failing containers"
    exit $status
fi

echo "---Everything worked, have a nice day :)---"