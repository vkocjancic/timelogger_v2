using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using TimeLogger_v2.App.Model;
using TimeLogger_v2.Core.DAL.Insights;

namespace TimeLogger_v2.App.Adapter
{
    public class InsightsChartDataAdapter : AdapterBase<InsightsChartDataModel, ChartData>
    {

        #region IAdapter implementation

        public override InsightsChartDataModel FromDomain(ChartData domain)
        {
            throw new NotImplementedException();
        }

        public override ChartData ToDomain(InsightsChartDataModel model)
        {
            throw new NotImplementedException();
        }

        #endregion

        #region Custom adapter methods

        public InsightsChartDataModel FromDomain(IEnumerable<ChartData> domainItems, DateTime dateStart, DateTime dateEnd)
        {
            var dataHours = new List<decimal>();
            var dataTags = new List<decimal>();
            var dataTasks = new List<decimal>();
            var labels = new List<string>();
            if (dateStart.AddMonths(6).Date > dateEnd.Date)
            {
                // daily overview
                for (var dateTemp = dateStart; dateTemp <= dateEnd; dateTemp = dateTemp.AddDays(1))
                {
                    var item = domainItems.FirstOrDefault(i => i.Label.Date == dateTemp.Date);
                    if (null == item)
                    {
                        dataHours.Add(0M);
                        dataTags.Add(0);
                        dataTasks.Add(0);
                    }
                    else
                    {
                        dataHours.Add(item.TotalMinutes / 60);
                        dataTags.Add(item.TotalTags);
                        dataTasks.Add(item.TotalTasks);
                    }
                    labels.Add(dateTemp.ToString("dd.MM.", CultureInfo.CurrentUICulture));
                }
            }
            else
            {
                // monthly overview
                for (var dateTemp = dateStart; dateTemp <= dateEnd.AddDays(1); dateTemp = dateTemp.AddMonths(1))
                {
                    var item = domainItems.FirstOrDefault(i => i.Label.Date == new DateTime(dateTemp.Year, dateTemp.Month, 1));
                    if (null == item)
                    {
                        dataHours.Add(0M);
                        dataTags.Add(0);
                        dataTasks.Add(0);
                    }
                    else
                    {
                        dataHours.Add(item.TotalMinutes / 60);
                        dataTags.Add(item.TotalTags);
                        dataTasks.Add(item.TotalTasks);
                    }
                    labels.Add(dateTemp.ToString("MMMM, yyyy", CultureInfo.CurrentUICulture));
                }
            }
            return new InsightsChartDataModel()
            {
                DataSets = new List<InsightsChartDataSetModel>() { 
                    new InsightsChartDataSetModel() { Data = dataHours, Label = "Hours" },
                    new InsightsChartDataSetModel() { Data = dataTasks, Label = "Entries" },
                    new InsightsChartDataSetModel() { Data = dataTags, Label = "Tags (distinct)" }
                },
                Labels = labels
            };
        }

        #endregion

    }
}
