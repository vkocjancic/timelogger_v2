using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TimeLogger_v2.App.Adapter
{
    internal interface IAdapter<TModel, TDomain>
    {

        TDomain ToDomain(TModel model);

        TModel FromDomain(TDomain domain);

    }

}
