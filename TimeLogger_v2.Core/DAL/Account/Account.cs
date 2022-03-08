using System;
using System.Collections.Generic;
using System.Text;

namespace TimeLogger_v2.Core.DAL.Account
{

    public class Account : BusinessBase
    {

        #region Declarations

        public static string Collection = "Accounts";

        #endregion

        #region Properties

        public DateTime Created { get; set; }
        public bool IsActive { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Salt { get; set; }
        public string AccountType { get; set; }
        public DateTime? ExpiresDate { get; set; }

        #endregion

    }

}
