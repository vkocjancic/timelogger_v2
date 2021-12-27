using LiteDB;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TimeLogger_v2.Core.DAL.Project;

namespace Timelogger_v2.Database.Project
{
    public class ProjectService : UserServiceBase, IProjectService
    {

        #region Declarations

        private readonly string _databaseRoot = "db\\users";
        private ILogger<ProjectService> _logger;

        #endregion

        #region Constructors

        public ProjectService(ILogger<ProjectService> logger)
        {
            _logger = logger;
        }

        #endregion

        #region IProjectService implementation

        public Task<IEnumerable<TimeLogger_v2.Core.DAL.Project.Project>> GetAllUserProjects(string username)
        {
            var sw = Stopwatch.StartNew();
            List<TimeLogger_v2.Core.DAL.Project.Project> projects = null;
            var databaseName = $"{_databaseRoot}\\{GetDatabaseNameForUser(username)}.db";
            using (var db = new LiteDatabase(databaseName))
            {
                var colProjects = db.GetCollection<TimeLogger_v2.Core.DAL.Project.Project>(TimeLogger_v2.Core.DAL.Project.Project.Collection);
                projects = colProjects.Query().ToList();
            }
            projects.Insert(0, new TimeLogger_v2.Core.DAL.Project.Project() { Created = new DateTime(2021, 1, 1), Name = "General" });
            sw.Stop();
            _logger.LogDebug("{0} ms\tGetAllUserProjects", sw.ElapsedMilliseconds);
            return Task.FromResult(projects.AsEnumerable());
        }

        #endregion

    }
}
