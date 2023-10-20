The reason for using `backend` instead of `localhost` has to do with how Docker Compose networking works.

When you run your application and tests using Docker Compose, each service/container gets its own network. The service names you define in your `docker-compose.yml` file, like `backend` and `mymongodb`, act as DNS names within that network. So, when you use `backend` as the hostname in your tests, it tells Docker Compose to resolve to the IP address of the `backend` service container. This way, your tests can communicate with the `backend` service just as if it was running on `localhost`.

Using `localhost` in the tests would not work because it would refer to the loopback network interface of the test container itself, not the `backend` service container. By using the service name `backend`, you ensure that the requests go to the appropriate container, making it work as expected.

In Docker Compose, the service names serve as hostnames for inter-container communication, and Docker manages the networking automatically. This allows you to easily connect containers and services within the same Compose network.