import mongoose from "mongoose";

const connectDB = async (MONGO_URI) => {
  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log("Mongo Conectado", conn.connection.host);
    return conn;
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error.message);
    throw error;
  }
};
export default connectDB;
