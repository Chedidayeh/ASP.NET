using FlightAgency.DataAccess;
using FlightAgency.Models;
using System;
using System.Web.Http;

namespace FlightAgency.Controllers
{
    [RoutePrefix("api/destinations")]
    public class DestinationsController : ApiController
    {
        private readonly IRepository<Destination> destinationRepository;

        public DestinationsController()
        {
            destinationRepository = new DestinationADO();
        }

        [HttpGet]
        [Route("")]
        public IHttpActionResult GetAll()
        {
            try
            {
                var destinations = destinationRepository.GetAll();
                return Ok(destinations);
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
                var destination = destinationRepository.GetById(id);
                if (destination == null)
                {
                    return NotFound();
                }
                return Ok(destination);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpPost]
        [Route("")]
        public IHttpActionResult Create([FromBody] Destination destination)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                destinationRepository.Add(destination);
                return Created(new Uri(Request.RequestUri + "/" + destination.id), destination);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpPut]
        [Route("{id}")]
        public IHttpActionResult Update(long id, [FromBody] Destination destination)
        {
            if (!ModelState.IsValid || destination.id != id)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var existingDestination = destinationRepository.GetById(id);
                if (existingDestination == null)
                {
                    return NotFound();
                }
                destinationRepository.Update(destination);
                return Ok(destination);
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
                var destination = destinationRepository.GetById(id);
                if (destination == null)
                {
                    return NotFound();
                }
                destinationRepository.Delete(id);
                return Ok();
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }
    }
}