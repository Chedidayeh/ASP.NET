using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using FlightAgency.Models;

namespace FlightAgency.DataAccess
{
    public class ReservationADO : IRepository<Reservation>
    {
        private readonly DatabaseConnection dbConnection;

        public ReservationADO()
        {
            dbConnection = DatabaseConnection.Instance;
        }

        public void Add(Reservation reservation)
        {
            if (reservation == null || reservation.user == null || reservation.user.id <= 0 ||
                reservation.flight == null || reservation.flight.id <= 0 ||
                reservation.reservationDate == default)
            {
                throw new ArgumentException("User, flight, and reservation date are required.");
            }

            using (var conn = dbConnection.GetConnection())
            {
                conn.Open();
                var cmd = new SqlCommand(
                    "INSERT INTO Reservations (user_id, flight_id, hotel_id, reservationDate) " +
                    "OUTPUT INSERTED.id " +
                    "VALUES (@UserId, @FlightId, @HotelId, @ReservationDate)", conn);
                cmd.Parameters.Add(new SqlParameter("@UserId", SqlDbType.BigInt) { Value = reservation.user.id });
                cmd.Parameters.Add(new SqlParameter("@FlightId", SqlDbType.BigInt) { Value = reservation.flight.id });
                cmd.Parameters.Add(new SqlParameter("@HotelId", SqlDbType.BigInt) { Value = (object)reservation.hotel?.id ?? DBNull.Value });
                cmd.Parameters.Add(new SqlParameter("@ReservationDate", SqlDbType.DateTime) { Value = reservation.reservationDate });

                reservation.id = (long)cmd.ExecuteScalar();
            }
        }

        public Reservation GetById(long id)
        {
            using (var conn = dbConnection.GetConnection())
            {
                conn.Open();
                var cmd = new SqlCommand(
                    "SELECT r.id, r.user_id, r.flight_id, r.hotel_id, r.reservationDate, " +
                    "u.id AS user_id, u.name AS user_name, u.email, u.password, u.role, " +
                    "f.id AS flight_id, f.flight_number, f.departureCity, f.departureTime, f.arrivalTime, f.price, f.seatsAvailable, " +
                    "fd.id AS flight_dest_id, fd.city AS flight_city, fd.country AS flight_country, fd.description AS flight_description, fd.image AS flight_image, " +
                    "h.id AS hotel_id, h.name AS hotel_name, h.stars, h.pricePerNight, " +
                    "hd.id AS hotel_dest_id, hd.city AS hotel_city, hd.country AS hotel_country, hd.description AS hotel_description, hd.image AS hotel_image " +
                    "FROM Reservations r " +
                    "INNER JOIN AppUsers u ON r.user_id = u.id " +
                    "INNER JOIN Flights f ON r.flight_id = f.id " +
                    "INNER JOIN Destinations fd ON f.destination_id = fd.id " +
                    "LEFT JOIN Hotels h ON r.hotel_id = h.id " +
                    "LEFT JOIN Destinations hd ON h.destination_id = hd.id " +
                    "WHERE r.id = @Id", conn);
                cmd.Parameters.Add(new SqlParameter("@Id", SqlDbType.BigInt) { Value = id });

                using (var reader = cmd.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        return MapReservation(reader);
                    }
                    return null;
                }
            }
        }

        public IEnumerable<Reservation> GetAll()
        {
            var reservations = new List<Reservation>();
            using (var conn = dbConnection.GetConnection())
            {
                conn.Open();
                var cmd = new SqlCommand(
                    "SELECT r.id, r.user_id, r.flight_id, r.hotel_id, r.reservationDate, " +
                    "u.id AS user_id, u.name AS user_name, u.email, u.password, u.role, " +
                    "f.id AS flight_id, f.flight_number, f.departureCity, f.departureTime, f.arrivalTime, f.price, f.seatsAvailable, " +
                    "fd.id AS flight_dest_id, fd.city AS flight_city, fd.country AS flight_country, fd.description AS flight_description, fd.image AS flight_image, " +
                    "h.id AS hotel_id, h.name AS hotel_name, h.stars, h.pricePerNight, " +
                    "hd.id AS hotel_dest_id, hd.city AS hotel_city, hd.country AS hotel_country, hd.description AS hotel_description, hd.image AS hotel_image " +
                    "FROM Reservations r " +
                    "INNER JOIN AppUsers u ON r.user_id = u.id " +
                    "INNER JOIN Flights f ON r.flight_id = f.id " +
                    "INNER JOIN Destinations fd ON f.destination_id = fd.id " +
                    "LEFT JOIN Hotels h ON r.hotel_id = h.id " +
                    "LEFT JOIN Destinations hd ON h.destination_id = hd.id", conn);

                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        reservations.Add(MapReservation(reader));
                    }
                }
            }
            return reservations;
        }

        public IEnumerable<Reservation> GetByUserEmail(string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                throw new ArgumentException("Email is required.");
            }

            var reservations = new List<Reservation>();
            using (var conn = dbConnection.GetConnection())
            {
                conn.Open();
                var cmd = new SqlCommand(
                    "SELECT r.id, r.user_id, r.flight_id, r.hotel_id, r.reservationDate, " +
                    "u.id AS user_id, u.name AS user_name, u.email, u.password, u.role, " +
                    "f.id AS flight_id, f.flight_number, f.departureCity, f.departureTime, f.arrivalTime, f.price, f.seatsAvailable, " +
                    "fd.id AS flight_dest_id, fd.city AS flight_city, fd.country AS flight_country, fd.description AS flight_description, fd.image AS flight_image, " +
                    "h.id AS hotel_id, h.name AS hotel_name, h.stars, h.pricePerNight, " +
                    "hd.id AS hotel_dest_id, hd.city AS hotel_city, hd.country AS hotel_country, hd.description AS hotel_description, hd.image AS hotel_image " +
                    "FROM Reservations r " +
                    "INNER JOIN AppUsers u ON r.user_id = u.id " +
                    "INNER JOIN Flights f ON r.flight_id = f.id " +
                    "INNER JOIN Destinations fd ON f.destination_id = fd.id " +
                    "LEFT JOIN Hotels h ON r.hotel_id = h.id " +
                    "LEFT JOIN Destinations hd ON h.destination_id = hd.id " +
                    "WHERE u.email = @Email", conn);
                cmd.Parameters.Add(new SqlParameter("@Email", SqlDbType.VarChar, 255) { Value = email });

                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        reservations.Add(MapReservation(reader));
                    }
                }
            }
            return reservations;
        }


        // New method to get reservations by destination ID
        public IEnumerable<Reservation> GetByDestinationId(long destinationId)
        {
            if (destinationId <= 0)
            {
                throw new ArgumentException("Destination ID must be greater than 0.");
            }

            var reservations = new List<Reservation>();
            using (var conn = dbConnection.GetConnection())
            {
                conn.Open();
                var cmd = new SqlCommand(
                    "SELECT r.id, r.user_id, r.flight_id, r.hotel_id, r.reservationDate, " +
                    "u.id AS user_id, u.name AS user_name, u.email, u.password, u.role, " +
                    "f.id AS flight_id, f.flight_number, f.departureCity, f.departureTime, f.arrivalTime, f.price, f.seatsAvailable, " +
                    "fd.id AS flight_dest_id, fd.city AS flight_city, fd.country AS flight_country, fd.description AS flight_description, fd.image AS flight_image, " +
                    "h.id AS hotel_id, h.name AS hotel_name, h.stars, h.pricePerNight, " +
                    "hd.id AS hotel_dest_id, hd.city AS hotel_city, hd.country AS hotel_country, hd.description AS hotel_description, hd.image AS hotel_image " +
                    "FROM Reservations r " +
                    "INNER JOIN AppUsers u ON r.user_id = u.id " +
                    "INNER JOIN Flights f ON r.flight_id = f.id " +
                    "INNER JOIN Destinations fd ON f.destination_id = fd.id " +
                    "LEFT JOIN Hotels h ON r.hotel_id = h.id " +
                    "LEFT JOIN Destinations hd ON h.destination_id = hd.id " +
                    "WHERE fd.id = @DestinationId OR (hd.id = @DestinationId AND r.hotel_id IS NOT NULL)", conn);
                cmd.Parameters.Add(new SqlParameter("@DestinationId", SqlDbType.BigInt) { Value = destinationId });

                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        reservations.Add(MapReservation(reader));
                    }
                }
            }
            return reservations;
        }

        public void Update(Reservation reservation)
        {
            if (reservation == null || reservation.user == null || reservation.user.id <= 0 ||
                reservation.flight == null || reservation.flight.id <= 0 ||
                reservation.reservationDate == default)
            {
                throw new ArgumentException("User, flight, and reservation date are required.");
            }

            using (var conn = dbConnection.GetConnection())
            {
                conn.Open();
                var cmd = new SqlCommand(
                    "UPDATE Reservations SET user_id = @UserId, flight_id = @FlightId, hotel_id = @HotelId, " +
                    "reservationDate = @ReservationDate WHERE id = @Id", conn);
                cmd.Parameters.Add(new SqlParameter("@Id", SqlDbType.BigInt) { Value = reservation.id });
                cmd.Parameters.Add(new SqlParameter("@UserId", SqlDbType.BigInt) { Value = reservation.user.id });
                cmd.Parameters.Add(new SqlParameter("@FlightId", SqlDbType.BigInt) { Value = reservation.flight.id });
                cmd.Parameters.Add(new SqlParameter("@HotelId", SqlDbType.BigInt) { Value = (object)reservation.hotel?.id ?? DBNull.Value });
                cmd.Parameters.Add(new SqlParameter("@ReservationDate", SqlDbType.DateTime) { Value = reservation.reservationDate });

                cmd.ExecuteNonQuery();
            }
        }

        public void Delete(long id)
        {
            using (var conn = dbConnection.GetConnection())
            {
                conn.Open();
                var cmd = new SqlCommand("DELETE FROM Reservations WHERE id = @Id", conn);
                cmd.Parameters.Add(new SqlParameter("@Id", SqlDbType.BigInt) { Value = id });
                cmd.ExecuteNonQuery();
            }
        }

        private Reservation MapReservation(SqlDataReader reader)
        {
            return new Reservation
            {
                id = reader.GetInt64(reader.GetOrdinal("id")),
                user = new AppUser
                {
                    id = reader.GetInt64(reader.GetOrdinal("user_id")),
                    name = reader.GetString(reader.GetOrdinal("user_name")),
                    email = reader.GetString(reader.GetOrdinal("email")),
                    password = reader.GetString(reader.GetOrdinal("password")),
                    role = reader.IsDBNull(reader.GetOrdinal("role")) ? null : reader.GetString(reader.GetOrdinal("role"))
                },
                flight = new Flight
                {
                    id = reader.GetInt64(reader.GetOrdinal("flight_id")),
                    flightNumber = reader.GetString(reader.GetOrdinal("flight_number")),
                    departureCity = reader.IsDBNull(reader.GetOrdinal("departureCity")) ? null : reader.GetString(reader.GetOrdinal("departureCity")),
                    departureTime = reader.GetDateTime(reader.GetOrdinal("departureTime")),
                    arrivalTime = reader.GetDateTime(reader.GetOrdinal("arrivalTime")),
                    price = reader.GetDecimal(reader.GetOrdinal("price")),
                    seatsAvailable = reader.GetInt32(reader.GetOrdinal("seatsAvailable")),
                    destination = new Destination
                    {
                        id = reader.GetInt64(reader.GetOrdinal("flight_dest_id")),
                        city = reader.GetString(reader.GetOrdinal("flight_city")),
                        country = reader.GetString(reader.GetOrdinal("flight_country")),
                        description = reader.GetString(reader.GetOrdinal("flight_description")),
                        image = reader.IsDBNull(reader.GetOrdinal("flight_image")) ? null : reader.GetString(reader.GetOrdinal("flight_image"))
                    }
                },
                hotel = reader.IsDBNull(reader.GetOrdinal("hotel_id")) ? null : new Hotel
                {
                    id = reader.GetInt64(reader.GetOrdinal("hotel_id")),
                    name = reader.GetString(reader.GetOrdinal("hotel_name")),
                    stars = reader.GetInt32(reader.GetOrdinal("stars")),
                    pricePerNight = reader.GetDecimal(reader.GetOrdinal("pricePerNight")),
                    destination = new Destination
                    {
                        id = reader.GetInt64(reader.GetOrdinal("hotel_dest_id")),
                        city = reader.GetString(reader.GetOrdinal("hotel_city")),
                        country = reader.GetString(reader.GetOrdinal("hotel_country")),
                        description = reader.GetString(reader.GetOrdinal("hotel_description")),
                        image = reader.IsDBNull(reader.GetOrdinal("hotel_image")) ? null : reader.GetString(reader.GetOrdinal("hotel_image"))
                    }
                },
                reservationDate = reader.GetDateTime(reader.GetOrdinal("reservationDate"))
            };
        }
    }
}