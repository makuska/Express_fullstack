#!/bin/bash
# Exit as soon as if any of the while loops return a non-zero exit status
set -e

# Set the duration for the while loops
duration=150
# Start time
end=$((SECONDS+duration))

# Start Docker Compose
echo "---Building and starting up docker---"
docker compose -f docker-compose.test.yml up --build --abort-on-container-exit

# Function to check whether the backend is up and running
check_backend_log_message() {
  docker logs docker_mongo_react_express-backend-1 2>&1 | grep "Server listening on port 8080"
}

# Wait for the backend to be up and running
while [[ $SECONDS -lt $end ]]; do
  if [[ -n "$(check_backend_log_message)" ]]; then
    echo "Backend container up and running"
    break
  fi
  sleep 2
done

if [[ -z "$(check_backend_log_message)" ]]; then
  echo "Unable to start the backend container"
  exit 1
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
while [[ $SECONDS -lt $end ]]; do
  if [[ "$(count_running_containers)" -eq "$expected_containers" ]]; then
    echo "All containers up and running"
    break
  fi
  sleep 2
done

if [[ "$(count_running_containers)" -ne "$expected_containers" ]]; then
  echo "Docker compose had one or more failing containers"
  exit 1
fi

echo "---Everything worked, have a nice day :)---"
docker compose down