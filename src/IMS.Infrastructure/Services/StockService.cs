using IMS.Core.DTOs;
using IMS.Core.Entities;
using IMS.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace IMS.Infrastructure.Services;

public class StockService
{
    private readonly ApplicationDbContext _db;

    public StockService(ApplicationDbContext db) => _db = db;

    public async Task<List<StockLevelDto>> GetStockLevelsAsync(int? productId = null, int? warehouseId = null)
    {
        var query = _db.StockLevels
            .Include(s => s.Product)
            .Include(s => s.Warehouse)
            .AsQueryable();

        if (productId.HasValue)
            query = query.Where(s => s.ProductId == productId.Value);
        if (warehouseId.HasValue)
            query = query.Where(s => s.WarehouseId == warehouseId.Value);

        var levels = await query.OrderBy(s => s.Product.Name).ToListAsync();
        return levels.Select(MapToDto).ToList();
    }

    public async Task<PagedResult<StockTransactionDto>> GetTransactionsAsync(int page = 1, int pageSize = 50,
        int? productId = null, int? warehouseId = null, string? transactionType = null)
    {
        var query = _db.StockTransactions
            .Include(t => t.Product)
            .Include(t => t.Warehouse)
            .Include(t => t.ToWarehouse)
            .AsQueryable();

        if (productId.HasValue)
            query = query.Where(t => t.ProductId == productId.Value);
        if (warehouseId.HasValue)
            query = query.Where(t => t.WarehouseId == warehouseId.Value);
        if (!string.IsNullOrWhiteSpace(transactionType))
            query = query.Where(t => t.TransactionType == transactionType);

        var total = await query.CountAsync();
        var items = await query
            .OrderByDescending(t => t.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PagedResult<StockTransactionDto>(
            items.Select(MapToDto).ToList(), total, page, pageSize);
    }

    public async Task<StockTransactionDto> AdjustStockAsync(StockAdjustmentRequest req, int userId)
    {
        var level = await _db.StockLevels
            .FirstOrDefaultAsync(s => s.ProductId == req.ProductId && s.WarehouseId == req.WarehouseId);

        if (level == null)
        {
            level = new StockLevel
            {
                ProductId = req.ProductId,
                WarehouseId = req.WarehouseId,
                Quantity = 0,
                BatchNumber = req.BatchNumber,
                ExpiryDate = req.ExpiryDate
            };
            _db.StockLevels.Add(level);
        }

        level.Quantity += req.Quantity;
        level.UpdatedAt = DateTime.UtcNow;
        if (req.BatchNumber != null) level.BatchNumber = req.BatchNumber;
        if (req.ExpiryDate.HasValue) level.ExpiryDate = req.ExpiryDate;

        var transaction = new StockTransaction
        {
            ProductId = req.ProductId,
            WarehouseId = req.WarehouseId,
            TransactionType = req.Quantity > 0 ? "StockIn" : "StockOut",
            Quantity = req.Quantity,
            Notes = req.Notes,
            UserId = userId,
            BatchNumber = req.BatchNumber,
            ExpiryDate = req.ExpiryDate
        };
        _db.StockTransactions.Add(transaction);
        await _db.SaveChangesAsync();

        return MapToDto(transaction);
    }

    public async Task<StockTransactionDto> TransferStockAsync(StockTransferRequest req, int userId)
    {
        var fromLevel = await _db.StockLevels
            .FirstOrDefaultAsync(s => s.ProductId == req.ProductId && s.WarehouseId == req.FromWarehouseId);
        if (fromLevel == null || fromLevel.Quantity < req.Quantity)
            throw new InvalidOperationException("Insufficient stock for transfer");

        fromLevel.Quantity -= req.Quantity;
        fromLevel.UpdatedAt = DateTime.UtcNow;

        var toLevel = await _db.StockLevels
            .FirstOrDefaultAsync(s => s.ProductId == req.ProductId && s.WarehouseId == req.ToWarehouseId);
        if (toLevel == null)
        {
            toLevel = new StockLevel
            {
                ProductId = req.ProductId,
                WarehouseId = req.ToWarehouseId,
                Quantity = 0
            };
            _db.StockLevels.Add(toLevel);
        }
        toLevel.Quantity += req.Quantity;
        toLevel.UpdatedAt = DateTime.UtcNow;

        var transaction = new StockTransaction
        {
            ProductId = req.ProductId,
            WarehouseId = req.FromWarehouseId,
            ToWarehouseId = req.ToWarehouseId,
            TransactionType = "Transfer",
            Quantity = -req.Quantity,
            Notes = req.Notes,
            UserId = userId
        };
        _db.StockTransactions.Add(transaction);

        var receiveTransaction = new StockTransaction
        {
            ProductId = req.ProductId,
            WarehouseId = req.ToWarehouseId,
            TransactionType = "Transfer",
            Quantity = req.Quantity,
            Notes = $"Transferred from Warehouse {req.FromWarehouseId}",
            UserId = userId
        };
        _db.StockTransactions.Add(receiveTransaction);

        await _db.SaveChangesAsync();
        return MapToDto(transaction);
    }

    private static StockLevelDto MapToDto(StockLevel s) =>
        new(s.Id, s.ProductId, s.Product.Name, s.Product.Sku, s.WarehouseId, s.Warehouse.Name,
            s.Quantity, s.BatchNumber, s.ExpiryDate, s.UpdatedAt);

    private static StockTransactionDto MapToDto(StockTransaction t) =>
        new(t.Id, t.ProductId, t.Product.Name, t.WarehouseId, t.Warehouse.Name, t.TransactionType,
            t.Quantity, t.ToWarehouseId, t.ToWarehouse?.Name, t.ReferenceNumber, t.Notes, t.CreatedAt);
}

