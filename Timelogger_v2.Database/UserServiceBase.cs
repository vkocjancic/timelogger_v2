using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Text;

namespace Timelogger_v2.Database
{
    public abstract class UserServiceBase
    {

        #region Helper methods

        protected string GetDatabaseNameForUser(string username)
        {
            using (var md5 = MD5.Create())
            {
                var result = md5.ComputeHash(Encoding.ASCII.GetBytes(username));
                return BitConverter.ToString(result).Replace("-", "");
            }
        }

        #endregion

    }
}
