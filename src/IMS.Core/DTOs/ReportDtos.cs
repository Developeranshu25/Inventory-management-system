namespace IMS.Core.DTOs;

public record DashboardStatsDto(
    int TotalProducts,
    int LowStockCount,
    int TotalWarehouses,
    int PendingPurchaseOrders,
    decimal TodaySales,
    decimal MonthSales
);

public record LowStockReportDto(
    int ProductId,
    string ProductName,
    string? Sku,
    int CurrentStock,
    int MinimumStockLevel,
    int Deficit
);

public record ExpiringItemsReportDto(
    int ProductId,
    string ProductName,
    string? BatchNumber,
    int Quantity,
    DateTime ExpiryDate,
    int DaysUntilExpiry
);

public record SalesReportDto(
    DateTime Date,
    int InvoiceCount,
    decimal TotalAmount,
    decimal TotalProfit
);

public record TopSellingProductDto(
    int ProductId,
    string ProductName,
    int QuantitySold,
    decimal TotalRevenue
);

