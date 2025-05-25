using System;
using System.Collections.Generic;
using System.Linq;
using System.ComponentModel.DataAnnotations;

namespace FlightAgency.Models
{
    public class Reservation
    {
        public long id { get; set; }
        public AppUser user { get; set; }
        public Flight flight { get; set; }
        public Hotel hotel { get; set; }
        public DateTime reservationDate { get; set; }
    }
}