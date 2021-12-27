using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using TimeLogger_v2.Core.DAL.Project;

namespace TimeLogger_v2.App.Model
{
    public class ProjectModel
    {

        #region Properties

        [JsonPropertyName("id")]
        public Guid Id { get; set; }

        [JsonPropertyName("name")]
        public string Name { get; set; }

        #endregion

        #region Constructors

        public ProjectModel() { }

        public ProjectModel(Project projectFromDb) : this()
        {
            Id = projectFromDb.Id;
            Name = projectFromDb.Name;
        }

        #endregion

    }
}
