using System;
using System.Web.Http;
using FlightAgency.DataAccess;
using FlightAgency.Models;

namespace FlightAgency.Controllers
{
    [RoutePrefix("api/flights")]
    public class FlightsController : ApiController
    {
        private readonly IRepository<Flight> flightRepository;
        private readonly FlightADO flightADO;
        public FlightsController()
        {
            flightRepository = new FlightADO();
            flightADO = new FlightADO();
        }

        [HttpGet]
        [Route("by-destination/{destinationId}")]
        public IHttpActionResult GetByDestination(long destinationId)
        {
            try
            {
                var flights = flightADO.GetByDestinationId(destinationId);
                return Ok(flights);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error fetching flights for destination ID {destinationId}: {ex.Message}");
                return InternalServerError(ex);
            }
        }

        // Other endpoints (GetAll, GetById, Create, Update, Delete) can be added as needed
        [HttpGet]
        [Route("")]
        public IHttpActionResult GetAll()
        {
            try
            {
                var flights = flightRepository.GetAll();
                return Ok(flights);
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
                var flight = flightRepository.GetById(id);
                if (flight == null)
                {
                    return NotFound();
                }
                return Ok(flight);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpPost]
        [Route("")]
        public IHttpActionResult Create([FromBody] Flight flight)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                flightRepository.Add(flight);
                return Created(new Uri(Request.RequestUri + "/" + flight.id), flight);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpPut]
        [Route("{id}")]
        public IHttpActionResult Update(long id, [FromBody] Flight flight)
        {
            if (!ModelState.IsValid || flight.id != id)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var existingFlight = flightRepository.GetById(id);
                if (existingFlight == null)
                {
                    return NotFound();
                }
                flightRepository.Update(flight);
                return Ok(flight);
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
                var flight = flightRepository.GetById(id);
                if (flight == null)
                {
                    return NotFound();
                }
                flightRepository.Delete(id);
                return Ok();
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }
    }
}