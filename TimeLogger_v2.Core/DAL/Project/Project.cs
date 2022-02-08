using System;
using System.Collections.Generic;
using System.Text;
using TimeLogger_v2.Core.DAL;

namespace TimeLogger_v2.Core.DAL.Project
{
    public class Project : BusinessBase
    {

        #region Declarations

        public static string Collection = "Projects";

        #endregion

        #region Properties

        public DateTime? Created { get; set; }

        public string Name { get; set; }

        #endregion

    }
}
