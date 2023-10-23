#!/bin/bash

set -e

log_file="scripts/ci-scripts/docker_compose_logs.log"
# Function to collect Docker Compose logs and perform cleanup
cleanup() {
  echo "---Collecting Docker Compose logs---"
  # Sort the logs based on time; https://github.com/docker/compose/issues/5398#issuecomment-654816131
  docker compose -f docker-compose.test.yml logs -t --no-color | sort -u -k 3 | less > "$log_file" 2>&1
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
  docker wait express_fullstack-backend-tests-1
}

exit_code=$(check_test_container_exit_code)
echo "exit code for backend-tests: $exit_code"

if [[ $exit_code -eq 0 ]]; then
  echo "All backend mocha tests passed!"
else
  echo "Backend mocha had $exit_code failing tests"
  echo "Check log file ($log_file) for more information!"
  exit "$exit_code"
fi