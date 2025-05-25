using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.SqlClient;
using System.Configuration;

namespace FlightAgency.DataAccess
{
    public class DatabaseConnection
    {
        private static DatabaseConnection instance;
        private readonly string connectionString;

        private DatabaseConnection()
        {
            connectionString = ConfigurationManager.ConnectionStrings["FlightAgencyDBConnection"].ConnectionString;
        }

        public static DatabaseConnection Instance
        {
            get
            {
                if (instance == null)
                {
                    instance = new DatabaseConnection();
                }
                return instance;
            }
        }

        public SqlConnection GetConnection()
        {
            return new SqlConnection(connectionString);
        }
    }
}