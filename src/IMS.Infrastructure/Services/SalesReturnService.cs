using IMS.Core.DTOs;
using IMS.Core.Entities;
using IMS.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace IMS.Infrastructure.Services;

public class SalesReturnService
{
    private readonly ApplicationDbContext _db;
    private readonly StockService _stockService;

    public SalesReturnService(ApplicationDbContext db, StockService stockService)
    {
        _db = db;
        _stockService = stockService;
    }

    public async Task<SalesReturnDto> CreateReturnAsync(SalesReturnRequest req, int userId)
    {
        var sale = await _db.Sales
            .Include(s => s.Items)
            .Include(s => s.Warehouse)
            .FirstOrDefaultAsync(s => s.Id == req.SaleId);
        if (sale == null) throw new InvalidOperationException("Sale not found");

        var salesReturn = new SalesReturn
        {
            SaleId = req.SaleId,
            Reason = req.Reason,
            CreatedByUserId = userId
        };

        decimal totalRefund = 0;
        foreach (var returnItem in req.Items)
        {
            var salesItem = sale.Items.FirstOrDefault(i => i.Id == returnItem.SalesItemId);
            if (salesItem == null || returnItem.Quantity > salesItem.Quantity) continue;

            var refundAmount = (salesItem.UnitPrice * returnItem.Quantity) * 
                (1 - salesItem.DiscountPercent / 100) * (1 + salesItem.TaxPercent / 100);

            salesReturn.Items.Add(new SalesReturnItem
            {
                SalesItemId = returnItem.SalesItemId,
                Quantity = returnItem.Quantity,
                RefundAmount = refundAmount,
                Reason = returnItem.Reason
            });

            totalRefund += refundAmount;

            // Restock the items
            await _stockService.AdjustStockAsync(new StockAdjustmentRequest(
                salesItem.ProductId, sale.WarehouseId, returnItem.Quantity,
                $"Return from Sale {sale.InvoiceNumber}", null, null), userId);
        }

        salesReturn.TotalRefund = totalRefund;
        sale.Status = "Returned";
        sale.UpdatedAt = DateTime.UtcNow;

        _db.SalesReturns.Add(salesReturn);
        await _db.SaveChangesAsync();

        return new SalesReturnDto(salesReturn.Id, salesReturn.SaleId, sale.InvoiceNumber,
            salesReturn.TotalRefund, salesReturn.Reason ?? "", salesReturn.ReturnDate);
    }
}
