using IMS.Core.DTOs;
using IMS.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace IMS.Infrastructure.Services;

public class ReportService
{
    private readonly ApplicationDbContext _db;

    public ReportService(ApplicationDbContext db) => _db = db;

    public async Task<DashboardStatsDto> GetDashboardStatsAsync()
    {
        var today = DateTime.UtcNow.Date;
        var monthStart = new DateTime(today.Year, today.Month, 1);

        var totalProducts = await _db.Products.CountAsync(p => p.IsActive);
        var totalWarehouses = await _db.Warehouses.CountAsync(w => w.IsActive);
        var pendingPOs = await _db.PurchaseOrders.CountAsync(p => p.Status == "PendingApproval" || p.Status == "Approved");

        var stockLevels = await _db.StockLevels
            .GroupBy(s => s.ProductId)
            .Select(g => new { ProductId = g.Key, Total = g.Sum(x => x.Quantity) })
            .ToListAsync();

        var products = await _db.Products
            .Where(p => p.IsActive)
            .Select(p => new { p.Id, p.MinimumStockLevel })
            .ToListAsync();

        var lowStockCount = products.Count(p =>
            stockLevels.Where(s => s.ProductId == p.Id).Select(s => s.Total).FirstOrDefault() < p.MinimumStockLevel);

        var todaySales = await _db.Sales
            .Where(s => s.SaleDate.Date == today && s.Status == "Completed")
            .SumAsync(s => s.TotalAmount);

        var monthSales = await _db.Sales
            .Where(s => s.SaleDate >= monthStart && s.Status == "Completed")
            .SumAsync(s => s.TotalAmount);

        return new DashboardStatsDto(totalProducts, lowStockCount, totalWarehouses, pendingPOs, todaySales, monthSales);
    }

    public async Task<List<LowStockReportDto>> GetLowStockReportAsync()
    {
        var stockLevels = await _db.StockLevels
            .GroupBy(s => s.ProductId)
            .Select(g => new { ProductId = g.Key, Total = g.Sum(x => x.Quantity) })
            .ToListAsync();

        var products = await _db.Products
            .Where(p => p.IsActive)
            .Include(p => p.Category)
            .ToListAsync();

        var lowStock = products
            .Where(p =>
            {
                var stock = stockLevels.Where(s => s.ProductId == p.Id).Select(s => s.Total).FirstOrDefault();
                return stock < p.MinimumStockLevel;
            })
            .Select(p => new LowStockReportDto(p.Id, p.Name, p.Sku,
                stockLevels.Where(s => s.ProductId == p.Id).Select(s => s.Total).FirstOrDefault(),
                p.MinimumStockLevel,
                p.MinimumStockLevel - stockLevels.Where(s => s.ProductId == p.Id).Select(s => s.Total).FirstOrDefault()))
            .OrderBy(r => r.Deficit)
            .ToList();

        return lowStock;
    }

    public async Task<List<ExpiringItemsReportDto>> GetExpiringItemsReportAsync(int daysAhead = 30)
    {
        var expiryDate = DateTime.UtcNow.AddDays(daysAhead);
        var items = await _db.StockLevels
            .Where(s => s.ExpiryDate.HasValue && s.ExpiryDate <= expiryDate && s.Quantity > 0)
            .Include(s => s.Product)
            .ToListAsync();

        return items.Select(s => new ExpiringItemsReportDto(s.ProductId, s.Product.Name, s.BatchNumber,
            s.Quantity, s.ExpiryDate!.Value, (s.ExpiryDate.Value - DateTime.UtcNow).Days)).ToList();
    }

    public async Task<List<SalesReportDto>> GetSalesReportAsync(DateTime fromDate, DateTime toDate)
    {
        var sales = await _db.Sales
            .Where(s => s.SaleDate.Date >= fromDate.Date && s.SaleDate.Date <= toDate.Date && s.Status == "Completed")
            .Include(s => s.Items).ThenInclude(i => i.Product)
            .ToListAsync();

        var grouped = sales
            .GroupBy(s => s.SaleDate.Date)
            .Select(g => new SalesReportDto(
                g.Key,
                g.Count(),
                g.Sum(s => s.TotalAmount),
                g.Sum(s => s.TotalAmount - s.Items.Sum(i => i.Quantity * i.Product.CostPrice))))
            .OrderBy(r => r.Date)
            .ToList();

        return grouped;
    }

    public async Task<List<TopSellingProductDto>> GetTopSellingProductsAsync(int top = 10, DateTime? fromDate = null, DateTime? toDate = null)
    {
        var query = _db.SalesItems
            .Include(i => i.Sale)
            .Include(i => i.Product)
            .Where(i => i.Sale.Status == "Completed");

        if (fromDate.HasValue)
            query = query.Where(i => i.Sale.SaleDate >= fromDate.Value);
        if (toDate.HasValue)
            query = query.Where(i => i.Sale.SaleDate <= toDate.Value);

        var topProducts = await query
            .GroupBy(i => new { i.ProductId, i.Product.Name })
            .Select(g => new TopSellingProductDto(g.Key.ProductId, g.Key.Name,
                g.Sum(i => i.Quantity), g.Sum(i => i.TotalPrice)))
            .OrderByDescending(p => p.QuantitySold)
            .Take(top)
            .ToListAsync();

        return topProducts;
    }

    public async Task<List<LowStockReportDto>> GetDeadStockReportAsync(int daysInactive = 90)
    {
        var cutoffDate = DateTime.UtcNow.AddDays(-daysInactive);
        var activeProducts = await _db.SalesItems
            .Where(i => i.Sale.SaleDate >= cutoffDate && i.Sale.Status == "Completed")
            .Select(i => i.ProductId)
            .Distinct()
            .ToListAsync();

        var stockLevels = await _db.StockLevels
            .GroupBy(s => s.ProductId)
            .Select(g => new { ProductId = g.Key, Total = g.Sum(x => x.Quantity) })
            .ToListAsync();

        var allProducts = await _db.Products
            .Where(p => p.IsActive)
            .ToListAsync();

        var deadStock = allProducts
            .Where(p => !activeProducts.Contains(p.Id))
            .Select(p => new LowStockReportDto(p.Id, p.Name, p.Sku,
                stockLevels.Where(s => s.ProductId == p.Id).Select(s => s.Total).FirstOrDefault(),
                0, 0))
            .Where(p => p.CurrentStock > 0)
            .OrderByDescending(p => p.CurrentStock)
            .ToList();

        return deadStock;
    }

    public async Task<List<SalesReportDto>> GetSupplierPerformanceReportAsync(int? supplierId = null)
    {
        var query = _db.PurchaseOrders
            .Include(p => p.Supplier)
            .Where(p => p.Status == "Received");

        if (supplierId.HasValue)
            query = query.Where(p => p.SupplierId == supplierId.Value);

        var supplierData = await query
            .GroupBy(p => new { p.SupplierId, p.Supplier.Name })
            .Select(g => new SalesReportDto(
                DateTime.UtcNow,
                g.Count(),
                g.Sum(p => p.TotalAmount),
                g.Sum(p => p.TotalAmount)))
            .ToListAsync();

        return supplierData;
    }
}

