using IMS.Core.DTOs;
using IMS.Core.Entities;
using IMS.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace IMS.Infrastructure.Services;

public class PurchaseService
{
    private readonly ApplicationDbContext _db;
    private readonly StockService _stockService;

    public PurchaseService(ApplicationDbContext db, StockService stockService)
    {
        _db = db;
        _stockService = stockService;
    }

    public async Task<PagedResult<PurchaseOrderDto>> GetAllAsync(int page = 1, int pageSize = 20,
        string? status = null, int? supplierId = null)
    {
        var query = _db.PurchaseOrders
            .Include(p => p.Supplier)
            .Include(p => p.CreatedByUser)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(status))
            query = query.Where(p => p.Status == status);
        if (supplierId.HasValue)
            query = query.Where(p => p.SupplierId == supplierId.Value);

        var total = await query.CountAsync();
        var items = await query
            .OrderByDescending(p => p.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PagedResult<PurchaseOrderDto>(
            items.Select(MapToDto).ToList(), total, page, pageSize);
    }

    public async Task<PurchaseOrderDetailDto?> GetByIdAsync(int id)
    {
        var po = await _db.PurchaseOrders
            .Include(p => p.Supplier)
            .Include(p => p.Items).ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(p => p.Id == id);
        if (po == null) return null;

        return new PurchaseOrderDetailDto(
            po.Id, po.PONumber, po.SupplierId, po.Supplier.Name, po.Status, po.TotalAmount,
            po.PaymentStatus, po.OrderDate, po.ExpectedDeliveryDate, po.ReceivedDate,
            po.Items.Select(i => new PurchaseOrderItemDto(i.Id, i.ProductId, i.Product.Name,
                i.Product.Sku, i.QuantityOrdered, i.QuantityReceived, i.UnitCost, i.TotalCost)).ToList(),
            po.CreatedAt);
    }

    public async Task<PurchaseOrderDetailDto> CreateAsync(CreatePurchaseOrderRequest req, int userId)
    {
        var poNumber = $"PO-{DateTime.UtcNow:yyyyMMdd}-{await _db.PurchaseOrders.CountAsync() + 1:D6}";
        var po = new PurchaseOrder
        {
            PONumber = poNumber,
            SupplierId = req.SupplierId,
            Status = "Draft",
            OrderDate = req.OrderDate ?? DateTime.UtcNow,
            ExpectedDeliveryDate = req.ExpectedDeliveryDate,
            CreatedByUserId = userId
        };

        foreach (var item in req.Items)
        {
            var product = await _db.Products.FindAsync(item.ProductId);
            if (product == null) continue;

            po.Items.Add(new PurchaseOrderItem
            {
                ProductId = item.ProductId,
                QuantityOrdered = item.Quantity,
                UnitCost = item.UnitCost
            });
        }

        po.TotalAmount = po.Items.Sum(i => i.TotalCost);
        _db.PurchaseOrders.Add(po);
        await _db.SaveChangesAsync();
        return (await GetByIdAsync(po.Id))!;
    }

    public async Task<bool> ApproveAsync(int id, int userId)
    {
        var po = await _db.PurchaseOrders.FindAsync(id);
        if (po == null || po.Status != "Draft") return false;
        po.Status = "Approved";
        po.ApprovedByUserId = userId;
        po.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ReceiveAsync(int id, int warehouseId, int userId)
    {
        var po = await _db.PurchaseOrders
            .Include(p => p.Items)
            .FirstOrDefaultAsync(p => p.Id == id);
        if (po == null || po.Status != "Approved") return false;

        foreach (var item in po.Items)
        {
            item.QuantityReceived = item.QuantityOrdered;
            await _stockService.AdjustStockAsync(new StockAdjustmentRequest(
                item.ProductId, warehouseId, item.QuantityOrdered, $"Received from PO {po.PONumber}",
                null, null), userId);
        }

        po.Status = "Received";
        po.ReceivedDate = DateTime.UtcNow;
        po.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return true;
    }

    private static PurchaseOrderDto MapToDto(PurchaseOrder p) =>
        new(p.Id, p.PONumber, p.SupplierId, p.Supplier.Name, p.Status, p.TotalAmount,
            p.PaymentStatus, p.OrderDate, p.ExpectedDeliveryDate, p.ReceivedDate,
            p.ApprovedByUserId, p.CreatedByUserId, $"{p.CreatedByUser.FirstName} {p.CreatedByUser.LastName}",
            p.CreatedAt);
}

