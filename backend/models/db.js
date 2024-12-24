const { Pool } = require("pg");
require("dotenv").config();

const connectionString = process.env.DB_URL;
const pool = new Pool({
  connectionString: connectionString,
});

pool
  .connect()
  .then((res) => {
    console.log(`DB connected to ${res.database}`);
  })
  .catch((err) => {
    console.log(err);
  });

const createDataBase = async () => {
  const query = `
  CREATE TABLE roles (
    role_id SERIAL NOT NULL,
    name VARCHAR(20) NOT NULL UNIQUE,
    PRIMARY KEY (role_id)
  );

  CREATE TABLE permissions (
    permission_id SERIAL NOT NULL,
    permission_name VARCHAR(50) NOT NULL UNIQUE,
    PRIMARY KEY (permission_id)
  );

  CREATE TABLE role_permissions (
    role_permission_id SERIAL NOT NULL,
    role_id INT NOT NULL,
    permission_id INT NOT NULL,
    PRIMARY KEY (role_permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(permission_id) ON DELETE CASCADE
  );

  CREATE TABLE users (
    user_id SERIAL NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role_id INT NOT NULL,
    PRIMARY KEY (user_id),
    FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE SET NULL
  );

  CREATE TABLE questions (
    question_id SERIAL NOT NULL,
    content TEXT NOT NULL,
    level VARCHAR(20) NOT NULL,
    course_id INT,
    PRIMARY KEY (question_id)
  );

  CREATE TABLE exams (
    exam_id SERIAL NOT NULL,
    title VARCHAR(100) NOT NULL,
    course_id INT,
    created_by INT NOT NULL,
    time_limit INT NOT NULL,
    PRIMARY KEY (exam_id),
    FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE CASCADE
  );

  CREATE TABLE student_answers (
    answer_id SERIAL NOT NULL,
    student_id INT NOT NULL,
    exam_id INT NOT NULL,
    question_id INT NOT NULL,
    answer TEXT,
    PRIMARY KEY (answer_id),
    FOREIGN KEY (student_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (exam_id) REFERENCES exams(exam_id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(question_id) ON DELETE CASCADE
  );
  `;
  try {
    await pool.query(query);
    console.log("Database and tables created successfully!");
  } catch (error) {
    console.log("Error creating database:", error);
  }
};

// createDataBase();

module.exports = { pool };
