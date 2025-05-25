using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using FlightAgency.Models;

namespace FlightAgency.DataAccess
{
    public class HotelADO : IRepository<Hotel>
    {
        private readonly DatabaseConnection dbConnection;

        public HotelADO()
        {
            dbConnection = DatabaseConnection.Instance;
        }

        public IEnumerable<Hotel> GetAll()
        {
            var hotels = new List<Hotel>();
            using (var conn = dbConnection.GetConnection())
            {
                conn.Open();
                var cmd = new SqlCommand(
                    "SELECT h.id, h.name, h.stars, h.pricePerNight, h.image, " +
                    "d.id AS dest_id, d.city, d.country, d.description, d.image AS dest_image " +
                    "FROM Hotels h " +
                    "INNER JOIN Destinations d ON h.destination_id = d.id", conn);

                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        hotels.Add(MapHotel(reader));
                    }
                }
            }
            return hotels;
        }

        public Hotel GetById(long id)
        {
            using (var conn = dbConnection.GetConnection())
            {
                conn.Open();
                var cmd = new SqlCommand(
                    "SELECT h.id, h.name, h.stars, h.pricePerNight, h.image, " +
                    "d.id AS dest_id, d.city, d.country, d.description, d.image AS dest_image " +
                    "FROM Hotels h " +
                    "INNER JOIN Destinations d ON h.destination_id = d.id " +
                    "WHERE h.id = @Id", conn);
                cmd.Parameters.Add(new SqlParameter("@Id", SqlDbType.BigInt) { Value = id });

                using (var reader = cmd.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        return MapHotel(reader);
                    }
                    return null;
                }
            }
        }

        public void Add(Hotel hotel)
        {
            if (hotel == null || string.IsNullOrEmpty(hotel.name) || hotel.destination == null ||
                hotel.destination.id <= 0 || hotel.pricePerNight < 0 || hotel.stars < 1 || hotel.stars > 5 ||
                string.IsNullOrEmpty(hotel.image))
            {
                throw new ArgumentException("Name, valid destination, non-negative price, stars (1–5), and an image URL are required.");
            }

            using (var conn = dbConnection.GetConnection())
            {
                conn.Open();
                var cmd = new SqlCommand(
                    "INSERT INTO Hotels (name, destination_id, stars, pricePerNight, image) " +
                    "OUTPUT INSERTED.id " +
                    "VALUES (@Name, @DestinationId, @Stars, @PricePerNight, @Image)", conn);
                cmd.Parameters.Add(new SqlParameter("@Name", SqlDbType.VarChar, 100) { Value = hotel.name });
                cmd.Parameters.Add(new SqlParameter("@DestinationId", SqlDbType.BigInt) { Value = hotel.destination.id });
                cmd.Parameters.Add(new SqlParameter("@Stars", SqlDbType.Int) { Value = hotel.stars });
                cmd.Parameters.Add(new SqlParameter("@PricePerNight", SqlDbType.Decimal) { Value = hotel.pricePerNight });
                cmd.Parameters.Add(new SqlParameter("@Image", SqlDbType.VarChar, 255) { Value = hotel.image });

                hotel.id = (long)cmd.ExecuteScalar();
            }
        }

        public void Update(Hotel hotel)
        {
            if (hotel == null || string.IsNullOrEmpty(hotel.name) || hotel.destination == null ||
                hotel.destination.id <= 0 || hotel.pricePerNight < 0 || hotel.stars < 1 || hotel.stars > 5)
            {
                throw new ArgumentException("Name, valid destination, non-negative price, and stars (1–5) are required.");
            }

            using (var conn = dbConnection.GetConnection())
            {
                conn.Open();
                var cmd = new SqlCommand(
                    "UPDATE Hotels SET name = @Name, destination_id = @DestinationId, stars = @Stars, " +
                    "pricePerNight = @PricePerNight " +
                    "WHERE id = @Id", conn);
                cmd.Parameters.Add(new SqlParameter("@Id", SqlDbType.BigInt) { Value = hotel.id });
                cmd.Parameters.Add(new SqlParameter("@Name", SqlDbType.VarChar, 100) { Value = hotel.name });
                cmd.Parameters.Add(new SqlParameter("@DestinationId", SqlDbType.BigInt) { Value = hotel.destination.id });
                cmd.Parameters.Add(new SqlParameter("@Stars", SqlDbType.Int) { Value = hotel.stars });
                cmd.Parameters.Add(new SqlParameter("@PricePerNight", SqlDbType.Decimal) { Value = hotel.pricePerNight });

                cmd.ExecuteNonQuery();
            }
        }

        public void Delete(long id)
        {
            using (var conn = dbConnection.GetConnection())
            {
                conn.Open();
                var cmd = new SqlCommand("DELETE FROM Hotels WHERE id = @Id", conn);
                cmd.Parameters.Add(new SqlParameter("@Id", SqlDbType.BigInt) { Value = id });
                cmd.ExecuteNonQuery();
            }
        }

        private Hotel MapHotel(SqlDataReader reader)
        {
            return new Hotel
            {
                id = reader.GetInt64(reader.GetOrdinal("id")),
                name = reader.GetString(reader.GetOrdinal("name")),
                stars = reader.GetInt32(reader.GetOrdinal("stars")),
                pricePerNight = reader.GetDecimal(reader.GetOrdinal("pricePerNight")),
                image = reader.IsDBNull(reader.GetOrdinal("image")) ? null : reader.GetString(reader.GetOrdinal("image")),
                destination = new Destination
                {
                    id = reader.GetInt64(reader.GetOrdinal("dest_id")),
                    city = reader.GetString(reader.GetOrdinal("city")),
                    country = reader.GetString(reader.GetOrdinal("country")),
                    description = reader.GetString(reader.GetOrdinal("description")),
                    image = reader.IsDBNull(reader.GetOrdinal("dest_image")) ? null : reader.GetString(reader.GetOrdinal("dest_image"))
                }
            };
        }
    }
}
