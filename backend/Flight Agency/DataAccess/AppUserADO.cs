using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using FlightAgency.Models;

namespace FlightAgency.DataAccess
{
    public class AppUserADO : IRepository<AppUser>
    {
        private readonly DatabaseConnection dbConnection;

        public AppUserADO()
        {
            dbConnection = DatabaseConnection.Instance;
        }

        public void Add(AppUser user)
        {
            if (user == null || string.IsNullOrEmpty(user.name) || string.IsNullOrEmpty(user.email) || string.IsNullOrEmpty(user.password))
            {
                throw new ArgumentException("Name, email, and password are required.");
            }

            using (var conn = dbConnection.GetConnection())
            {
                conn.Open();
                var cmd = new SqlCommand(
                    "INSERT INTO AppUsers (name, email, password, role) " +
                    "OUTPUT INSERTED.id " +
                    "VALUES (@Name, @Email, @Password, @Role)", conn);
                cmd.Parameters.Add(new SqlParameter("@Name", SqlDbType.VarChar, 100) { Value = user.name });
                cmd.Parameters.Add(new SqlParameter("@Email", SqlDbType.VarChar, 255) { Value = user.email });
                cmd.Parameters.Add(new SqlParameter("@Password", SqlDbType.VarChar, 100) { Value = user.password });
                cmd.Parameters.Add(new SqlParameter("@Role", SqlDbType.VarChar, 50) { Value = (object)user.role ?? DBNull.Value }); // Allow database default

                user.id = (long)cmd.ExecuteScalar();
            }
        }

        public AppUser GetById(long id)
        {
            using (var conn = dbConnection.GetConnection())
            {
                conn.Open();
                var cmd = new SqlCommand(
                    "SELECT id, name, email, password, role FROM AppUsers WHERE id = @Id", conn);
                cmd.Parameters.Add(new SqlParameter("@Id", SqlDbType.BigInt) { Value = id });

                using (var reader = cmd.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        return MapAppUser(reader);
                    }
                    return null;
                }
            }
        }

        public AppUser GetByEmail(string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                throw new ArgumentException("Email is required.");
            }

            using (var conn = dbConnection.GetConnection())
            {
                conn.Open();
                var cmd = new SqlCommand(
                    "SELECT id, name, email, password, role FROM AppUsers WHERE email = @Email", conn);
                cmd.Parameters.Add(new SqlParameter("@Email", SqlDbType.VarChar, 255) { Value = email });

                using (var reader = cmd.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        return MapAppUser(reader);
                    }
                    return null;
                }
            }
        }

        public bool VerifyCredentials(string email, string password)
        {
            if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(password))
            {
                return false;
            }

            using (var conn = dbConnection.GetConnection())
            {
                conn.Open();
                var cmd = new SqlCommand(
                    "SELECT COUNT(1) FROM AppUsers WHERE email = @Email AND password = @Password", conn);
                cmd.Parameters.Add(new SqlParameter("@Email", SqlDbType.VarChar, 255) { Value = email });
                cmd.Parameters.Add(new SqlParameter("@Password", SqlDbType.VarChar, 100) { Value = password });

                return (int)cmd.ExecuteScalar() > 0;
            }
        }

        public IEnumerable<AppUser> GetAll()
        {
            var users = new List<AppUser>();
            using (var conn = dbConnection.GetConnection())
            {
                conn.Open();
                var cmd = new SqlCommand(
                    "SELECT id, name, email, password, role FROM AppUsers", conn);

                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        users.Add(MapAppUser(reader));
                    }
                }
            }
            return users;
        }

        public void Update(AppUser user)
        {
            if (user == null || string.IsNullOrEmpty(user.name) || string.IsNullOrEmpty(user.email) || string.IsNullOrEmpty(user.password))
            {
                throw new ArgumentException("Name, email, and password are required.");
            }

            using (var conn = dbConnection.GetConnection())
            {
                conn.Open();
                var cmd = new SqlCommand(
                    "UPDATE AppUsers SET name = @Name, email = @Email, password = @Password, role = @Role " +
                    "WHERE id = @Id", conn);
                cmd.Parameters.Add(new SqlParameter("@Id", SqlDbType.BigInt) { Value = user.id });
                cmd.Parameters.Add(new SqlParameter("@Name", SqlDbType.VarChar, 100) { Value = user.name });
                cmd.Parameters.Add(new SqlParameter("@Email", SqlDbType.VarChar, 255) { Value = user.email });
                cmd.Parameters.Add(new SqlParameter("@Password", SqlDbType.VarChar, 100) { Value = user.password });
                cmd.Parameters.Add(new SqlParameter("@Role", SqlDbType.VarChar, 50) { Value = (object)user.role ?? DBNull.Value });

                cmd.ExecuteNonQuery();
            }
        }

        public void Delete(long id)
        {
            using (var conn = dbConnection.GetConnection())
            {
                conn.Open();
                var cmd = new SqlCommand("DELETE FROM AppUsers WHERE id = @Id", conn);
                cmd.Parameters.Add(new SqlParameter("@Id", SqlDbType.BigInt) { Value = id });
                cmd.ExecuteNonQuery();
            }
        }

        private AppUser MapAppUser(SqlDataReader reader)
        {
            return new AppUser
            {
                id = reader.GetInt64(reader.GetOrdinal("id")),
                name = reader.GetString(reader.GetOrdinal("name")),
                email = reader.GetString(reader.GetOrdinal("email")),
                password = reader.GetString(reader.GetOrdinal("password")),
                role = reader.GetString(reader.GetOrdinal("role"))
            };
        }
    }
}