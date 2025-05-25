using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using FlightAgency.Models;

namespace FlightAgency.DataAccess
{
    public class FlightADO : IRepository<Flight>
    {
        private readonly DatabaseConnection dbConnection;

        public FlightADO()
        {
            dbConnection = DatabaseConnection.Instance;
        }

        public IEnumerable<Flight> GetAll()
        {
            var flights = new List<Flight>();
            using (var conn = dbConnection.GetConnection())
            {
                conn.Open();
                var cmd = new SqlCommand(
                    "SELECT f.id, f.flight_number, f.departureCity, f.departureTime, f.arrivalTime, f.price, f.seatsAvailable, " +
                    "d.id AS dest_id, d.city, d.country, d.description, d.image " +
                    "FROM Flights f " +
                    "INNER JOIN Destinations d ON f.destination_id = d.id", conn);

                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        flights.Add(MapFlight(reader));
                    }
                }
            }
            return flights;
        }

        public Flight GetById(long id)
        {
            using (var conn = dbConnection.GetConnection())
            {
                conn.Open();
                var cmd = new SqlCommand(
                    "SELECT f.id, f.flight_number, f.departureCity, f.departureTime, f.arrivalTime, f.price, f.seatsAvailable, " +
                    "d.id AS dest_id, d.city, d.country, d.description, d.image " +
                    "FROM Flights f " +
                    "INNER JOIN Destinations d ON f.destination_id = d.id " +
                    "WHERE f.id = @Id", conn);
                cmd.Parameters.Add(new SqlParameter("@Id", SqlDbType.BigInt) { Value = id });

                using (var reader = cmd.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        return MapFlight(reader);
                    }
                    return null;
                }
            }
        }

        public IEnumerable<Flight> GetByDestinationId(long destinationId)
        {
            var flights = new List<Flight>();
            using (var conn = dbConnection.GetConnection())
            {
                conn.Open();
                var cmd = new SqlCommand(
                    "SELECT f.id, f.flight_number, f.departureCity, f.departureTime, f.arrivalTime, f.price, f.seatsAvailable, " +
                    "d.id AS dest_id, d.city, d.country, d.description, d.image " +
                    "FROM Flights f " +
                    "INNER JOIN Destinations d ON f.destination_id = d.id " +
                    "WHERE f.destination_id = @DestinationId", conn);
                cmd.Parameters.Add(new SqlParameter("@DestinationId", SqlDbType.BigInt) { Value = destinationId });

                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        flights.Add(MapFlight(reader));
                    }
                }
            }
            return flights;
        }

        public void Add(Flight flight)
        {
            using (var conn = dbConnection.GetConnection())
            {
                conn.Open();
                var cmd = new SqlCommand(
                    "INSERT INTO Flights (flight_number, departureCity, destination_id, departureTime, arrivalTime, price, seatsAvailable) " +
                    "OUTPUT INSERTED.id " +
                    "VALUES (@FlightNumber, @DepartureCity, @DestinationId, @DepartureTime, @ArrivalTime, @Price, @SeatsAvailable)", conn);
                cmd.Parameters.Add(new SqlParameter("@FlightNumber", SqlDbType.VarChar) { Value = flight.flightNumber });
                cmd.Parameters.Add(new SqlParameter("@DepartureCity", SqlDbType.VarChar) { Value = (object)flight.departureCity ?? DBNull.Value });
                cmd.Parameters.Add(new SqlParameter("@DestinationId", SqlDbType.BigInt) { Value = flight.destination.id });
                cmd.Parameters.Add(new SqlParameter("@DepartureTime", SqlDbType.DateTime) { Value = flight.departureTime });
                cmd.Parameters.Add(new SqlParameter("@ArrivalTime", SqlDbType.DateTime) { Value = flight.arrivalTime });
                cmd.Parameters.Add(new SqlParameter("@Price", SqlDbType.Decimal) { Value = flight.price });
                cmd.Parameters.Add(new SqlParameter("@SeatsAvailable", SqlDbType.Int) { Value = flight.seatsAvailable });

                flight.id = (long)cmd.ExecuteScalar();
            }
        }

        public void Update(Flight flight)
        {
            using (var conn = dbConnection.GetConnection())
            {
                conn.Open();
                var cmd = new SqlCommand(
                    "UPDATE Flights SET flight_number = @FlightNumber, departureCity = @DepartureCity, destination_id = @DestinationId, " +
                    "departureTime = @DepartureTime, arrivalTime = @ArrivalTime, price = @Price, seatsAvailable = @SeatsAvailable " +
                    "WHERE id = @Id", conn);
                cmd.Parameters.Add(new SqlParameter("@Id", SqlDbType.BigInt) { Value = flight.id });
                cmd.Parameters.Add(new SqlParameter("@FlightNumber", SqlDbType.VarChar) { Value = flight.flightNumber });
                cmd.Parameters.Add(new SqlParameter("@DepartureCity", SqlDbType.VarChar) { Value = (object)flight.departureCity ?? DBNull.Value });
                cmd.Parameters.Add(new SqlParameter("@DestinationId", SqlDbType.BigInt) { Value = flight.destination.id });
                cmd.Parameters.Add(new SqlParameter("@DepartureTime", SqlDbType.DateTime) { Value = flight.departureTime });
                cmd.Parameters.Add(new SqlParameter("@ArrivalTime", SqlDbType.DateTime) { Value = flight.arrivalTime });
                cmd.Parameters.Add(new SqlParameter("@Price", SqlDbType.Decimal) { Value = flight.price });
                cmd.Parameters.Add(new SqlParameter("@SeatsAvailable", SqlDbType.Int) { Value = flight.seatsAvailable });

                cmd.ExecuteNonQuery();
            }
        }

        public void Delete(long id)
        {
            using (var conn = dbConnection.GetConnection())
            {
                conn.Open();
                var cmd = new SqlCommand("DELETE FROM Flights WHERE id = @Id", conn);
                cmd.Parameters.Add(new SqlParameter("@Id", SqlDbType.BigInt) { Value = id });
                cmd.ExecuteNonQuery();
            }
        }

        private Flight MapFlight(SqlDataReader reader)
        {
            return new Flight
            {
                id = reader.GetInt64(reader.GetOrdinal("id")),
                flightNumber = reader.GetString(reader.GetOrdinal("flight_number")),
                departureCity = reader.IsDBNull(reader.GetOrdinal("departureCity")) ? null : reader.GetString(reader.GetOrdinal("departureCity")),
                departureTime = reader.GetDateTime(reader.GetOrdinal("departureTime")),
                arrivalTime = reader.GetDateTime(reader.GetOrdinal("arrivalTime")),
                price = reader.GetDecimal(reader.GetOrdinal("price")),
                seatsAvailable = reader.GetInt32(reader.GetOrdinal("seatsAvailable")),
                destination = new Destination
                {
                    id = reader.GetInt64(reader.GetOrdinal("dest_id")),
                    city = reader.GetString(reader.GetOrdinal("city")),
                    country = reader.GetString(reader.GetOrdinal("country")),
                    description = reader.GetString(reader.GetOrdinal("description")),
                    image = reader.IsDBNull(reader.GetOrdinal("image")) ? null : reader.GetString(reader.GetOrdinal("image"))
                }
            };
        }
    }
}