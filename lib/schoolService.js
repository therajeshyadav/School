import { getConnection } from './database.js';

export class SchoolService {
  static async createSchool(formData) {
    try {
      const connection = await getConnection();
      
      const insertQuery = `
        INSERT INTO schools (name, address, city, state, contact, email_id, image)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      
      const [result] = await connection.execute(insertQuery, [
        formData.name,
        formData.address,
        formData.city,
        formData.state,
        formData.contact,
        formData.email_id,
        formData.image || null
      ]);
      
      return { success: true, id: result.insertId };
    } catch (error) {
      console.error('Error creating school:', error);
      return { success: false, error: error.message };
    }
  }

  static async getSchools() {
    try {
      const connection = await getConnection();
      
      const selectQuery = `
        SELECT * FROM schools 
        ORDER BY created_at DESC
      `;
      
      const [rows] = await connection.execute(selectQuery);
      return rows;
    } catch (error) {
      console.error('Error fetching schools:', error);
      return [];
    }
  }

  static async searchSchools(query) {
    try {
      const connection = await getConnection();
      
      const searchQuery = `
        SELECT * FROM schools 
        WHERE name LIKE ? OR city LIKE ? OR state LIKE ?
        ORDER BY created_at DESC
      `;
      
      const searchTerm = `%${query}%`;
      const [rows] = await connection.execute(searchQuery, [searchTerm, searchTerm, searchTerm]);
      return rows;
    } catch (error) {
      console.error('Error searching schools:', error);
      return [];
    }
  }
}