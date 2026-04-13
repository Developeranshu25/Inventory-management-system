using IMS.Core.DTOs;
using IMS.Core.Entities;
using IMS.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace IMS.Infrastructure.Services;

public class SalesService
{
    private readonly ApplicationDbContext _db;
    private readonly StockService _stockService;

    public SalesService(ApplicationDbContext db, StockService stockService)
    {
        _db = db;
        _stockService = stockService;
    }

    public async Task<PagedResult<SaleDto>> GetAllAsync(int page = 1, int pageSize = 20,
        DateTime? fromDate = null, DateTime? toDate = null, int? warehouseId = null)
    {
        var query = _db.Sales
            .Include(s => s.Warehouse)
            .AsQueryable();

        if (fromDate.HasValue)
            query = query.Where(s => s.SaleDate >= fromDate.Value);
        if (toDate.HasValue)
            query = query.Where(s => s.SaleDate <= toDate.Value);
        if (warehouseId.HasValue)
            query = query.Where(s => s.WarehouseId == warehouseId.Value);

        var total = await query.CountAsync();
        var items = await query
            .OrderByDescending(s => s.SaleDate)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PagedResult<SaleDto>(items.Select(MapToDto).ToList(), total, page, pageSize);
    }

    public async Task<SaleDetailDto?> GetByIdAsync(int id)
    {
        var sale = await _db.Sales
            .Include(s => s.Warehouse)
            .Include(s => s.Items).ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(s => s.Id == id);
        if (sale == null) return null;

        return new SaleDetailDto(sale.Id, sale.InvoiceNumber, sale.Status, sale.SubTotal,
            sale.TaxAmount, sale.DiscountAmount, sale.TotalAmount, sale.PaymentStatus,
            sale.CustomerName, sale.CustomerPhone, sale.CustomerEmail, sale.WarehouseId,
            sale.Warehouse.Name, sale.Items.Select(i => new SalesItemDto(i.Id, i.ProductId,
                i.Product.Name, i.Product.Sku, i.Quantity, i.UnitPrice, i.DiscountPercent,
                i.TaxPercent, i.TotalPrice)).ToList(), sale.SaleDate, sale.CreatedAt);
    }

    public async Task<SaleDetailDto> CreateAsync(CreateSaleRequest req, int userId)
    {
        var invoiceNumber = $"INV-{DateTime.UtcNow:yyyyMMdd}-{await _db.Sales.CountAsync() + 1:D6}";
        var sale = new Sale
        {
            InvoiceNumber = invoiceNumber,
            WarehouseId = req.WarehouseId,
            CustomerName = req.CustomerName,
            CustomerPhone = req.CustomerPhone,
            CustomerEmail = req.CustomerEmail,
            Status = "Draft",
            CreatedByUserId = userId
        };

        decimal subTotal = 0;
        foreach (var itemReq in req.Items)
        {
            var product = await _db.Products.FindAsync(itemReq.ProductId);
            if (product == null) continue;

            var item = new SalesItem
            {
                ProductId = itemReq.ProductId,
                Quantity = itemReq.Quantity,
                UnitPrice = itemReq.UnitPrice,
                DiscountPercent = itemReq.DiscountPercent,
                TaxPercent = req.TaxPercent
            };
            sale.Items.Add(item);
            subTotal += item.TotalPrice;

            await _stockService.AdjustStockAsync(new StockAdjustmentRequest(
                itemReq.ProductId, req.WarehouseId, -itemReq.Quantity,
                $"Sale {invoiceNumber}", null, null), userId);
        }

        sale.SubTotal = subTotal;
        sale.DiscountAmount = req.DiscountAmount;
        sale.TaxAmount = sale.SubTotal * req.TaxPercent / 100;
        sale.TotalAmount = sale.SubTotal - sale.DiscountAmount + sale.TaxAmount;
        sale.Status = "Completed";
        sale.SaleDate = DateTime.UtcNow;

        _db.Sales.Add(sale);
        await _db.SaveChangesAsync();
        return (await GetByIdAsync(sale.Id))!;
    }

    private static SaleDto MapToDto(Sale s) =>
        new(s.Id, s.InvoiceNumber, s.Status, s.SubTotal, s.TaxAmount, s.DiscountAmount,
            s.TotalAmount, s.PaymentStatus, s.CustomerName, s.WarehouseId, s.Warehouse.Name,
            s.SaleDate, s.CreatedAt);
}

