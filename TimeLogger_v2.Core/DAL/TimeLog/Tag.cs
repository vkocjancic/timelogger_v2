using System;
using System.Collections.Generic;
using System.Text;

namespace TimeLogger_v2.Core.DAL.TimeLog
{
    public class Tag
    {

        #region Properties

        public string Name { get; set; }

        #endregion

        #region Constructors

        public Tag() { }

        public Tag(string name) : this() => Name = name;

        #endregion

    }

}
