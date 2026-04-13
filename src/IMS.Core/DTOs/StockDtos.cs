namespace IMS.Core.DTOs;

public record StockLevelDto(
    int Id,
    int ProductId,
    string ProductName,
    string? ProductSku,
    int WarehouseId,
    string WarehouseName,
    int Quantity,
    string? BatchNumber,
    DateTime? ExpiryDate,
    DateTime UpdatedAt
);

public record StockTransactionDto(
    int Id,
    int ProductId,
    string ProductName,
    int WarehouseId,
    string WarehouseName,
    string TransactionType,
    int Quantity,
    int? ToWarehouseId,
    string? ToWarehouseName,
    string? ReferenceNumber,
    string? Notes,
    DateTime CreatedAt
);

public record StockAdjustmentRequest(
    int ProductId,
    int WarehouseId,
    int Quantity,
    string? Notes,
    string? BatchNumber,
    DateTime? ExpiryDate
);

public record StockTransferRequest(
    int ProductId,
    int FromWarehouseId,
    int ToWarehouseId,
    int Quantity,
    string? Notes
);

