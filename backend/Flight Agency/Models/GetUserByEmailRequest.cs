using System.ComponentModel.DataAnnotations;

namespace FlightAgency.Models
{
    public class GetUserByEmailRequest
    {
        [Required]
        [EmailAddress]
        public string email { get; set; }
    }
}