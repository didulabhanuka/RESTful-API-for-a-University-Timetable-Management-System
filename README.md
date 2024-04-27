#  RESTful API for a University Timetable Management System

This project is a comprehensive application designed to manage various aspects of an educational institution, including user authentication, course management, class session scheduling, resource management, and booking management.

### Setup Instructions

1. Clone the repository: `git clone <repository-url>`
2. Navigate to the project directory: `cd <project-directory>`
3. Install dependencies: `npm install`
4. Set up environment variables:
   - Create a `.env` file in the root directory.
   - Define the following environment variables in the `.env` file:
     ```
     MONGODB_URL=<your-mongodb-url>
     TOKEN_SECRET=<your-secret-key>
     ```
5. Start the server: `node server.js`

### API Endpoint Documentation

#### Authentication

- **POST /api/user/register**
  - Description: Register a new user.
  - Request Body:
    ```
    {
        "name": "string",
        "email": "string",
        "password": "string",
        "role": "string" (Valid values: "Admin", "Faculty", "Student")
    }
    ```
  - Response: User object or error message.

- **POST /api/user/login**
  - Description: Login with existing credentials.
  - Request Body:
    ```
    {
        "email": "string",
        "password": "string"
    }
    ```
  - Response: JWT token or error message.

#### Courses

- **POST /api/courses/add**
  - Description: Add a new course.
  - Request Body:
    ```
    {
        "courseName": "string",
        "courseCode": "string",
        "courseDescription": "string",
        "courseCredits": number
    }
    ```
  - Response: Success message or error message.

- **GET /api/courses/**
  - Description: Get all courses.
  - Response: Array of course objects.

- **GET /api/courses/get/:id**
  - Description: Get a specific course by ID.
  - Response: Course object or error message.

- **PUT /api/courses/update/:id**
  - Description: Update a course by ID.
  - Request Body:
    ```
    {
        "courseName": "string",
        "courseCode": "string",
        "courseDescription": "string",
        "courseCredits": number
    }
    ```
  - Response: Success message or error message.

- **DELETE /api/courses/delete/:id**
  - Description: Delete a course by ID.
  - Response: Success message or error message.

- **GET /api/courses/:id/timetable**
  - Description: Get timetable for a specific course by ID (Protected route for students).
  - Response: Timetable object or error message.

- **POST /api/courses/:id/enroll**
  - Description: Enroll in a course (Protected route for students).
  - Response: Success message or error message.

- **GET /api/courses/:id/enrollments**
  - Description: View enrollments for a specific course by ID.
  - Response: Enrollments object or error message.

#### Class Sessions

- **POST /api/sessions/add**
  - Description: Add a new class session.
  - Request Body:
    ```
    {
        "course": "string (course ID)",
        "module": "string",
        "date": "string",
        "time": "string",
        "location": "string"
    }
    ```
  - Response: Success message or error message.

- **GET /api/sessions/**
  - Description: Get all class sessions.
  - Response: Array of class session objects.

- **GET /api/sessions/get/:id**
  - Description: Get a specific class session by ID.
  - Response: Class session object or error message.

- **PUT /api/sessions/update/:id**
  - Description: Update a class session by ID.
  - Request Body:
    ```
    {
        "course": "string (course ID)",
        "module": "string",
        "date": "string",
        "time": "string",
        "location": "string"
    }
    ```
  - Response: Success message or error message.

- **DELETE /api/sessions/delete/:id**
  - Description: Delete a class session by ID.
  - Response: Success message or error message.

- **GET /api/sessions/get/:course**
  - Description: Get class sessions for a specific course by ID.
  - Response: Array of class session objects.

#### Resources

- **POST /api/resources/add**
  - Description: Add a new resource.
  - Request Body:
    ```
    {
        "resourceType": "string",
        "quantity": number
    }
    ```
  - Response: Success message or error message.

- **GET /api/resources/**
  - Description: Get all resources.
  - Response: Array of resource objects.

- **GET /api/resources/get/:id**
  - Description: Get a specific resource by ID.
  - Response: Resource object or error message.

- **PUT /api/resources/update/:id**
  - Description: Update a resource by ID.
  - Request Body:
    ```
    {
        "resourceType": "string",
        "quantity": number
    }
    ```
  - Response: Success message or error message.

- **DELETE /api/resources/delete/:id**
  - Description: Delete a resource by ID.
  - Response: Success message or error message.

#### Bookings

- **POST /api/bookings/add**
  - Description: Add a new booking.
  - Request Body:
    ```
    {
        "resourceId": "string (resource ID)",
        "resourceQty": number,
        "roomId": "string",
        "date": "string",
        "startTime": "string",
        "endTime": "string"
    }
    ```
  - Response: Success message or error message.

- **GET /api/bookings/**
  - Description: Get all bookings.
  - Response: Array of booking objects.

- **GET /api/bookings/get/:id**
  - Description: Get a specific booking by ID.
  - Response: Booking object or error message.

- **PUT /api/bookings/update/:id**
  - Description: Update a booking by ID.
  - Request Body:
    ```
    {
        "resourceId": "string (resource ID)",
        "resourceQty": number,
        "roomId": "string",
        "date": "string",
        "startTime": "string",
        "endTime": "string"
    }
    ```
  - Response: Success message or error message.

- **DELETE /api/bookings/delete/:id**
  - Description: Delete a booking by ID.
  - Response: Success message or error message.

#### Protected Routes

For routes that require authentication, ensure that the client includes a valid token in the request headers.

- **Token Inclusion**: 
  - Include the generated token in the request headers in the following format:
    ```
    Authorization: Bearer <token>
    ```

- **Protected Endpoints**:

#### Courses
  - `/api/courses/add`: Requires authentication with `Admin` or `Faculty` role to add a new course.
  - `/api/courses/update/:id`: Requires authentication with `Admin` or `Faculty` role to update a course.
  - `/api/courses/delete/:id`: Requires authentication with `Admin` or `Faculty` role to delete a course.
  - `/api/courses/:id/enrollments`: Requires authentication with `Admin` or `Faculty` role to check enrollments of the course.
  - `/api/courses/:id/enroll`: Requires authentication with `Student` role to enroll in a course.
  - - `/api/courses/:id/timetable`: Requires authentication with `Admin` or `Faculty` or  `Student` role to view timetable of the course.
   
 #### Courses
  - `/api/sessions/add`: Access restricted to users with `Admin` or `Faculty` role for adding new class sessions.
  - `/api/sessions/update/:id`: Access restricted to users with `Admin` or `Faculty` role for update a class session.
  - `/api/sessions/delete/:id`: Access restricted to users with `Admin` or `Faculty` role for delete a class session.

 #### Resources
  - `/api/resources/add`: Access restricted to users with `Admin` or `Faculty` role for adding new resources.
  - `/api/resources/update/:id`: Access restricted to users with `Admin` or `Faculty` role for update a resource.

#### Running Unit Tests

1. **Running Tests**:
   - Execute the unit tests with the following command:
     ```
     npm test
     ```

2. **Viewing Results**:
   - Test results will be displayed in the terminal, indicating the success or failure of each test case.
   - Detailed information about any test failures or errors encountered will also be provided for debugging purposes.

By following these steps, you can verify the functionality and integrity of the API endpoints using the provided unit tests.

  - `/api/resources/delete/:id`: Access restricted to users with `Admin` or `Faculty` role for delete a resource.

- **Error Handling**:
  - If the token is missing or invalid, the server will respond with a `401 Unauthorized` or `403 Forbidden` status code accordingly.

Please ensure that the token is included in the headers for all requests to protected routes to ensure successful authentication and access.
