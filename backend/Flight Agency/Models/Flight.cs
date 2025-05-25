using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FlightAgency.Models
{
    public class Flight
    {
        public long id { get; set; }
        public string flightNumber { get; set; }
        public string departureCity { get; set; }
        public Destination destination { get; set; }

        public DateTime departureTime { get; set; }
        public DateTime arrivalTime { get; set; }
        public decimal price { get; set; }
        public int seatsAvailable { get; set; }
    }
}