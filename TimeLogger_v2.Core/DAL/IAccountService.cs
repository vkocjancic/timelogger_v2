﻿using System;
using System.Collections.Generic;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Timelogger_v2.Core.DAL.Account;

namespace TimeLogger_v2.Core.DAL
{

    public interface IAccountService
    {
        Task<bool> AreCredentialsValid(string username, string password);
        Task<bool> CanLogin(IPAddress remoteIpAddress, string username);
        Task<bool> CanRegister(IPAddress remoteIpAddress, string username);
        Task<bool> CanResetPassword(IPAddress remoteIpAddress, string username);
        Task<bool> CanResetPassword(IPAddress remoteIpAddress, Guid passwordResetId);
        Task<bool> CreateAccount(string username, string password);
        Task<PasswordReset> CreatePasswordResetEntry(IPAddress remoteIpAddress, string username);
        Task<int> GetNextLoginTimeout(IPAddress remoteIpAddress, string username);
        Task InsertLoginAttempt(IPAddress remoteIpAddress, string username, bool isSuccessful);
        Task<PasswordReset> ResetPassword(Guid passwordResetId, string password);
    }

}