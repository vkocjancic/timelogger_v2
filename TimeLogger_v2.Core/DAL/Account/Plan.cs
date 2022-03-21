using System;
using System.Collections.Generic;
using System.Text;

namespace TimeLogger_v2.Core.DAL.Account
{
    public class Plan
    {

        #region Properties

        public string Code { get; set; }
        public int ExpireYears { get; set; }
        public string[] Info { get; set; }
        public int Mode { get; set; }
        public decimal Price { get; set; }
        public string Title { get; set; }

        #endregion

    }
}
