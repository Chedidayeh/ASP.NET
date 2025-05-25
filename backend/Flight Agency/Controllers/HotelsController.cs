using FlightAgency.DataAccess;
using FlightAgency.Models;
using System;
using System.Web.Http;

namespace FlightAgency.Controllers
{
    [RoutePrefix("api/hotels")]
    public class HotelsController : ApiController
    {
        private readonly IRepository<Hotel> hotelRepository;

        public HotelsController()
        {
            hotelRepository = new HotelADO();
        }

        [HttpGet]
        [Route("")]
        public IHttpActionResult GetAll()
        {
            try
            {
                var hotels = hotelRepository.GetAll();
                return Ok(hotels);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpGet]
        [Route("{id}")]
        public IHttpActionResult Get(long id)
        {
            try
            {
                var hotel = hotelRepository.GetById(id);
                if (hotel == null)
                {
                    return NotFound();
                }
                return Ok(hotel);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpPost]
        [Route("")]
        public IHttpActionResult Create([FromBody] Hotel hotel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                hotelRepository.Add(hotel);
                return Created(new Uri(Request.RequestUri + "/" + hotel.id), hotel);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpPut]
        [Route("{id}")]
        public IHttpActionResult Update(long id, [FromBody] Hotel hotel)
        {
            if (!ModelState.IsValid || hotel.id != id)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var existingHotel = hotelRepository.GetById(id);
                if (existingHotel == null)
                {
                    return NotFound();
                }
                hotelRepository.Update(hotel);
                return Ok(hotel);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpDelete]
        [Route("{id}")]
        public IHttpActionResult Delete(long id)
        {
            try
            {
                var hotel = hotelRepository.GetById(id);
                if (hotel == null)
                {
                    return NotFound();
                }
                hotelRepository.Delete(id);
                return Ok();
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }
    }
}