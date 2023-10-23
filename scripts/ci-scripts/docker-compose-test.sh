#!/bin/bash

set -e

log_file="scripts/ci-scripts/docker_compose_logs.txt"
# Function to collect Docker Compose logs and perform cleanup
cleanup() {
  echo "---Collecting Docker Compose logs---"
  #  docker compose -f docker-compose.test.yml logs -t --no-color > "$log_file" 2>&1
  {
    docker logs express_fullstack-frontend-1 -t
    docker logs express_fullstack-backend-1 -t
    docker logs express_fullstack-backend-tests-1 -t
    docker logs express_fullstack-mymongodb-1 -t
  } > "$log_file" 2>&1
  echo "---Running 'docker compose down'---"
  docker compose -f docker-compose.test.yml down
}

# Trap errors/exit and runs the cleanup func
trap cleanup ERR EXIT

# Start Docker Compose
echo "---Building and starting up docker---"
docker compose -f docker-compose.test.yml up -d --build --force-recreate

# Function to check whether all containers are up and running
count_running_containers() {
  docker ps -q | wc -l
}

# Expected number of containers running
expected_containers=4
# Redefine the 'end' variable for the second while loop
duration=20
end=$((SECONDS+duration))

# Wait for all containers to be up and running
while [[ $SECONDS -lt $end ]]; ss=$?; do
  if [[ "$(count_running_containers)" -eq "$expected_containers" ]]; ss=$?; then
    echo "All containers up"
    break
  fi
  sleep 2
done

if [[ $ss -ne 0 ]]; then
  echo "One or more containers failed to run, with an exit code: $ss"
  exit "$ss"
fi

docker ps -a

echo "Waiting for backend tests to run"

# Check the exit code of the test container
check_test_container_exit_code() {
#  local container_name
#  if [ -n "$GITHUB_ACTIONS" ]; then
#    # Running in GitHub Actions
#    container_name="express_fullstack-backend-tests-1"
#  else
#    # Running locally
#    container_name="docker_mongo_react_express-backend-tests-1"
#  fi
#
#  # Wait for the container to exit
#  docker wait "$container_name"
  docker wait express_fullstack-backend-tests-1
}

# Check the exit code of the test container
exit_code=$(check_test_container_exit_code)
echo "exit code for backend-tests: $exit_code"

if [[ $exit_code -eq 0 ]]; then
  echo "All backend mocha tests passed!"
else
  echo "Backend mocha had $exit_code failing tests"
  echo "Check log file ($log_file) for more information!"
  exit "$exit_code"
fi




## Function to check if Docker Compose logs have any output
#check_docker_compose_logs() {
#  local log_output
#  log_output=$(docker compose -f docker-compose.test.yml logs)
#  [[ $(echo "$log_output" | tail -n +20 | wc -l) -gt 0 ]]
#}


# Wait for meaningful output in Docker Compose logs
#duration_logs=60
#end_logs=$((SECONDS+duration_logs))
#cmd1=$(docker compose -f docker-compose.test.yml logs)
#
#while [[ $SECONDS -lt $end_logs ]] && [[ $(tail -10 "$cmd1") ]] ; do
#  echo "Docker Compose logs have no output. Sleeping for 1 second..."
#  sleep 1
#done
#echo "15 sec sleep"
#sleep 15


#
## Function to check whether the backend is up and running
#check_backend_log_message() {
#  docker compose -f docker-compose.test.yml logs 2>&1 | grep "Server listening on port 8080"
#}
#
## Set the duration for the while loops
#duration_two=100
## Start time
#end=$((SECONDS+duration_two))
#
## Wait for the backend to be up and running
#while [[ $SECONDS -lt $end ]]; do
#  if [[ -n "$(check_backend_log_message)" ]]; ss=$?; then
#    echo "Backend Server listening on port 8080"
#    break
#  fi
#  sleep 2
#done
#
#if [[ $ss -ne 0 ]]; then
#  echo "Backend server failed to run, with an exit code: $ss"
#  exit "$ss"
#fi