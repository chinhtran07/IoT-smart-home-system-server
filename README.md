# IoT Smart Home System Server

![IoT Smart Home](https://img.shields.io/badge/IoT-Smart%20Home%20System%20Server-blue)

## Overview

The IoT Smart Home System Server is the backend component of a smart home system designed for remote monitoring and control of smart devices. It provides a robust API for managing devices, handling real-time data, and executing automation scenarios.

## Features

- **Device Management**: Register, update, and remove smart home devices.
- **Real-Time Data Handling**: Collect and manage data from connected devices.
- **Automation**: Set up and manage automation rules for device control.
- **User Management**: Handle user authentication and authorization.
- **Real-Time Updates**: Use WebSocket for real-time device status updates.

## Technologies

- **Backend Framework**: Node.js
- **Database**: MongoDB, MySQL
- **Protocols**: MQTT for device communication
- **WebSocket**: For real-time updates

## Getting Started

### Prerequisites

- Node.js
- MongoDB
- MySQL

### Installation

1. **Clone the Repository:**

    ```bash
    git clone https://github.com/chinhtran07/IoT-smart-home-system-server.git
    cd IoT-smart-home-system-server
    ```

2. **Install Dependencies:**

    ```bash
    npm install
    ```

3. **Configure Environment Variables:**

    Copy the `.env.example` file to `.env` and update the configuration as needed.

    ```bash
    cp .env.example .env
    ```

4. **Start the Server:**

    ```bash
    npm start
    ```

### Running with Docker

1. **Build and Run Containers:**

    ```bash
    docker-compose up --build
    ```

2. **Access the Services:**

    - **Backend API**: `http://localhost:3000`
    - **MongoDB**: Accessible within the Docker network at `mongodb://mongo:27017`
    - **MySQL**: Accessible within the Docker network at `mysql://mysql:3306`

3. **Stopping and Removing Containers:**

    ```bash
    docker-compose down
    ```

## API Endpoints

- **GET** `/api/devices` - List all devices.
- **POST** `/api/devices` - Register a new device.
- **PUT** `/api/devices/:id` - Update device information.
- **DELETE** `/api/devices/:id` - Remove a device.
- **POST** `/api/automation` - Create a new automation rule.
- **GET** `/api/automation` - List all automation rules.

## Contributing

We welcome contributions from the community! If you would like to contribute, please create a pull request or open an issue to discuss changes.

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

- [Email](mailto:your.email@example.com)
- [LinkedIn](https://www.linkedin.com/in/yourlinkedinprofile)
- [Twitter](https://twitter.com/yourtwitterhandle)

Feel free to explore the repository and reach out if you have any questions or suggestions!

Happy coding! 🚀