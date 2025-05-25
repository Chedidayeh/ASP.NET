using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using FlightAgency.Models;

namespace FlightAgency.DataAccess
{
    public class DestinationADO : IRepository<Destination>
    {
        private readonly DatabaseConnection dbConnection;

        public DestinationADO()
        {
            dbConnection = DatabaseConnection.Instance;
        }

        public void Add(Destination destination)
        {
            if (destination == null || string.IsNullOrEmpty(destination.city) ||
                string.IsNullOrEmpty(destination.country) || string.IsNullOrEmpty(destination.description))
            {
                throw new ArgumentException("City, country, and description are required.");
            }

            using (var conn = dbConnection.GetConnection())
            {
                conn.Open();
                var cmd = new SqlCommand(
                    "INSERT INTO Destinations (city, country, description, image) " +
                    "OUTPUT INSERTED.id " +
                    "VALUES (@City, @Country, @Description, @Image)", conn);
                cmd.Parameters.Add(new SqlParameter("@City", SqlDbType.VarChar, 100) { Value = destination.city });
                cmd.Parameters.Add(new SqlParameter("@Country", SqlDbType.VarChar, 100) { Value = destination.country });
                cmd.Parameters.Add(new SqlParameter("@Description", SqlDbType.VarChar, 100) { Value = destination.description });
                cmd.Parameters.Add(new SqlParameter("@Image", SqlDbType.VarChar, 255) { Value = (object)destination.image ?? DBNull.Value });

                destination.id = (long)cmd.ExecuteScalar();
            }
        }

        public Destination GetById(long id)
        {
            using (var conn = dbConnection.GetConnection())
            {
                conn.Open();
                var cmd = new SqlCommand(
                    "SELECT id, city, country, description, image FROM Destinations WHERE id = @Id", conn);
                cmd.Parameters.Add(new SqlParameter("@Id", SqlDbType.BigInt) { Value = id });

                using (var reader = cmd.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        return MapDestination(reader);
                    }
                    return null;
                }
            }
        }

        public IEnumerable<Destination> GetAll()
        {
            var destinations = new List<Destination>();
            using (var conn = dbConnection.GetConnection())
            {
                conn.Open();
                var cmd = new SqlCommand(
                    "SELECT id, city, country, description, image FROM Destinations", conn);

                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        destinations.Add(MapDestination(reader));
                    }
                }
            }
            return destinations;
        }

        public void Update(Destination destination)
        {
            if (destination == null || string.IsNullOrEmpty(destination.city) ||
                string.IsNullOrEmpty(destination.country) || string.IsNullOrEmpty(destination.description))
            {
                throw new ArgumentException("City, country, and description are required.");
            }

            using (var conn = dbConnection.GetConnection())
            {
                conn.Open();
                var cmd = new SqlCommand(
                    "UPDATE Destinations SET city = @City, country = @Country, description = @Description, image = @Image " +
                    "WHERE id = @Id", conn);
                cmd.Parameters.Add(new SqlParameter("@Id", SqlDbType.BigInt) { Value = destination.id });
                cmd.Parameters.Add(new SqlParameter("@City", SqlDbType.VarChar, 100) { Value = destination.city });
                cmd.Parameters.Add(new SqlParameter("@Country", SqlDbType.VarChar, 100) { Value = destination.country });
                cmd.Parameters.Add(new SqlParameter("@Description", SqlDbType.VarChar, 100) { Value = destination.description });
                cmd.Parameters.Add(new SqlParameter("@Image", SqlDbType.VarChar, 255) { Value = (object)destination.image ?? DBNull.Value });

                cmd.ExecuteNonQuery();
            }
        }

        public void Delete(long id)
        {
            using (var conn = dbConnection.GetConnection())
            {
                conn.Open();
                var cmd = new SqlCommand("DELETE FROM Destinations WHERE id = @Id", conn);
                cmd.Parameters.Add(new SqlParameter("@Id", SqlDbType.BigInt) { Value = id });
                cmd.ExecuteNonQuery();
            }
        }

        private Destination MapDestination(SqlDataReader reader)
        {
            return new Destination
            {
                id = reader.GetInt64(reader.GetOrdinal("id")),
                city = reader.GetString(reader.GetOrdinal("city")),
                country = reader.GetString(reader.GetOrdinal("country")),
                description = reader.GetString(reader.GetOrdinal("description")),
                image = reader.IsDBNull(reader.GetOrdinal("image")) ? null : reader.GetString(reader.GetOrdinal("image"))
            };
        }
    }
}