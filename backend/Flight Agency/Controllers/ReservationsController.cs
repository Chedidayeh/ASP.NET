using FlightAgency.DataAccess;
using FlightAgency.Models;
using System;
using System.Web.Http;

namespace FlightAgency.Controllers
{
    [RoutePrefix("api/reservations")]
    public class ReservationsController : ApiController
    {
        private readonly IRepository<Reservation> reservationRepository;

        public ReservationsController()
        {
            reservationRepository = new ReservationADO();
        }

        [HttpGet]
        [Route("")]
        public IHttpActionResult GetAll()
        {
            try
            {
                var reservations = reservationRepository.GetAll();
                return Ok(reservations);
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
                var reservation = reservationRepository.GetById(id);
                if (reservation == null)
                {
                    return NotFound();
                }
                return Ok(reservation);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }


        [HttpPost]
        [Route("")]
        public IHttpActionResult Create([FromBody] Reservation reservation)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                reservationRepository.Add(reservation);
                return Created(new Uri(Request.RequestUri + "/" + reservation.id), reservation);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpPut]
        [Route("{id}")]
        public IHttpActionResult Update(long id, [FromBody] Reservation reservation)
        {
            if (!ModelState.IsValid || reservation.id != id)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var existingReservation = reservationRepository.GetById(id);
                if (existingReservation == null)
                {
                    return NotFound();
                }
                reservationRepository.Update(reservation);
                return Ok(reservation);
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
                var reservation = reservationRepository.GetById(id);
                if (reservation == null)
                {
                    return NotFound();
                }
                reservationRepository.Delete(id);
                return Ok();
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }



        [HttpPost]
        [Route("by-user-email")]
        public IHttpActionResult GetByUserEmail([FromBody] GetUserByEmailRequest request)
        {
            if (!ModelState.IsValid || request == null || string.IsNullOrEmpty(request.email))
            {
                return BadRequest("Email is required.");
            }

            try
            {
                var reservations = ((ReservationADO)reservationRepository).GetByUserEmail(request.email);
                return Ok(reservations);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        // New endpoint for getting reservations by destination ID
        [HttpGet]
        [Route("by-destination/{destinationId}")]
        public IHttpActionResult GetByDestinationId(long destinationId)
        {
            try
            {
                var reservations = ((ReservationADO)reservationRepository).GetByDestinationId(destinationId);
                return Ok(reservations);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }
    }
}