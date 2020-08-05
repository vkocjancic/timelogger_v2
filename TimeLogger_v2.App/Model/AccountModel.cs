using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TimeLogger_v2.App.Model
{
    public class AccountModel
    {

        #region Properties

        public string Username { get; set; }
        public string Password { get; set; }
        public string PasswordCheck { get; set; }
        public Guid PasswordResetId { get; set; }

        #endregion

    }
}
