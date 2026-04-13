namespace IMS.Core.DTOs;

public record PurchaseOrderDto(
    int Id,
    string PONumber,
    int SupplierId,
    string SupplierName,
    string Status,
    decimal TotalAmount,
    string PaymentStatus,
    DateTime? OrderDate,
    DateTime? ExpectedDeliveryDate,
    DateTime? ReceivedDate,
    int? ApprovedByUserId,
    int CreatedByUserId,
    string CreatedByUserName,
    DateTime CreatedAt
);

public record PurchaseOrderItemDto(
    int Id,
    int ProductId,
    string ProductName,
    string? ProductSku,
    int QuantityOrdered,
    int QuantityReceived,
    decimal UnitCost,
    decimal TotalCost
);

public record PurchaseOrderDetailDto(
    int Id,
    string PONumber,
    int SupplierId,
    string SupplierName,
    string Status,
    decimal TotalAmount,
    string PaymentStatus,
    DateTime? OrderDate,
    DateTime? ExpectedDeliveryDate,
    DateTime? ReceivedDate,
    List<PurchaseOrderItemDto> Items,
    DateTime CreatedAt
);

public record CreatePurchaseOrderRequest(
    int SupplierId,
    DateTime? OrderDate,
    DateTime? ExpectedDeliveryDate,
    List<PurchaseOrderItemRequest> Items
);

public record PurchaseOrderItemRequest(int ProductId, int Quantity, decimal UnitCost);

