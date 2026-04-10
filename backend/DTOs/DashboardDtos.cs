using System.Collections.Generic;

namespace backend.DTOs
{
    public class DashboardStatsDto
    {
        public decimal TotalRevenue { get; set; }
        public int TotalOrders { get; set; }
        public int TotalCustomers { get; set; }
        public List<TopProductDto> TopProducts { get; set; } = new();
        public List<MonthlyRevenueDto> RevenueChart { get; set; } = new();
    }

    public class TopProductDto
    {
        public string Name { get; set; } = string.Empty;
        public int Sold { get; set; }
        public decimal Revenue { get; set; }
    }

    public class MonthlyRevenueDto
    {
        public string Month { get; set; } = string.Empty;
        public decimal Revenue { get; set; }
    }
}
