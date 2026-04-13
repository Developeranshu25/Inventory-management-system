using IMS.Core.DTOs;
using IMS.Core.Entities;
using IMS.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace IMS.Infrastructure.Services;

public class AlertService
{
    private readonly ApplicationDbContext _db;

    public AlertService(ApplicationDbContext db) => _db = db;

    public async Task<List<AlertDto>> GetAlertsAsync(bool unreadOnly = false)
    {
        var query = _db.Alerts.AsQueryable();
        if (unreadOnly)
            query = query.Where(a => !a.IsRead);

        var alerts = await query
            .Include(a => a.Product)
            .OrderByDescending(a => a.CreatedAt)
            .Take(50)
            .ToListAsync();

        return alerts.Select(MapToDto).ToList();
    }

    public async Task MarkAsReadAsync(int id)
    {
        var alert = await _db.Alerts.FindAsync(id);
        if (alert != null)
        {
            alert.IsRead = true;
            await _db.SaveChangesAsync();
        }
    }

    public async Task CheckAndCreateAlertsAsync()
    {
        await CheckLowStockAlertsAsync();
        await CheckExpiryAlertsAsync();
        await CheckOverstockAlertsAsync();
    }

    private async Task CheckLowStockAlertsAsync()
    {
        var stockLevels = await _db.StockLevels
            .GroupBy(s => s.ProductId)
            .Select(g => new { ProductId = g.Key, Total = g.Sum(x => x.Quantity) })
            .ToListAsync();

        var lowStockProducts = await _db.Products
            .Where(p => p.IsActive)
            .ToListAsync();

        foreach (var product in lowStockProducts)
        {
            var stock = stockLevels.Where(s => s.ProductId == product.Id).Select(s => s.Total).FirstOrDefault();
            if (stock < product.MinimumStockLevel)
            {
                var exists = await _db.Alerts.AnyAsync(a =>
                    a.AlertType == "LowStock" && a.ProductId == product.Id && !a.IsRead);
                if (!exists)
                {
                    _db.Alerts.Add(new Alert
                    {
                        AlertType = "LowStock",
                        Title = "Low Stock Alert",
                        Message = $"{product.Name} is below minimum stock level. Current: {stock}, Minimum: {product.MinimumStockLevel}",
                        ProductId = product.Id,
                        Severity = stock == 0 ? "Critical" : "Warning"
                    });
                }
            }
        }
        await _db.SaveChangesAsync();
    }

    private async Task CheckExpiryAlertsAsync()
    {
        var expiryDate = DateTime.UtcNow.AddDays(30);
        var expiringItems = await _db.StockLevels
            .Where(s => s.ExpiryDate.HasValue && s.ExpiryDate <= expiryDate && s.Quantity > 0)
            .Include(s => s.Product)
            .ToListAsync();

        foreach (var item in expiringItems)
        {
            var daysUntilExpiry = (item.ExpiryDate!.Value - DateTime.UtcNow).Days;
            var exists = await _db.Alerts.AnyAsync(a =>
                a.AlertType == "Expiry" && a.ProductId == item.ProductId && !a.IsRead);
            if (!exists)
            {
                _db.Alerts.Add(new Alert
                {
                    AlertType = "Expiry",
                    Title = "Expiring Item Alert",
                    Message = $"{item.Product.Name} (Batch: {item.BatchNumber}) expires in {daysUntilExpiry} days",
                    ProductId = item.ProductId,
                    Severity = daysUntilExpiry <= 7 ? "Critical" : "Warning"
                });
            }
        }
        await _db.SaveChangesAsync();
    }

    private async Task CheckOverstockAlertsAsync()
    {
        var stockLevels = await _db.StockLevels
            .GroupBy(s => s.ProductId)
            .Select(g => new { ProductId = g.Key, Total = g.Sum(x => x.Quantity) })
            .ToListAsync();

        var products = await _db.Products
            .Where(p => p.IsActive)
            .ToListAsync();

        foreach (var product in products)
        {
            var stock = stockLevels.Where(s => s.ProductId == product.Id).Select(s => s.Total).FirstOrDefault();
            var overstockThreshold = product.MinimumStockLevel * 3; // 3x minimum stock
            if (stock > overstockThreshold)
            {
                var exists = await _db.Alerts.AnyAsync(a =>
                    a.AlertType == "Overstock" && a.ProductId == product.Id && !a.IsRead);
                if (!exists)
                {
                    _db.Alerts.Add(new Alert
                    {
                        AlertType = "Overstock",
                        Title = "Overstock Alert",
                        Message = $"{product.Name} has high stock level. Current: {stock}, Threshold: {overstockThreshold}",
                        ProductId = product.Id,
                        Severity = "Info"
                    });
                }
            }
        }
        await _db.SaveChangesAsync();
    }

    private static AlertDto MapToDto(Alert a) =>
        new(a.Id, a.AlertType, a.Title, a.Message, a.ProductId, a.Product?.Name, a.Severity, a.IsRead, a.CreatedAt);
}

