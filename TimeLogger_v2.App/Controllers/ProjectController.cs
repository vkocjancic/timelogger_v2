using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TimeLogger_v2.App.Model;
using TimeLogger_v2.Core.DAL.Project;

namespace TimeLogger_v2.App.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ProjectController : ControllerBase
    {

        #region Declarations

        private readonly ILogger<ProjectController> _logger;
        private readonly IProjectService _projectService;

        #endregion

        #region Constructors

        public ProjectController(ILogger<ProjectController> logger, IProjectService projectService)
        {
            _logger = logger;
            _projectService = projectService;
        }

        #endregion

        #region API methods

        [HttpGet]
        public async Task<IActionResult> List()
        {
            var remoteIpAddress = Request.HttpContext.Connection.RemoteIpAddress;
            _logger.LogDebug("{0}\tList projects for user '{1}'", remoteIpAddress, Request.HttpContext.User.Identity.Name);
            var projectsFromDb = await _projectService.GetAllUserProjects(Request.HttpContext.User.Identity.Name);
            var projects = new ConcurrentBag<ProjectModel>();
            Parallel.ForEach(projectsFromDb, (projectFromDb) =>
            {
                projects.Add(new ProjectModel(projectFromDb));
            });
            _logger.LogInformation("{0}\tList projects for user '{1}' found {2} project(s)", remoteIpAddress, Request.HttpContext.User.Identity.Name, projects.Count);
            return Ok(projects);
        }

        #endregion

    }
}
