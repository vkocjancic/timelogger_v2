using LiteDB;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using TimeLogger_v2.Core.DAL.Account;

namespace TimeLogger_v2.Database.Account
{
    public class AccountService : IAccountService
    {

        #region Declarations

        private readonly string _databaseName = "Filename=db\\main.db; Connection=Shared;";
        private readonly int _defaultLoginTimeout = 10;
        private readonly int _maxLoginTimeout = 600;
        private ILogger<AccountService> _logger;

        #endregion

        #region Constructors

        public AccountService(ILogger<AccountService> logger)
        {
            _logger = logger;
        }

        #endregion

        #region IAccountService implementation

        public Task<bool> AreCredentialsValid(string username, string password)
        {
            var sw = Stopwatch.StartNew();
            var areCredentialsValid = false;
            if (!string.IsNullOrEmpty(username) && !string.IsNullOrEmpty(password))
            {
                using (var db = new LiteDatabase(_databaseName))
                {
                    var colAccounts = db.GetCollection<Core.DAL.Account.Account>(Core.DAL.Account.Account.Collection);
                    var account = colAccounts.Query()
                        .Where(a => a.Email.ToLower() == username.ToLower() && a.IsActive)
                        .FirstOrDefault();
                    if (null != account)
                    {
                        var hashPassword = HashPassword(password, account.Salt);
                        areCredentialsValid = hashPassword == account.Password;
                    }
                }
            }
            sw.Stop();
            _logger.LogDebug("{0} ms\tAreCredentialsValid", sw.ElapsedMilliseconds);
            return Task.FromResult(areCredentialsValid);
        }

        public async Task<bool> CanLogin(IPAddress remoteIpAddress, string username)
        {
            var sw = Stopwatch.StartNew();
            var canLogin = true;
            var loginTimeout = await GetNextLoginTimeout(remoteIpAddress, username) - _defaultLoginTimeout;
            if (loginTimeout > 0)
            {
                using (var db = new LiteDatabase(_databaseName))
                {
                    var colAudit = db.GetCollection<Audit>(Audit.Collection);
                    var lastAudit = colAudit.Query()
                        .Where(a => a.IpAddress == remoteIpAddress.ToString()
                            && a.Username.ToLower() == username.ToLower())
                        .OrderByDescending(a => a.Timestamp)
                        .FirstOrDefault();
                    canLogin = (null == lastAudit) 
                        || (lastAudit.IsSuccessful) 
                        || (lastAudit.Timestamp < DateTime.Now.AddSeconds(-loginTimeout));
                }
            }
            sw.Stop();
            _logger.LogDebug("{0} ms\tCanLogin", sw.ElapsedMilliseconds);
            return canLogin;
        }

        public async Task<bool> CanRegister(IPAddress remoteIpAddress, string username)
        {
            var canRegister = true;
            await Task.Run(() =>
            {
                var sw = Stopwatch.StartNew();
                using (var db = new LiteDatabase(_databaseName))
                {
                    var colAccount = db.GetCollection<Core.DAL.Account.Account>(Core.DAL.Account.Account.Collection);
                    var account = colAccount.Query()
                        .Where(a => a.Email.ToLower() == username.ToLower() && a.IsActive)
                        .FirstOrDefault();
                    canRegister = (null == account);
                }
                sw.Stop();
                _logger.LogDebug("{0} ms\tCanRegister", sw.ElapsedMilliseconds);
            });
            return canRegister;
        }

        public async Task<bool> CanResetPassword(IPAddress remoteIpAddress, string username)
        {
            var canResetPassword = true;
            await Task.Run(() => {
                var sw = Stopwatch.StartNew();
                using (var db = new LiteDatabase(_databaseName))
                {
                    var colAccount = db.GetCollection<Core.DAL.Account.Account>(Core.DAL.Account.Account.Collection);
                    var account = colAccount.Query()
                        .Where(a => a.Email.ToLower() == username.ToLower() && a.IsActive)
                        .FirstOrDefault();
                    canResetPassword = (null != account);
                }
                sw.Stop();
                _logger.LogDebug("{0} ms\tCanResetPassword", sw.ElapsedMilliseconds);
            });
            return canResetPassword;
        }

        public async Task<bool> CanResetPassword(IPAddress remoteIpAddress, Guid passwordResetId)
        {
            var canResetPassword = true;
            await Task.Run(() => {
                var sw = Stopwatch.StartNew();
                using (var db = new LiteDatabase(_databaseName))
                {
                    var colPwdReset = db.GetCollection<Core.DAL.Account.PasswordReset>(Core.DAL.Account.PasswordReset.Collection);
                    var pwdReset = colPwdReset.Query()
                        .Where(a => a.Id == passwordResetId && !a.IsUsed && a.Timestamp.AddHours(2) > DateTime.Now)
                        .FirstOrDefault();
                    canResetPassword = (null != pwdReset);
                }
                sw.Stop();
                _logger.LogDebug("{0} ms\tCanResetPassword", sw.ElapsedMilliseconds);
            });
            return canResetPassword;
        }

        public async Task<bool> CreateAccount(string username, string password)
        {
            var accountCreated = true;
            await Task.Run(() =>
            {
                var sw = Stopwatch.StartNew();
                using (var db = new LiteDatabase(_databaseName))
                {
                    var colAccount = db.GetCollection<Core.DAL.Account.Account>(Core.DAL.Account.Account.Collection);
                    var salt = GenerateSalt();
                    var pwdHash = HashPassword(password, salt);
                    colAccount.Insert(new Core.DAL.Account.Account()
                    {
                        Created = DateTime.Now,
                        Email = username,
                        Id = Guid.NewGuid(),
                        IsActive = true,
                        Password = pwdHash,
                        Salt = salt
                    });
                    accountCreated = true;
                }
                sw.Stop();
                _logger.LogDebug("{0} ms\tCreateAccount", sw.ElapsedMilliseconds);
            });
            return accountCreated;
        }

        public async Task<PasswordReset> CreatePasswordResetEntry(IPAddress remoteIpAddress, string username)
        {
            PasswordReset pwdResetEntry = null;
            await Task.Run(() => 
            {
                var sw = Stopwatch.StartNew();
                using (var db = new LiteDatabase(_databaseName))
                {
                    var colPwdReset = db.GetCollection<PasswordReset>(PasswordReset.Collection);
                    pwdResetEntry = new PasswordReset()
                    {
                        Id = Guid.NewGuid(),
                        IpAddress = remoteIpAddress.ToString(),
                        IsUsed = false,
                        Timestamp = DateTime.Now,
                        Username = username
                    };
                    colPwdReset.Insert(pwdResetEntry);
                }
                sw.Stop();
                _logger.LogDebug("{0} ms\tCreatePasswordResetEntry", sw.ElapsedMilliseconds);
            });
            return pwdResetEntry;
        }

        public async Task<Core.DAL.Account.Account> GetAccountDetails(string username)
        {
            Core.DAL.Account.Account account = null;
            await Task.Run(() =>
            {
                var sw = Stopwatch.StartNew();
                using (var db = new LiteDatabase(_databaseName))
                {
                    var colAccount= db.GetCollection<Core.DAL.Account.Account>(Core.DAL.Account.Account.Collection);
                    account = colAccount.Query()
                        .Where(a => a.Email.ToLower() == username.ToLower() && a.IsActive)
                        .FirstOrDefault();
                }
                sw.Stop();
                _logger.LogDebug("{0} ms\tCreatePasswordResetEntry", sw.ElapsedMilliseconds);
            });
            return account;
        }

        public Task<int> GetNextLoginTimeout(IPAddress remoteIpAddress, string username)
        {
            var sw = Stopwatch.StartNew();
            var nextLoginTimeout = _defaultLoginTimeout;
            using (var db = new LiteDatabase(_databaseName))
            {
                var colAudit = db.GetCollection<Audit>(Audit.Collection);
                var lastSuccessfulAudit = colAudit.Query()
                    .Where(a => a.IpAddress == remoteIpAddress.ToString()
                            && a.Username.ToLower() == username.ToLower()
                            && a.IsSuccessful)
                        .OrderByDescending(a => a.Timestamp)
                        .FirstOrDefault();
                var dateCutoff = lastSuccessfulAudit?.Timestamp ?? DateTime.Now.AddMinutes(-10);
                var noInvalidLoginAttempts = colAudit.Query()
                    .Where(a => a.IpAddress == remoteIpAddress.ToString() 
                        && a.Username.ToLower() == username.ToLower()
                        && a.Timestamp > dateCutoff)
                    .Count();
                nextLoginTimeout = Math.Min(nextLoginTimeout * (noInvalidLoginAttempts + 1), _maxLoginTimeout);
            }
            sw.Stop();
            _logger.LogDebug("{0} ms\tGetNextLoginTimeout", sw.ElapsedMilliseconds);
            return Task.FromResult(nextLoginTimeout);
        }

        public Task InsertLoginAttempt(IPAddress remoteIpAddress, string username, bool isSuccessful)
        {
            var sw = Stopwatch.StartNew();
            using (var db = new LiteDatabase(_databaseName))
            {
                var colAudit = db.GetCollection<Audit>(Audit.Collection);
                colAudit.Insert(new Audit()
                {
                    Id = Guid.NewGuid(),
                    IpAddress = remoteIpAddress.ToString(),
                    IsSuccessful = isSuccessful,
                    Timestamp = DateTime.Now,
                    Username = username
                });
            }
            sw.Stop();
            _logger.LogDebug("{0} ms\tInsertLoginAttempt", sw.ElapsedMilliseconds);
            return Task.FromResult(0);
        }

        public async Task<PasswordReset> ResetPassword(Guid passwordResetId, string password)
        {
            PasswordReset pwdResetEntry = null;
            await Task.Run(() =>
            {
                var sw = Stopwatch.StartNew();
                using (var db = new LiteDatabase(_databaseName))
                {
                    var colPwdReset = db.GetCollection<PasswordReset>(PasswordReset.Collection);
                    pwdResetEntry = colPwdReset.Query()
                        .Where(pr => pr.Id == passwordResetId && !pr.IsUsed)
                        .FirstOrDefault();
                    if (null == pwdResetEntry)
                    {
                        return;
                    }
                    pwdResetEntry.IsUsed = true;
                    colPwdReset.Update(pwdResetEntry);
                    var colAccount = db.GetCollection<Core.DAL.Account.Account>(Core.DAL.Account.Account.Collection);
                    var account = colAccount.Query()
                        .Where(a => a.Email.ToLower() == pwdResetEntry.Username.ToLower() && a.IsActive)
                        .FirstOrDefault();
                    if (null == account)
                    {
                        pwdResetEntry = null;
                        return;
                    }
                    var salt = GenerateSalt();
                    var pwdHash = HashPassword(password, salt);
                    account.Salt = salt;
                    account.Password = pwdHash;
                    colAccount.Update(account);
                }
                sw.Stop();
                _logger.LogDebug("{0} ms\tResetPassword", sw.ElapsedMilliseconds);
            });
            return pwdResetEntry;
        }

        #endregion

        #region Password methods

        public string GenerateSalt()
        {
            var salt = new byte[128 / 8];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(salt);
            }
            return Convert.ToBase64String(salt);
        }

        public string HashPassword(string passwordRaw, string saltBase64)
        {
            var salt = Convert.FromBase64String(saltBase64);
            return Convert.ToBase64String(
                KeyDerivation.Pbkdf2(
                    password: passwordRaw,
                    salt: salt,
                    prf: KeyDerivationPrf.HMACSHA512,
                    iterationCount: 10000,
                    numBytesRequested: 512 / 8
                )
            );
        }

        #endregion

    }
}
