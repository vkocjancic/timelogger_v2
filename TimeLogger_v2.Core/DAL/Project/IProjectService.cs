using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace TimeLogger_v2.Core.DAL.Project
{
    public interface IProjectService
    {

        Task<IEnumerable<Project>>GetAllUserProjects(string username);

    }

}
