namespace IMS.Core.DTOs;

public record SaleDto(
    int Id,
    string InvoiceNumber,
    string Status,
    decimal SubTotal,
    decimal TaxAmount,
    decimal DiscountAmount,
    decimal TotalAmount,
    string PaymentStatus,
    string? CustomerName,
    int WarehouseId,
    string WarehouseName,
    DateTime SaleDate,
    DateTime CreatedAt
);

public record SalesItemDto(
    int Id,
    int ProductId,
    string ProductName,
    string? ProductSku,
    int Quantity,
    decimal UnitPrice,
    decimal DiscountPercent,
    decimal TaxPercent,
    decimal TotalPrice
);

public record SaleDetailDto(
    int Id,
    string InvoiceNumber,
    string Status,
    decimal SubTotal,
    decimal TaxAmount,
    decimal DiscountAmount,
    decimal TotalAmount,
    string PaymentStatus,
    string? CustomerName,
    string? CustomerPhone,
    string? CustomerEmail,
    int WarehouseId,
    string WarehouseName,
    List<SalesItemDto> Items,
    DateTime SaleDate,
    DateTime CreatedAt
);

public record CreateSaleRequest(
    int WarehouseId,
    string? CustomerName,
    string? CustomerPhone,
    string? CustomerEmail,
    List<SalesItemRequest> Items,
    decimal TaxPercent = 0,
    decimal DiscountAmount = 0
);

public record SalesItemRequest(int ProductId, int Quantity, decimal UnitPrice, decimal DiscountPercent = 0);

