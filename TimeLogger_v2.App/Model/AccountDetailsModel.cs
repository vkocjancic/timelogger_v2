﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace TimeLogger_v2.App.Model
{
    public class AccountDetailsModel
    {

        #region Properties

        [JsonPropertyName("username")]
        public string Username { get; set; }

        [JsonPropertyName("accountType")]
        public string AccountType { get; set; } = "FREE";

        [JsonPropertyName("expiresIsoDate")]
        public string ExpiresIsoDate { get; set; } = null;

        #endregion


        #region Constructors

        public AccountDetailsModel(string username) => Username = username.ToLower();

        #endregion

    }
}