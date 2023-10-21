#!/bin/bash
# Exit as soon as if any of the while loops return a non-zero exit status
set -e
# TODO should use exit codes instead of exit 1

# Start Docker Compose
echo "---Building and starting up docker---"
docker compose -f docker-compose.test.yml up -d --build

# Wait for 15 seconds to ensure that the containers have started and are producing logs
echo "10 second sleep in order for all containers to be up and to check the logs"
sleep 10

# Function to check whether all containers are up and running
count_running_containers() {
  docker ps -q | wc -l
}

# Expected number of containers running
expected_containers=4
# Redefine the 'end' variable for the second while loop
duration=30
end=$((SECONDS+duration))

# Wait for all containers to be up and running
while [[ $SECONDS -lt $end ]]; do
  if [[ "$(count_running_containers)" -eq "$expected_containers" ]]; then
    echo "All containers up and running"
    break
  fi
  sleep 2
done


# Function to check whether the backend is up and running
check_backend_log_message() {
  docker logs docker_mongo_react_express-backend-1 2>&1 | grep "Server listening on port 8080"
}

# Set the duration for the while loops
duration_two=150
# Start time
end=$((SECONDS+duration_two))

# Wait for the backend to be up and running
while [[ $SECONDS -lt $end ]]; do
  if [[ -n "$(check_backend_log_message)" ]]; ss=$?; then
#    if [[ $ss -ne 0 ]]; then
#      echo ""
#    fi
    echo "Backend Server listening on port 8080"
    break
  fi
  sleep 2
done

#status=$?
if [[ -z "$(check_backend_log_message)" ]]; then
  echo "Backend exited with a code"
  #  exit $status
  exit 1
fi


check_test_container_exit_code() {
  # if all tests passed, then mocha will exit with a code 0, otherwise 1
  docker wait docker_mongo_react_express-backend-tests-1
}

# Check the exit code of the test container
exit_code=$(check_test_container_exit_code)

if [[ $exit_code -eq 0 ]]; then
  echo "All backend mocha tests passed!"
else
  echo "Backend mocha had one or more failing tests"
  exit "$exit_code"
fi

echo "---Everything worked, have a nice day :)---"
echo "---Running 'docker compose down'---"
docker compose down

docker logs docker_mongo_react_express-backend-1 > docker_compose_logs.txt