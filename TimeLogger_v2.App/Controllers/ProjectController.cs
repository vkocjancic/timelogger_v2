using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TimeLogger_v2.App.Model;

namespace TimeLogger_v2.App.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ProjectController : ControllerBase
    {

        #region Declarations

        private readonly ILogger<ProjectController> _logger;

        #endregion

        #region Constructors

        public ProjectController(ILogger<ProjectController> logger)
        {
            _logger = logger;
        }

        #endregion

        #region API methods

        [HttpGet]
        public async Task<IActionResult> List()
        {
            var projects = new List<ProjectModel>();
            // TODO: check user's database for projects
            await Task.Run(() =>
            {
                projects.Add(new ProjectModel() { Id = Guid.NewGuid(), Name = "General" });
            });
            return Ok(projects);
        }

        #endregion

    }
}
