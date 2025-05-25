using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FlightAgency.Models
{
    public class Destination
    {
        public long id { get; set; }
        public string city { get; set; }
        public string country { get; set; }
        public string description { get; set; }
        public string image { get; set; }
    }
}