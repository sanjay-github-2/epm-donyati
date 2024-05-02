import { pool } from "../lib/db";
import { getCurrentDateTime } from "@/utils/DateTime";

const createUserTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS public."User_Table" (
      id UUID PRIMARY KEY,
      name VARCHAR(255),
      email VARCHAR(255),
      role VARCHAR(50),
      "group" VARCHAR(255),
      AUTH_TYPE VARCHAR(50),
      access_type JSONB,
      password VARCHAR(255),
      last_logged_in DATE,
      is_active BOOLEAN
    )
  `;

  try {
    const client = await pool.connect();
    await client.query(query);
    console.log("User_Table table created successfully");
    client.release();
  } catch (error) {
    console.error("Error creating User_Table table:", error);
  }
};

const createUser = async ({
  id,
  name,
  email,
  role,
  group,
  AUTH_TYPE,
  access_type,
  password,
}) => {
  const currentDateTime = getCurrentDateTime();

  const query = `
    INSERT INTO public."user_table" (id, name, email, role, "group", AUTH_TYPE, access_type, password, last_logged_in, is_active)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *
  `;

  try {
    const client = await pool.connect();
    const result = await client.query(query, [
      id,
      name,
      email,
      role,
      group,
      AUTH_TYPE,
      access_type,
      password,
      currentDateTime,
      true,
    ]);
    client.release();
    return result.rows[0];
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

const updateLoginTime = async (userId) => {
  const currentDateTime = getCurrentDateTime();
  console.log(currentDateTime);
  console.log(userId);
  const query = `
    UPDATE public."user_table"
    SET last_logged_in = $1
    WHERE id = $2
  `;

  try {
    const client = await pool.connect();
    await client.query(query, [currentDateTime, userId]);
    client.release();
    console.log("User login time updated successfully");
  } catch (error) {
    console.error("Error updating user login time:", error);
    throw error;
  }
};

const updateUser = async ({ email, role, group, accessType }) => {
  const query = `
    UPDATE public."user_table"
    SET role = $2, "group" = $3,"access_type" =$4
    WHERE email = $1
    RETURNING *
  `;

  try {
    const client = await pool.connect();
    const result = await client.query(query, [email, role, group, accessType]);
    client.release();
    return result.rows[0];
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};
const updateUserActiveStatus = async (id, is_active) => {
  const query = `
    UPDATE public."user_table"
    SET is_active = $2
    WHERE id = $1
    RETURNING *
  `;

  try {
    const client = await pool.connect();
    const result = await client.query(query, [id, is_active]);
    client.release();
    console.log(result);
    return result.rows[0];
  } catch (error) {
    console.error("Error updating user active status:", error);
    throw error;
  }
};
async function deleteUserById(userId) {
  const client = await pool.connect();
  try {
    // Run a DELETE SQL query to delete the user by ID
    const query = "DELETE FROM public.user_table WHERE id = $1 RETURNING *";
    const result = await client.query(query, [userId]);

    if (result.rowCount === 0) {
      // If no rows were affected, it means the user with the specified ID was not found
      throw new Error("User not found");
    }

    // Return the deleted user
    return result.rows[0];
  } finally {
    // Release the client back to the pool
    client.release();
  }
}

export {
  createUserTable,
  createUser,
  updateLoginTime,
  updateUser,
  updateUserActiveStatus,
  deleteUserById,
};
