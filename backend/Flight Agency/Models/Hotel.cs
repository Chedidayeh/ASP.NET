using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FlightAgency.Models
{
    public class Hotel
    {
        public long id { get; set; }
        public string name { get; set; }
        public Destination destination { get; set; }
        public int stars { get; set; }
        public decimal pricePerNight { get; set; }
        public string image { get; set; }
    }
}