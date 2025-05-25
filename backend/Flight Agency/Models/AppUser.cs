namespace FlightAgency.Models
{
    public class AppUser
    {
        public long id { get; set; }
        public string name { get; set; }
        public string email { get; set; }
        public string password { get; set; }
        public string role { get; set; } 
    }
}