using FlightAgency.DataAccess;
using FlightAgency.Models;
using System;
using System.Web.Http;

namespace FlightAgency.Controllers
{
    [RoutePrefix("api/users")]
    public class UsersController : ApiController
    {
        private readonly IRepository<AppUser> userRepository;

        public UsersController()
        {
            userRepository = new AppUserADO();
        }

        [HttpGet]
        [Route("")]
        public IHttpActionResult GetAll()
        {
            try
            {
                var users = userRepository.GetAll();
                return Ok(users);
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
                var user = userRepository.GetById(id);
                if (user == null)
                {
                    return NotFound();
                }
                return Ok(user);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpPost]
        [Route("by-email")]
        public IHttpActionResult GetByEmailPost([FromBody] GetUserByEmailRequest request)
        {
            if (!ModelState.IsValid || request == null || string.IsNullOrEmpty(request.email))
            {
                return BadRequest("Email is required.");
            }

            try
            {
                var user = ((AppUserADO)userRepository).GetByEmail(request.email);
                if (user == null)
                {
                    return NotFound();
                }
                return Ok(user);
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

        [HttpPost]
        [Route("")]
        public IHttpActionResult Create([FromBody] AppUser user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                userRepository.Add(user);
                return Created(new Uri(Request.RequestUri + "/" + user.id), user);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpPut]
        [Route("{id}")]
        public IHttpActionResult Update(long id, [FromBody] AppUser user)
        {
            if (!ModelState.IsValid || user.id != id)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var existingUser = userRepository.GetById(id);
                if (existingUser == null)
                {
                    return NotFound();
                }
                userRepository.Update(user);
                return Ok(user);
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
                var user = userRepository.GetById(id);
                if (user == null)
                {
                    return NotFound();
                }
                userRepository.Delete(id);
                return Ok();
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }


        [HttpPost]
        [Route("login")]
        public IHttpActionResult Login([FromBody] LoginRequest loginRequest)
        {
            if (!ModelState.IsValid || loginRequest == null || string.IsNullOrEmpty(loginRequest.email) || string.IsNullOrEmpty(loginRequest.password))
            {
                return BadRequest("Email and password are required.");
            }

            try
            {
                bool isValid = ((AppUserADO)userRepository).VerifyCredentials(loginRequest.email, loginRequest.password);
                if (isValid)
                {
                    return Ok(true);
                }
                return Unauthorized();
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }
    }
}