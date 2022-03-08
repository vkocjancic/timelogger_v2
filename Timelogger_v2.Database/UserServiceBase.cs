using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Text;

namespace Timelogger_v2.Database
{
    public abstract class UserServiceBase
    {

        #region Declarations

        protected readonly string _databaseRoot = "db\\users";

        #endregion

        #region Helper methods

        protected string GetDatabaseFullNameForUser(string username)
        {
            return $"Filename={_databaseRoot}\\{GetDatabaseNameForUser(username)}.db; Connection=Shared;";
        }

        private string GetDatabaseNameForUser(string username)
        {
            using (var md5 = MD5.Create())
            {
                var result = md5.ComputeHash(Encoding.ASCII.GetBytes(username.ToLower()));
                return BitConverter.ToString(result).Replace("-", "");
            }
        }

        #endregion

    }
}
